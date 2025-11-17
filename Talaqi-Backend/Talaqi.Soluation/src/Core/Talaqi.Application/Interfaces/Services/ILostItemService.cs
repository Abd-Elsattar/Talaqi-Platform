using Talaqi.Application.Common;
using Talaqi.Application.DTOs.Items;

namespace Talaqi.Application.Interfaces.Services
{
    public interface ILostItemService
    {
        Task<Result<LostItemDto>> CreateLostItemAsync(CreateLostItemDto dto, Guid userId);
        Task<Result<LostItemDto>> GetLostItemByIdAsync(Guid id);
        Task<Result<PaginatedList<LostItemDto>>> GetAllLostItemsAsync(int pageNumber, int pageSize, string? category = null);
        Task<Result<List<LostItemDto>>> GetUserLostItemsAsync(Guid userId);
        Task<Result<List<LostItemDto>>> GetLostItemsFeedAsync(int count = 20);
        Task<Result<LostItemDto>> UpdateLostItemAsync(Guid id, UpdateLostItemDto dto, Guid userId);
        Task<Result> DeleteLostItemAsync(Guid id, Guid userId);
    }
} 