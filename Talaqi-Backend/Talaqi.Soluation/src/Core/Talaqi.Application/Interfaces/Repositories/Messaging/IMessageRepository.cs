using Talaqi.Domain.Entities.Messaging;

namespace Talaqi.Application.Interfaces.Repositories.Messaging
{
    public interface IMessageRepository : IBaseRepository<Message>
    {
        Task<IEnumerable<Message>> GetConversationMessagesAsync(Guid conversationId, int page, int pageSize);
        Task<int> GetUnreadCountAsync(Guid conversationId, Guid userId, Guid? lastReadMessageId);
        Task MarkMessagesAsReadAsync(Guid conversationId, Guid userId, Guid messageId); // Bulk update
    }
}
