using Talaqi.Domain.Entities;

namespace Talaqi.Application.Interfaces.Repositories
{
    public interface IMatchRepository : IBaseRepository<Match>
    {
        Task<IEnumerable<Match>> GetMatchesForUserAsync(Guid userId);
        Task<IEnumerable<Match>> GetMatchesByLostItemAsync(Guid lostItemId);
        Task<IEnumerable<Match>> GetMatchesByFoundItemAsync(Guid foundItemId);
        Task<IEnumerable<Match>> GetPendingMatchesAsync();
        Task<Match?> GetMatchByItemsAsync(Guid lostItemId, Guid foundItemId);
    }
}