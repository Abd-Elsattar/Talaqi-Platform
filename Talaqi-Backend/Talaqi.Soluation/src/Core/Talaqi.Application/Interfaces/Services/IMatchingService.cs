using Talaqi.Application.Common;
using Talaqi.Application.DTOs.Items;

namespace Talaqi.Application.Interfaces.Services
{
    public interface IMatchingService
    {
        Task<Result<List<MatchDto>>> FindMatchesForFoundItemAsync(Guid foundItemId);
        Task<Result<List<MatchDto>>> GetUserMatchesAsync(Guid userId);
        Task<Result<MatchDto>> GetMatchByIdAsync(Guid matchId);
        Task<Result> UpdateMatchStatusAsync(Guid matchId, string status, Guid userId);
        Task<Result<List<MatchDto>>> FindMatchesForLostItemAsync(Guid lostItemId);
    }
}
