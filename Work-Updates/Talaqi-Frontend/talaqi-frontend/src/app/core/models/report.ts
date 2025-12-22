export enum ReportStatus {
  Pending = 0,
  UnderReview = 1,
  Resolved = 2,
  Rejected = 3
}

export enum ReportTargetType {
  User = 0,
  Conversation = 1,
  Message = 2,
  General = 3
}

export enum ReportReason {
  Spam = 0,
  Harassment = 1,
  InappropriateContent = 2,
  FakeItem = 3,
  Scam = 4,
  Other = 5
}

export interface CreateReportDto {
  targetType: ReportTargetType;
  targetUserId?: string;
  conversationId?: string;
  messageId?: string;
  reason: ReportReason;
  description?: string;
}

export interface ReportDto {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: ReportTargetType;
  targetUserId?: string;
  targetUserName?: string;
  conversationId?: string;
  messageId?: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateReportStatusDto {
  status: ReportStatus;
  adminNotes?: string;
}

export interface ReportFilterDto {
  status?: ReportStatus;
  reason?: ReportReason;
  targetType?: ReportTargetType;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  page: number;
  pageSize: number;
}
