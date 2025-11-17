using Microsoft.EntityFrameworkCore;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Domain.Entities;
using Talaqi.Infrastructure.Data;

namespace Talaqi.Infrastructure.Repositories
{
    public class MatchRepository : BaseRepository<Match>, IMatchRepository
    {
        public MatchRepository(ApplicationDbContext context) : base(context) { }

        public override async Task<Match?> GetByIdAsync(Guid id)
        {
            return await _dbSet
                .Include(x => x.LostItem)
                    .ThenInclude(l => l.User)
                .Include(x => x.FoundItem)
                    .ThenInclude(f => f.User)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<Match>> GetMatchesForUserAsync(Guid userId)
        {
            return await _dbSet
                .Include(x => x.LostItem)
                    .ThenInclude(l => l.User)
                .Include(x => x.FoundItem)
                    .ThenInclude(f => f.User)
                .Where(x => x.LostItem.UserId == userId || x.FoundItem.UserId == userId)
                .OrderByDescending(x => x.ConfidenceScore)
                .ToListAsync();
        }

        public async Task<IEnumerable<Match>> GetMatchesByLostItemAsync(Guid lostItemId)
        {
            return await _dbSet
                .Include(x => x.FoundItem)
                    .ThenInclude(f => f.User)
                .Where(x => x.LostItemId == lostItemId)
                .OrderByDescending(x => x.ConfidenceScore)
                .ToListAsync();
        }

        public async Task<IEnumerable<Match>> GetMatchesByFoundItemAsync(Guid foundItemId)
        {
            return await _dbSet
                .Include(x => x.LostItem)
                    .ThenInclude(l => l.User)
                .Where(x => x.FoundItemId == foundItemId)
                .OrderByDescending(x => x.ConfidenceScore)
                .ToListAsync();
        }

        public async Task<IEnumerable<Match>> GetPendingMatchesAsync()
        {
            return await _dbSet
                .Include(x => x.LostItem)
                .Include(x => x.FoundItem)
                .Where(x => x.Status == Domain.Enums.MatchStatus.Pending)
                .ToListAsync();
        }

        public async Task<Match?> GetMatchByItemsAsync(Guid lostItemId, Guid foundItemId)
        {
            return await _dbSet
                .FirstOrDefaultAsync(x => x.LostItemId == lostItemId && x.FoundItemId == foundItemId);
        }
    }
}
