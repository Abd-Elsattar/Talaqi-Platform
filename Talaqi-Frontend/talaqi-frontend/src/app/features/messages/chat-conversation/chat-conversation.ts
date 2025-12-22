import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChatService } from '../../../core/services/chat.service';
import { SignalRService } from '../../../core/services/signalr.service';
import { TokenService } from '../../../core/services/token.service';
import { MatchService } from '../../../core/services/match.service';
import { ReportService } from '../../../core/services/report.service';
import { Conversation, Message, MessageType } from '../../../core/models/messaging.model';
import { MatchDto } from '../../../core/models/match';
import { CreateReportDto, ReportReason, ReportTargetType } from '../../../core/models/report';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat-conversation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './chat-conversation.html',
  styleUrl: './chat-conversation.css'
})
export class ChatConversationComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  conversationId: string | null = null;
  conversation: Conversation | null = null;
  matchDetails: MatchDto | null = null;
  messages: Message[] = [];
  newMessage = '';
  loading = true;
  currentUser: any;

  private messageSub: Subscription | null = null;
  private typingSub: Subscription | null = null;
  private stopTypingSub: Subscription | null = null;

  typingUser: string | null = null;
  typingTimeout: any;

  groupedMessages: { date: string; messages: Message[] }[] = [];

  // Report Modal State
  showReportModal = false;
  reportTargetType: ReportTargetType = ReportTargetType.User;
  reportTargetId: string | null = null;
  reportReason: ReportReason = ReportReason.Spam;
  reportDescription = '';
  reportReasons: { value: ReportReason; label: string }[] = [];
  isReporting = false;
  private translate = inject(TranslateService);

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private signalRService: SignalRService,
    private tokenService: TokenService,
    private matchService: MatchService,
    private reportService: ReportService
  ) {}

  private initializeReportReasons() {
    this.reportReasons = [
      { value: ReportReason.Spam, label: this.translate.instant('messages.report.reasons.spam') },
      { value: ReportReason.Harassment, label: this.translate.instant('messages.report.reasons.harassment') },
      { value: ReportReason.InappropriateContent, label: this.translate.instant('messages.report.reasons.inappropriate') },
      { value: ReportReason.Scam, label: this.translate.instant('messages.report.reasons.scam') },
      { value: ReportReason.Other, label: this.translate.instant('messages.report.reasons.other') }
    ];
  }

  ngOnInit(): void {
    this.currentUser = this.tokenService.getCurrentUser();
    this.initializeReportReasons();

    this.route.paramMap.subscribe(params => {
      const newId = params.get('id');
      if (newId && newId !== this.conversationId) {
        // Cleanup old conversation
        if (this.conversationId) {
          this.signalRService.leaveConversation(this.conversationId);
        }

        this.conversationId = newId;
        this.messages = [];
        this.conversation = null;
        this.matchDetails = null;
        this.loading = true;

        this.loadConversation();
        this.loadMessages();
        this.setupSignalR();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.messageSub) this.messageSub.unsubscribe();
    if (this.typingSub) this.typingSub.unsubscribe();
    if (this.stopTypingSub) this.stopTypingSub.unsubscribe();

    if (this.conversationId) {
        this.signalRService.leaveConversation(this.conversationId);
    }
  }

  ngAfterViewChecked() {
      this.scrollToBottom();
  }

  // Reporting Logic
  openReportUserModal() {
    if (!this.conversation) return;

    // In a 1-on-1 chat, the target is the other user
    const otherUserId = this.conversation.participants.find(p => p.userId !== this.currentUser.id)?.userId;

    if (otherUserId) {
      this.reportTargetType = ReportTargetType.User;
      this.reportTargetId = otherUserId;
      this.showReportModal = true;
      this.resetReportForm();
    }
  }

  openReportMessageModal(messageId: string) {
    this.reportTargetType = ReportTargetType.Message;
    this.reportTargetId = messageId;
    this.showReportModal = true;
    this.resetReportForm();
  }

  closeReportModal() {
    this.showReportModal = false;
    this.resetReportForm();
  }

  resetReportForm() {
    this.reportReason = ReportReason.Spam;
    this.reportDescription = '';
    this.isReporting = false;
  }

  submitReport() {
    if (!this.reportTargetId) return;

    this.isReporting = true;
    const dto: CreateReportDto = {
      targetType: this.reportTargetType,
      reason: Number(this.reportReason),
      description: this.reportDescription
    };

    if (this.reportTargetType === ReportTargetType.User) {
      dto.targetUserId = this.reportTargetId;
    } else if (this.reportTargetType === ReportTargetType.Message) {
      dto.messageId = this.reportTargetId;
    } else if (this.reportTargetType === ReportTargetType.Conversation) {
        dto.conversationId = this.reportTargetId;
    }

    this.reportService.createReport(dto).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          Swal.fire(
            this.translate.instant('messages.report.success.title'),
            this.translate.instant('messages.report.success.text'),
            'success'
          );
          this.closeReportModal();
        } else {
          Swal.fire(
            this.translate.instant('messages.report.error.title'),
            this.translate.instant('messages.report.error.text') + ': ' + res.message,
            'error'
          );
        }
        this.isReporting = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire(
          this.translate.instant('messages.report.error.title'),
          this.translate.instant('messages.report.error.unexpected'),
          'error'
        );
        this.isReporting = false;
      }
    });
  }

  private groupMessages() {
    if (!this.messages || this.messages.length === 0) {
      this.groupedMessages = [];
      return;
    }

    const groups: { date: string; messages: Message[] }[] = [];

    this.messages.forEach(msg => {
      try {
        let dateObj: Date;

        // Handle missing or invalid date immediately
        if (!msg.createdAt) {
             // console.warn('Message missing createdAt, using current date:', msg);
             dateObj = new Date();
        } else if (typeof msg.createdAt === 'string') {
            dateObj = new Date(msg.createdAt);
        } else {
            dateObj = msg.createdAt;
        }

        // Check if date is valid
        if (isNaN(dateObj.getTime())) {
          console.warn('Invalid date for message:', msg);
          // Fallback to current date
           dateObj = new Date();
        }

        const date = dateObj.toLocaleDateString();
        let group = groups.find(g => g.date === date);
        if (!group) {
          group = { date, messages: [] };
          groups.push(group);
        }
        group.messages.push(msg);
      } catch (e) {
        console.error('Error grouping message:', msg, e);
      }
    });

    this.groupedMessages = groups;
  }

  scrollToBottom(): void {
      try {
          this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      } catch(err) { }
  }

  setupSignalR() {
    this.signalRService.startConnection().then(() => {
        if (this.conversationId) {
            this.signalRService.joinConversation(this.conversationId);
        }
    });

    this.messageSub = this.signalRService.messageReceived$.subscribe(message => {
      if (message && message.conversationId === this.conversationId) {
        this.messages.push(message);
        this.groupMessages();
        // Mark as read immediately if user is viewing and message is not from me
        if (message.senderId !== this.currentUser?.id) {
             this.markAsRead(message.id);
        }
      }
    });

    this.typingSub = this.signalRService.typing$.subscribe(data => {
        if (data && data.conversationId === this.conversationId && data.userId !== this.currentUser.id) {
            this.typingUser = this.translate.instant('messages.chat.typing');
        }
    });

    this.stopTypingSub = this.signalRService.stopTyping$.subscribe(data => {
        if (data && data.conversationId === this.conversationId) {
            this.typingUser = null;
        }
    });
  }

  loadConversation() {
    if (!this.conversationId) return;
    this.chatService.getConversation(this.conversationId).subscribe(res => {
      if (res.isSuccess && res.data) {
        this.conversation = res.data;

        // Load match details if this is a match-based conversation
        if (this.conversation.matchId) {
            this.matchService.getById(this.conversation.matchId).subscribe(mRes => {
                if (mRes.isSuccess && mRes.data) {
                    this.matchDetails = mRes.data;
                }
            });
        }
      }
    });
  }

  loadMessages() {
    if (!this.conversationId) return;
    this.loading = true;
    this.chatService.getMessages(this.conversationId).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.messages = res.data.reverse(); // Show oldest first (at top), newest at bottom
          this.groupMessages(); // Group initial load

          // Mark last message as read
          if (this.messages.length > 0) {
               const lastMsg = this.messages[this.messages.length - 1];
               if (lastMsg.senderId !== this.currentUser.id) {
                   this.markAsRead(lastMsg.id);
               }
          }
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading messages:', err);
        this.loading = false;
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.conversationId) return;

    const content = this.newMessage;
    this.newMessage = ''; // Optimistic clear

    this.chatService.sendMessage({
      conversationId: this.conversationId,
      content: content,
      type: MessageType.Text
    }).subscribe(res => {
      if (res.isSuccess && res.data) {
        this.messages.push(res.data);
        this.groupMessages(); // Re-group on send
        this.signalRService.sendStopTyping(this.conversationId!);
      } else {
          // Restore on failure
          this.newMessage = content;
          Swal.fire(
            this.translate.instant('messages.chat.error.title'),
            this.translate.instant('messages.chat.error.sendFailed'),
            'error'
          );
      }
    });
  }

  onTyping() {
      if (!this.conversationId) return;
      this.signalRService.sendTyping(this.conversationId);

      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(() => {
          if (this.conversationId)
            this.signalRService.sendStopTyping(this.conversationId);
      }, 1000);
  }

  markAsRead(messageId: string) {
      if (!this.conversationId) return;
      this.chatService.markAsRead(this.conversationId, messageId).subscribe();
  }

  deleteMessage(messageId: string) {
    Swal.fire({
      title: this.translate.instant('messages.chat.delete.title'),
      text: this.translate.instant('messages.chat.delete.text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('messages.chat.delete.confirm'),
      cancelButtonText: this.translate.instant('messages.chat.delete.cancel')
    }).then(result => {
      if (result.isConfirmed) {
        this.chatService.deleteMessage(messageId).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.messages = this.messages.filter(m => m.id !== messageId);
              this.groupMessages();
            } else {
              Swal.fire(
                this.translate.instant('messages.chat.error.title'),
                this.translate.instant('messages.chat.error.deleteFailed'),
                'error'
              );
            }
          },
          error: () => {
            Swal.fire(
              this.translate.instant('messages.chat.error.title'),
              this.translate.instant('messages.chat.error.deleteFailed'),
              'error'
            );
          }
        });
      }
    });
  }

  getParticipantName(): string {
    if (!this.conversation) return 'Chat';
    if (this.conversation.type === 0) {
      const other = this.conversation.participants.find((p: any) => p.userId !== this.currentUser?.id);
      return other ? other.displayName : 'Unknown';
    }
    return this.conversation.title || 'Group';
  }

  getParticipantImage(): string {
      const defaultImg = 'https://ui-avatars.com/api/?name=User&background=random';
      if (!this.conversation) return defaultImg;
      if (this.conversation.type === 0) {
          const other = this.conversation.participants.find((p: any) => p.userId !== this.currentUser?.id);
          return other?.profilePictureUrl || defaultImg;
      }
      return this.conversation.imageUrl || defaultImg;
  }
}
