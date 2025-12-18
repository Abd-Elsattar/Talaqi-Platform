import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel, HttpTransportType } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from './token.service';
import { Message } from '../models/messaging.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection | null = null;
  private hubUrl = environment.apiUrl.replace('/api', '') + '/api/hubs/chat'; // Adjust based on your API URL structure

  private messageReceivedSubject = new BehaviorSubject<Message | null>(null);
  public messageReceived$ = this.messageReceivedSubject.asObservable();

  private typingSubject = new BehaviorSubject<{ conversationId: string; userId: string } | null>(null);
  public typing$ = this.typingSubject.asObservable();

  private stopTypingSubject = new BehaviorSubject<{ conversationId: string; userId: string } | null>(null);
  public stopTyping$ = this.stopTypingSubject.asObservable();

  private newReportSubject = new BehaviorSubject<any | null>(null);
  public newReport$ = this.newReportSubject.asObservable();

  constructor(private tokenService: TokenService) {}

  public async startConnection(): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      return;
    }

    const token = this.tokenService.getAccessToken();
    if (!token) {
      console.warn('SignalR: No access token available');
      return;
    }

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .configureLogging(LogLevel.Debug)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveMessage', (message: Message) => {
      this.messageReceivedSubject.next(message);
    });

    this.hubConnection.on('UserTyping', (data: { conversationId: string; userId: string }) => {
      this.typingSubject.next(data);
    });

    this.hubConnection.on('UserStoppedTyping', (data: { conversationId: string; userId: string }) => {
        this.stopTypingSubject.next(data);
      });

    this.hubConnection.on('ReceiveNewReport', (data: any) => {
        this.newReportSubject.next(data);
    });

    try {
      await this.hubConnection.start();
      console.log('SignalR Connection started');
    } catch (err) {
      console.error('Error while starting connection: ' + err);
      // Retry logic could go here
    }
  }

  public async stopConnection(): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      await this.hubConnection.stop();
      console.log('SignalR Connection stopped');
    }
  }

  public async joinConversation(conversationId: string): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      await this.hubConnection.invoke('JoinConversation', conversationId);
    }
  }

  public async leaveConversation(conversationId: string): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      await this.hubConnection.invoke('LeaveConversation', conversationId);
    }
  }

  public async sendTyping(conversationId: string): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      await this.hubConnection.invoke('Typing', conversationId);
    }
  }

  public async sendStopTyping(conversationId: string): Promise<void> {
      if (this.hubConnection?.state === HubConnectionState.Connected) {
        await this.hubConnection.invoke('StopTyping', conversationId);
      }
    }
}
