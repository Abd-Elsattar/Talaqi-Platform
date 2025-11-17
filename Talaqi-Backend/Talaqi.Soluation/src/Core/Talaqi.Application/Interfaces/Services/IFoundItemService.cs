using Talaqi.Application.Common;
using Talaqi.Application.DTOs.Items;

namespace Talaqi.Application.Interfaces.Services
{
    public interface IFoundItemService
    {
        Task<Result<FoundItemDto>> CreateFoundItemAsync(CreateFoundItemDto dto, Guid userId);
        Task<Result<FoundItemDto>> GetFoundItemByIdAsync(Guid id);
        Task<Result<List<FoundItemDto>>> GetUserFoundItemsAsync(Guid userId);
        Task<Result<FoundItemDto>> UpdateFoundItemAsync(Guid id, UpdateFoundItemDto dto, Guid userId);
        Task<Result> DeleteFoundItemAsync(Guid id, Guid userId);
    }
}
