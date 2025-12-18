using Talaqi.Domain.Enums.Messaging;

namespace Talaqi.Application.DTOs.Messaging
{
    public class SendMessageDto
    {
        public Guid? ConversationId { get; set; } // If null, must provide ReceiverId to start new
        public Guid? ReceiverId { get; set; } // For 1-on-1 creation
        public Guid? MatchId { get; set; } // Optional context
        
        public string Content { get; set; } = string.Empty;
        public MessageType Type { get; set; } = MessageType.Text;
        
        public Guid? ReplyToMessageId { get; set; }
    }
    
    public class MarkReadDto
    {
        public Guid ConversationId { get; set; }
        public Guid MessageId { get; set; } // The message that was read (implies all before it)
    }
}
