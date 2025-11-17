using Microsoft.EntityFrameworkCore;
using Talaqi.Domain.Entities;
using Talaqi.Domain.Enums;

namespace Talaqi.Application.Interfaces.Repositories
{
    public interface ILostItemRepository : IBaseRepository<LostItem>
    {
        Task<IEnumerable<LostItem>> GetAllLostItemsAsync();
        Task<IEnumerable<LostItem>> GetByUserIdAsync(Guid userId);
        Task<IEnumerable<LostItem>> GetByCategoryAsync(ItemCategory category);
        Task<IEnumerable<LostItem>> GetActiveLostItemsAsync(int pageNumber, int pageSize);
        Task<IEnumerable<LostItem>> GetRecentFeedAsync(int count = 20);
        Task<IEnumerable<LostItem>> GetLostItemsWithMatchesAsync(Guid userId);
    }
}
