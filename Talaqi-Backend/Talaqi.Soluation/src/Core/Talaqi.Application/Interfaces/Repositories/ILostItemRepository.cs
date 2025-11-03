using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Domain.Entities;
using Talaqi.Domain.Enums;

namespace Talaqi.Application.Interfaces.Repositories
{
    // Define the ILostItemRepository interface which inherits from IBaseRepository
    public interface ILostItemRepository : IBaseRepository<LostItem>
    {
        // Asynchronously get lost items by a specific user ID
        Task<IEnumerable<LostItem>> GetByUserIdAsync(Guid userId);

        // Asynchronously get lost items by a specific category
        Task<IEnumerable<LostItem>> GetByCategoryAsync(ItemCategory category);

        // Asynchronously get paginated and active lost items
        Task<IEnumerable<LostItem>> GetActiveLostItemsAsync(int pageNumber, int pageSize);

        // Asynchronously get a recent feed of lost items with an optional number of entries
        Task<IEnumerable<LostItem>> GetRecentFeedAsync(int count = 20);

        // Asynchronously get lost items that have matches with a specific user ID
        Task<IEnumerable<LostItem>> GetLostItemsWithMatchesAsync(Guid userId);
    }
}
