using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Domain.Entities;
using Talaqi.Domain.Enums;

namespace Talaqi.Application.Interfaces.Repositories
{
    // Interface for FoundItem repository which extends the generic IBaseRepository
    public interface IFoundItemRepository : IBaseRepository<FoundItem>
    {
        // Method to get all found items associated with a specific user asynchronously
        Task<IEnumerable<FoundItem>> GetByUserIdAsync(Guid userId);

        // Method to get found items by specific category asynchronously
        Task<IEnumerable<FoundItem>> GetByCategoryAsync(ItemCategory category);

        // Method to get all active found items asynchronously
        Task<IEnumerable<FoundItem>> GetActiveFoundItemsAsync();
    }
}
