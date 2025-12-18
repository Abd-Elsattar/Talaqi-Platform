using Talaqi.Application.Common;
using Talaqi.Application.DTOs.Messaging;

namespace Talaqi.Application.Interfaces.Services
{
    public interface IMessagingService
    {
        Task<Result<IEnumerable<ConversationDto>>> GetUserConversationsAsync(Guid userId, int page = 1, int pageSize = 20);
        Task<Result<ConversationDto>> GetConversationAsync(Guid conversationId, Guid userId);
        Task<Result<ConversationDto>> StartPrivateConversationAsync(Guid senderId, Guid receiverId, Guid? matchId = null);
        
        Task<Result<MessageDto>> SendMessageAsync(Guid senderId, SendMessageDto request);
        Task<Result<IEnumerable<MessageDto>>> GetMessagesAsync(Guid conversationId, Guid userId, int page = 1, int pageSize = 50);
        
        Task<Result> MarkAsReadAsync(Guid conversationId, Guid userId, Guid messageId);
        Task<Result> DeleteMessageAsync(Guid messageId, Guid userId);
    }
}
