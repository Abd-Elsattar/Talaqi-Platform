using Microsoft.EntityFrameworkCore;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Domain.Entities;
using Talaqi.Domain.Enums;
using Talaqi.Infrastructure.Data;

namespace Talaqi.Infrastructure.Repositories
{
    public class LostItemRepository : BaseRepository<LostItem>, ILostItemRepository
    {
        public LostItemRepository(ApplicationDbContext context) : base(context) { }
        public async Task<IEnumerable<LostItem>> GetAllLostItemsAsync()
        {
             return await _dbSet
                .Include(x => x.User)
                .ToListAsync();
        }

        public override async Task<LostItem?> GetByIdAsync(Guid id)
        {
            return await _dbSet
                .Include(x => x.User)
                .Include(x => x.Matches)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<LostItem>> GetByUserIdAsync(Guid userId)
        {
            return await _dbSet
                .Include(x => x.User)
                .Include(x => x.Matches)
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<LostItem>> GetByCategoryAsync(ItemCategory category)
        {
            return await _dbSet
                .Include(x => x.User)
                .Where(x => x.Category == category && x.Status == ItemStatus.Active)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<LostItem>> GetActiveLostItemsAsync(int pageNumber, int pageSize)
        {
            return await _dbSet
                .Include(x => x.User)
                .Include(x => x.Matches)
                .Where(x => x.Status == ItemStatus.Active)
                .OrderByDescending(x => x.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<IEnumerable<LostItem>> GetRecentFeedAsync(int count = 20)
        {
            return await _dbSet
                .Include(x => x.User)
                .Include(x => x.Matches)
                .Where(x => x.Status == ItemStatus.Active)
                .OrderByDescending(x => x.CreatedAt)
                .Take(count)
                .ToListAsync();
        }

        public async Task<IEnumerable<LostItem>> GetLostItemsWithMatchesAsync(Guid userId)
        {
            return await _dbSet
                .Include(x => x.User)
                .Include(x => x.Matches)
                    .ThenInclude(m => m.FoundItem)
                        .ThenInclude(f => f.User)
                .Where(x => x.UserId == userId && x.Matches.Any())
                .ToListAsync();
        }

    }
}
