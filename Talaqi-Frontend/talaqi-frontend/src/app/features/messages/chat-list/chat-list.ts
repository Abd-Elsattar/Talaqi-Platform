import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ChatService } from '../../../core/services/chat.service';
import { SignalRService } from '../../../core/services/signalr.service';
import { TokenService } from '../../../core/services/token.service';
import { Conversation } from '../../../core/models/messaging.model';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './chat-list.html',
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    .chat-list-container {
      height: 100%;
      overflow-y: auto;
    }
    .chat-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .chat-item:hover {
      background-color: #f8f9fa;
    }
    .chat-item.unread {
      background-color: #e8f0fe;
    }
    .chat-item.active {
      background-color: #e3f2fd;
      border-left: 4px solid #0d6efd;
    }
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 1rem;
      object-fit: cover;
    }
    .chat-info {
      flex: 1;
    }
    .chat-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }
    .chat-name {
      font-weight: 600;
      color: #333;
    }
    .chat-time {
      font-size: 0.8rem;
      color: #777;
    }
    .chat-preview {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .last-message {
      color: #666;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }
    .unread-badge {
      background-color: #007bff;
      color: white;
      border-radius: 50%;
      padding: 0.2rem 0.5rem;
      font-size: 0.75rem;
    }
    .no-chats {
        text-align: center;
        margin-top: 3rem;
        color: #777;
    }
  `]
})
export class ChatListComponent implements OnInit {
  conversations: Conversation[] = [];
  loading = true;
  currentUser: any;
  private router = inject(Router);

  constructor(
    private chatService: ChatService,
    private signalRService: SignalRService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.tokenService.getCurrentUser();
    this.loadConversations();

    // Listen for real-time updates
    this.signalRService.startConnection();
    this.signalRService.messageReceived$.subscribe(message => {
        if (message) {
            this.updateConversationList(message);
        }
    });

    // Listen for read status
    this.chatService.conversationRead$.subscribe(convId => {
      if (convId) {
        const conv = this.conversations.find(c => c.id === convId);
        if (conv && conv.unreadCount > 0) {
          const count = conv.unreadCount;
          conv.unreadCount = 0;
          this.chatService.decrementUnreadCount(count);
        }
      }
    });
  }

  isActive(chatId: string): boolean {
    return this.router.url.includes(`/chat/${chatId}`);
  }

  loadConversations() {
    this.loading = true;
    this.chatService.getConversations().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.conversations = response.data || [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load chats', err);
        this.loading = false;
      }
    });
  }

  updateConversationList(message: any) {
      // Find conversation
      const index = this.conversations.findIndex(c => c.id === message.conversationId);
      if (index !== -1) {
          // Update existing
          const conv = this.conversations[index];
          conv.lastMessage = message;

          if (!this.isActive(message.conversationId) && message.senderId !== this.currentUser?.id) {
             conv.unreadCount++;
          }

          // Move to top
          this.conversations.splice(index, 1);
          this.conversations.unshift(conv);
      } else {
          // New conversation (reload or fetch single)
          this.loadConversations();
      }
  }

  getParticipantName(conv: Conversation): string {
    if (conv.type === 0) { // Private
       const other = conv.participants.find((p: any) => p.userId !== this.currentUser?.id);
       return other ? other.displayName : 'Unknown User';
    }
    return conv.title || 'Group Chat';
  }

  getParticipantImage(conv: Conversation): string {
      if (conv.type === 0) {
          const other = conv.participants.find((p: any) => p.userId !== this.currentUser?.id);
          return other?.profilePictureUrl || 'assets/images/Default User Icon.jpg';
      }
      return conv.imageUrl || 'assets/images/Default User Icon.jpg';
  }
}
