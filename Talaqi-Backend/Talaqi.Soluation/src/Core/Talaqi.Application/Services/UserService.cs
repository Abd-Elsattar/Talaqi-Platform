using AutoMapper;
using Talaqi.Application.Common;
using Talaqi.Application.DTOs.Users;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Application.Interfaces.Services;

namespace Talaqi.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UserService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<Result<UserProfileDto>> GetUserProfileAsync(Guid userId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);

            if (user == null || user.IsDeleted)
                return Result<UserProfileDto>.Failure("User not found");

            var dto = _mapper.Map<UserProfileDto>(user);
            dto.LostItemsCount = user.LostItems.Count(x => !x.IsDeleted);
            dto.FoundItemsCount = user.FoundItems.Count(x => !x.IsDeleted);

            return Result<UserProfileDto>.Success(dto);
        }

        public async Task<Result<UserProfileDto>> UpdateUserProfileAsync(Guid userId, UpdateUserProfileDto dto)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);

            if (user == null || user.IsDeleted)
                return Result<UserProfileDto>.Failure("User not found");

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.PhoneNumber = dto.PhoneNumber;
            user.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();

            var result = _mapper.Map<UserProfileDto>(user);
            return Result<UserProfileDto>.Success(result, "Profile updated successfully");
        }

        public async Task<Result> UpdateProfilePictureAsync(Guid userId, string imageUrl)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);

            if (user == null || user.IsDeleted)
                return Result.Failure("User not found");

            user.ProfilePictureUrl = imageUrl;
            user.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();

            return Result.Success("Profile picture updated successfully");
        }

        public async Task<Result> DeleteUserAccountAsync(Guid userId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);

            if (user == null || user.IsDeleted)
                return Result.Failure("User not found");

            user.IsDeleted = true;
            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();

            return Result.Success("Account deleted successfully");
        }
    }
}