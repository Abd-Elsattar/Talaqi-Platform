using System;
using System.Collections.Generic;
using Talaqi.Domain.Entities;
using Talaqi.Domain.Enums.Messaging;

namespace Talaqi.Domain.Entities.Messaging
{
    public class Conversation : BaseEntity
    {
        public ConversationType Type { get; set; } = ConversationType.Private;
        
        // For Group/Channel
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }

        // Metadata for linking to Match (Optional)
        public Guid? MatchId { get; set; }

        // Optimization: Last message preview
        public Guid? LastMessageId { get; set; }
        public DateTime LastMessageAt { get; set; }

        // Navigation
        public virtual ICollection<ConversationParticipant> Participants { get; set; } = new List<ConversationParticipant>();
        public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
        
        // Explicit relationship to LastMessage (optional, be careful with cycles)
        // public virtual Message? LastMessage { get; set; } 
    }
}
