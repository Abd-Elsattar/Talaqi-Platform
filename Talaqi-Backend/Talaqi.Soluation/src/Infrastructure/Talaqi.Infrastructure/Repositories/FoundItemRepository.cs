using Microsoft.EntityFrameworkCore;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Domain.Entities;
using Talaqi.Domain.Enums;
using Talaqi.Infrastructure.Data;

namespace Talaqi.Infrastructure.Repositories
{
    public class FoundItemRepository : BaseRepository<FoundItem>, IFoundItemRepository
    {
        public FoundItemRepository(ApplicationDbContext context) : base(context) { }
        public async Task<IEnumerable<FoundItem>> GetAllFoundItemsAsync()
        {
            return await _dbSet
                .Include(x => x.User)
                .ToListAsync();
        }
        public override async Task<FoundItem?> GetByIdAsync(Guid id)
        {
            return await _dbSet
                .Include(x => x.User)
                .Include(x => x.Matches)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<FoundItem>> GetByUserIdAsync(Guid userId)
        {
            return await _dbSet
                .Include(x => x.User)
                .Include(x => x.Matches)
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<FoundItem>> GetByCategoryAsync(ItemCategory category)
        {
            return await _dbSet
                .Include(x => x.User)
                .Where(x => x.Category == category && x.Status == ItemStatus.Active)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<FoundItem>> GetActiveFoundItemsAsync()
        {
            return await _dbSet
                .Include(x => x.User)
                .Include(x => x.Matches)
                .Where(x => x.Status == ItemStatus.Active)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

    }

}
