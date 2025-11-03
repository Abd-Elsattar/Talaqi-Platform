// Import necessary namespaces
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Application.Common;
using Talaqi.Application.DTOs.Users;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Application.Interfaces.Services;

namespace Talaqi.Application.Services
{
    // Define the UserService class which implements the IUserService interface
    public class UserService : IUserService
    {
        // Declare private readonly fields for IUnitOfWork and IMapper
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        // Constructor to initialize dependencies
        public UserService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // Asynchronously get user profile by userId
        public async Task<Result<UserProfileDto>> GetUserProfileAsync(Guid userId)
        {
            // Retrieve the user from the repository
            var user = await _unitOfWork.Users.GetByIdAsync(userId);

            // Check if the user is null or deleted
            if (user == null || user.IsDeleted)
            {
                // Return failure result if user not found or deleted
                return Result<UserProfileDto>.Failure("User not found");
            }

            // Map user data to UserProfileDto
            var dto = _mapper.Map<UserProfileDto>(user);

            // Calculate active lost and found items count
            dto.LostItemsCount = user.LostItems.Count(x => !x.IsDeleted);
            dto.FoundItemsCount = user.FoundItems.Count(x => !x.IsDeleted);

            // Return success result with the UserProfileDto
            return Result<UserProfileDto>.Success(dto);
        }

        // Asynchronously update the profile picture for a user
        public async Task<Result> UpdateProfilePictureAsync(Guid userId, string imageUrl)
        {
            // Retrieve the user from the repository
            var user = await _unitOfWork.Users.GetByIdAsync(userId);

            // Check if the user is null or deleted
            if (user == null || user.IsDeleted)
            {
                // Return failure result if user not found or deleted
                return Result.Failure("User not found");
            }

            // Update user profile picture URL and timestamp
            user.ProfilePictureUrl = imageUrl;
            user.UpdatedAt = DateTime.UtcNow;

            // Save changes to the database
            await _unitOfWork.SaveChangesAsync();

            // Return success message indicating profile picture update
            return Result.Success("Profile picture updated successfully");
        }

        // Asynchronously update user profile details
        public async Task<Result<UserProfileDto>> UpdateUserProfileAsync(Guid userId, UpdateUserProfileDto updateUserProfileDto)
        {
            // Retrieve the user from the repository
            var user = await _unitOfWork.Users.GetByIdAsync(userId);

            // Check if the user is null or deleted
            if (user == null || user.IsDeleted)
            {
                // Return failure result if user not found or deleted
                return Result<UserProfileDto>.Failure("User not found");
            }

            // Update user profile fields
            user.FirstName = updateUserProfileDto.FirstName;
            user.LastName = updateUserProfileDto.LastName;
            user.PhoneNumber = updateUserProfileDto.PhoneNumber;
            user.UpdatedAt = DateTime.UtcNow;

            // Save changes to the database
            await _unitOfWork.SaveChangesAsync();

            // Map updated user data to UserProfileDto
            var result = _mapper.Map<UserProfileDto>(user);

            // Return success result with updated UserProfileDto
            return Result<UserProfileDto>.Success(result, "Profile updated successfully");
        }

        // Asynchronously delete (soft delete) a user account
        public async Task<Result> ResultDeleteUserAccountAsync(Guid userId)
        {
            // Retrieve the user from the repository
            var user = await _unitOfWork.Users.GetByIdAsync(userId);

            // Check if the user is null or deleted
            if (user == null || user.IsDeleted)
            {
                // Return failure result if user not found or already deleted
                return Result.Failure("User not found");
            }

            // Perform soft delete by setting IsDeleted and IsActive flags
            user.IsDeleted = true;
            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;

            // Save changes to the database
            await _unitOfWork.SaveChangesAsync();

            // Return success message indicating account deletion
            return Result.Success("Account deleted successfully");
        }
    }
}
//This code represents a user service class in C# that implements the `IUserService` interface, providing various operations related to user profiles within an application. This class relies on dependency injection by utilizing `IUnitOfWork` for data persistence and `IMapper` for object mapping between domain models and data transfer objects (DTOs). The code uses asynchronous methods to ensure non-blocking operations, which is crucial for handling potentially slow I/O operations like database access.
//Here's a breakdown of the key components and operations:
//1. **Dependencies:**
//    - `IUnitOfWork`: This pattern is used here to encapsulate database operations and ensure all updates are atomic. It contains repositories for accessing data (e.g., `Users` repository).
//    - `IMapper`: Used for mapping between domain models and DTOs, which is essential for separating data structure used in storage and data structure used for APIs.
//2. **Methods:**
//    - `GetUserProfileAsync(Guid userId)`: Fetches a user's profile based on their ID. It retrieves the user from the database, checks if they exist and are not marked as deleted, maps the data to a `UserProfileDto`, calculates counts of active lost and found items, and returns this data wrapped in a `Result` object.
//    - `UpdateProfilePictureAsync(Guid userId, string imageUrl)`: Updates the profile picture URL for a user and persists this change to the database. It returns a success or failure result.
//    - `UpdateUserProfileAsync(Guid userId, UpdateUserProfileDto updateUserProfileDto)`: Updates a user's profile information using fields from `UpdateUserProfileDto`. Similar to other methods, it updates the database and returns the updated data.
//    - `ResultDeleteUserAccountAsync(Guid userId)`: Performs a soft delete on a user account by marking it as deleted and inactive, then saves these changes. It returns the result of the operation.
//3. **Result Handling:**
//    - Methods return results wrapped in `Result` or `Result<T>` objects, indicating success or failure along with a message and any relevant data. This approach helps manage application flow and feedback more effectively, particularly during API interactions.
//Overall, this service is part of a larger architecture designed for managing users and their profiles within a system, adhering to principles of clean architecture and ensuring scalability, testability, and maintainability.