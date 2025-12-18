using Microsoft.EntityFrameworkCore;
using Talaqi.Application.Interfaces.Repositories.Messaging;
using Talaqi.Domain.Entities.Messaging;
using Talaqi.Domain.Enums.Messaging;
using Talaqi.Infrastructure.Data;

namespace Talaqi.Infrastructure.Repositories.Messaging
{
    public class ConversationRepository : BaseRepository<Conversation>, IConversationRepository
    {
        public ConversationRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Conversation?> GetByIdWithParticipantsAsync(Guid conversationId)
        {
            return await _dbSet
                .Include(c => c.Participants)
                .ThenInclude(p => p.User)
                .FirstOrDefaultAsync(c => c.Id == conversationId);
        }

        public async Task<IEnumerable<Conversation>> GetUserConversationsAsync(Guid userId, int page, int pageSize)
        {
            // Get conversations where user is a participant
            // Order by LastMessageAt descending
            return await _dbSet
                .Where(c => c.Participants.Any(p => p.UserId == userId))
                .Include(c => c.Participants)
                    .ThenInclude(p => p.User)
                .OrderByDescending(c => c.LastMessageAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<Conversation?> GetPrivateConversationAsync(Guid userA, Guid userB)
        {
            return await _dbSet
                .Where(c => c.Type == ConversationType.Private)
                .Where(c => c.Participants.Any(p => p.UserId == userA) && 
                            c.Participants.Any(p => p.UserId == userB))
                .Include(c => c.Participants) // Include to verify only 2 participants?
                .FirstOrDefaultAsync();
        }

        public async Task<Conversation?> GetByMatchIdAsync(Guid matchId)
        {
            return await _dbSet
                .Include(c => c.Participants)
                .FirstOrDefaultAsync(c => c.MatchId == matchId);
        }
    }
}
