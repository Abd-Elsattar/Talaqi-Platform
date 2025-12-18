using System;
using Talaqi.Domain.Entities;

namespace Talaqi.Domain.Entities.Messaging
{
    public class ConversationParticipant
    {
        public Guid ConversationId { get; set; }
        public Guid UserId { get; set; }

        public string? Nickname { get; set; } // Optional nickname in this chat
        public bool IsAdmin { get; set; } // For groups
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
        
        // For Read Receipts / Unread Counts
        public Guid? LastReadMessageId { get; set; }
        public int UnreadCount { get; set; }

        // Settings
        public bool IsMuted { get; set; }
        public bool IsPinned { get; set; }

        // Navigation
        public virtual Conversation Conversation { get; set; } = null!;
        public virtual User User { get; set; } = null!;
        public virtual Message? LastReadMessage { get; set; }
    }
}
