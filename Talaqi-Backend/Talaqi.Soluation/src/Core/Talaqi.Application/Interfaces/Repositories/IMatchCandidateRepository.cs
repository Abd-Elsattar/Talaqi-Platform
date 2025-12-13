using Talaqi.Domain.Entities;

namespace Talaqi.Application.Interfaces.Repositories
{
    public interface IMatchCandidateRepository : IBaseRepository<MatchCandidate>
    {
        Task<MatchCandidate?> GetByItemsAsync(Guid lostItemId, Guid foundItemId);
        Task<IEnumerable<MatchCandidate>> GetUnpromotedByLostItemAsync(Guid lostItemId);
        Task<IEnumerable<MatchCandidate>> GetUnpromotedByFoundItemAsync(Guid foundItemId);
        Task<IEnumerable<MatchCandidate>> GetPendingAsync();
        Task<IEnumerable<MatchCandidate>> GetAllAsync();
    }
}
