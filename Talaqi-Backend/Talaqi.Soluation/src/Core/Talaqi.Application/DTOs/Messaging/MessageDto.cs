using System;
using System.Collections.Generic;
using Talaqi.Domain.Enums.Messaging;

namespace Talaqi.Application.DTOs.Messaging
{
    public class MessageDto
    {
        public Guid Id { get; set; }
        public Guid ConversationId { get; set; }
        public Guid? SenderId { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public string? SenderProfilePictureUrl { get; set; }
        
        public MessageType Type { get; set; }
        public string Content { get; set; } = string.Empty;
        
        public DateTime SentAt { get; set; }
        public DateTime? EditedAt { get; set; }
        
        public MessageDeliveryStatus Status { get; set; } // For the current user view
        
        public Guid? ReplyToMessageId { get; set; }
        public MessageDto? ReplyToMessage { get; set; }
        
        public List<AttachmentDto> Attachments { get; set; } = new();
    }

    public class AttachmentDto
    {
        public string Url { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long SizeBytes { get; set; }
    }
}
