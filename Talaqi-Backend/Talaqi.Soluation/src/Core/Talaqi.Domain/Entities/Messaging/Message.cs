using System;
using System.Collections.Generic;
using Talaqi.Domain.Entities;
using Talaqi.Domain.Enums.Messaging;

namespace Talaqi.Domain.Entities.Messaging
{
    public class Message : BaseEntity
    {
        public Guid ConversationId { get; set; }
        public Guid? SenderId { get; set; } // Null for System messages

        public MessageType Type { get; set; } = MessageType.Text;
        public string Content { get; set; } = string.Empty; // Text content or system message

        // Reply support
        public Guid? ReplyToMessageId { get; set; }

        // Edit/Delete history
        public bool IsEdited { get; set; }
        public DateTime? EditedAt { get; set; }
        public DateTime? DeletedForEveryoneAt { get; set; }

        // Navigation
        public virtual Conversation Conversation { get; set; } = null!;
        public virtual User? Sender { get; set; }
        public virtual Message? ReplyToMessage { get; set; }
        
        public virtual ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
        public virtual ICollection<MessageDelivery> Deliveries { get; set; } = new List<MessageDelivery>();
    }
}
