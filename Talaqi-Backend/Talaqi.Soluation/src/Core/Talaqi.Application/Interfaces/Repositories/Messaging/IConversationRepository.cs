using Talaqi.Domain.Entities.Messaging;

namespace Talaqi.Application.Interfaces.Repositories.Messaging
{
    public interface IConversationRepository : IBaseRepository<Conversation>
    {
        Task<Conversation?> GetByIdWithParticipantsAsync(Guid conversationId);
        Task<IEnumerable<Conversation>> GetUserConversationsAsync(Guid userId, int page, int pageSize);
        Task<Conversation?> GetPrivateConversationAsync(Guid userA, Guid userB);
        Task<Conversation?> GetByMatchIdAsync(Guid matchId);
    }
}
