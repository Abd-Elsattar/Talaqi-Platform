using Talaqi.Application.Common;
using Talaqi.Application.DTOs.Users;

namespace Talaqi.Application.Interfaces.Services
{
    public interface IUserService
    {
        Task<Result<UserProfileDto>> GetUserProfileAsync(Guid userId);
        Task<Result<UserProfileDto>> UpdateUserProfileAsync(Guid userId, UpdateUserProfileDto dto);
        Task<Result> UpdateProfilePictureAsync(Guid userId, string imageUrl);
        Task<Result> DeleteUserAccountAsync(Guid userId);
    }
}
