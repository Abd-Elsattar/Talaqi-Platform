using Talaqi.Domain.Entities;
using Talaqi.Domain.Enums;

namespace Talaqi.Application.Interfaces.Repositories
{
    public interface IFoundItemRepository : IBaseRepository<FoundItem>
    {
        Task<IEnumerable<FoundItem>> GetAllFoundItemsAsync();
        Task<IEnumerable<FoundItem>> GetByUserIdAsync(Guid userId);
        Task<IEnumerable<FoundItem>> GetByCategoryAsync(ItemCategory category);
        Task<IEnumerable<FoundItem>> GetActiveFoundItemsAsync();
    }
}
