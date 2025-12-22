import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Conversation, Message, SendMessageRequest } from '../models/messaging.model';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}/chat`;

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  private conversationReadSubject = new BehaviorSubject<string | null>(null);
  public conversationRead$ = this.conversationReadSubject.asObservable();

  constructor(private http: HttpClient) {}

  updateUnreadCount(count: number) {
    this.unreadCountSubject.next(count);
  }

  incrementUnreadCount() {
    this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
  }

  decrementUnreadCount(amount: number = 1) {
    const current = this.unreadCountSubject.value;
    this.unreadCountSubject.next(Math.max(0, current - amount));
  }

  getConversations(page: number = 1, pageSize: number = 20): Observable<ApiResponse<Conversation[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<Conversation[]>>(`${this.apiUrl}/conversations`, { params }).pipe(
      tap(response => {
        if (response.isSuccess && response.data) {
          const totalUnread = response.data.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
          this.updateUnreadCount(totalUnread);
        }
      })
    );
  }

  getConversation(id: string): Observable<ApiResponse<Conversation>> {
    return this.http.get<ApiResponse<Conversation>>(`${this.apiUrl}/conversations/${id}`);
  }

  startConversation(request: { userId: string; matchId?: string }): Observable<ApiResponse<Conversation>> {
    return this.http.post<ApiResponse<Conversation>>(`${this.apiUrl}/conversations/start`, request);
  }

  getMessages(conversationId: string, page: number = 1, pageSize: number = 50): Observable<ApiResponse<Message[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<Message[]>>(`${this.apiUrl}/conversations/${conversationId}/messages`, { params });
  }

  deleteMessage(messageId: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/messages/${messageId}`);
  }

  sendMessage(request: SendMessageRequest): Observable<ApiResponse<Message>> {
    return this.http.post<ApiResponse<Message>>(`${this.apiUrl}/messages`, request);
  }

  markAsRead(conversationId: string, messageId: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/conversations/${conversationId}/read`, { messageId }).pipe(
      tap(() => {
        this.conversationReadSubject.next(conversationId);
      })
    );
  }
}
