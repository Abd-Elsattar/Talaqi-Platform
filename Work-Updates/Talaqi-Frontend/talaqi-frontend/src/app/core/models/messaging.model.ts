export enum ConversationType {
  Private = 0,
  Group = 1,
  Channel = 2
}

export enum MessageType {
  Text = 0,
  Image = 1,
  File = 2,
  Voice = 3,
  System = 4
}

export enum MessageDeliveryStatus {
  Pending = 0,
  Sent = 1,
  Delivered = 2,
  Seen = 3,
  Failed = 4
}

export interface ConversationParticipant {
  userId: string;
  displayName: string;
  profilePictureUrl?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface Attachment {
  url: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId?: string;
  senderName: string;
  senderProfilePictureUrl?: string;
  type: MessageType;
  content: string;
  createdAt: Date; // Mapped from CreatedAt in backend
  editedAt?: Date;
  deliveryStatus: MessageDeliveryStatus;
  replyToMessageId?: string;
  replyToMessage?: Message;
  attachments: Attachment[];
}

export interface Conversation {
  id: string;
  type: ConversationType;
  title?: string;
  imageUrl?: string;
  matchId?: string;
  lastMessage?: Message;
  unreadCount: number;
  participants: ConversationParticipant[];
}

export interface SendMessageRequest {
  conversationId?: string;
  receiverId?: string;
  matchId?: string;
  content: string;
  type: MessageType;
  replyToMessageId?: string;
}
