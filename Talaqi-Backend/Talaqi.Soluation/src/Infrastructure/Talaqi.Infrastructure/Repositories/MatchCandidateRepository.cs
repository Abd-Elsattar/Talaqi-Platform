using Microsoft.EntityFrameworkCore;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Domain.Entities;
using Talaqi.Infrastructure.Data;

namespace Talaqi.Infrastructure.Repositories
{
    public class MatchCandidateRepository : BaseRepository<MatchCandidate>, IMatchCandidateRepository
    {
        public MatchCandidateRepository(ApplicationDbContext context) : base(context) { }

        public override async Task<MatchCandidate?> GetByIdAsync(Guid id)
        {
            return await _dbSet
                .Include(x => x.LostItem)
                .Include(x => x.FoundItem)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<MatchCandidate?> GetByItemsAsync(Guid lostItemId, Guid foundItemId)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.LostItemId == lostItemId && x.FoundItemId == foundItemId);
        }

        public async Task<IEnumerable<MatchCandidate>> GetUnpromotedByLostItemAsync(Guid lostItemId)
        {
            return await _dbSet.Where(x => x.LostItemId == lostItemId && !x.Promoted).ToListAsync();
        }

        public async Task<IEnumerable<MatchCandidate>> GetUnpromotedByFoundItemAsync(Guid foundItemId)
        {
            return await _dbSet.Where(x => x.FoundItemId == foundItemId && !x.Promoted).ToListAsync();
        }

        public async Task<IEnumerable<MatchCandidate>> GetPendingAsync()
        {
            return await _dbSet.Where(x => !x.Promoted).ToListAsync();
        }

        public async Task<IEnumerable<MatchCandidate>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }
    }
}
