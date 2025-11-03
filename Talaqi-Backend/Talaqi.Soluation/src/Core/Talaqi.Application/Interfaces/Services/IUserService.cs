using Talaqi.Application.Common;
using Talaqi.Application.DTOs.Users;

namespace Talaqi.Application.Interfaces.Services
{
    //The `IUserService` interface defines a contract for a service that manages user profiles and accounts. This interface specifies the methods that any implementing class must provide, which include operations related to retrieving, updating, and deleting user information. The use of `Task` indicates that these methods are asynchronous, allowing non-blocking operations. Here's a breakdown of each method:
    //1. **GetUserProfileAsync(Guid userId)**: This method is responsible for retrieving a user's profile information based on their unique identifier (`userId`). It returns a `Task` that, when awaited, yields a `Result<UserProfileDto>`. The `Result<UserProfileDto>` encapsulates whether the operation was successful and, if so, includes the user's profile data (`UserProfileDto`).
    //2. **UpdateUserProfileAsync(Guid userId, UpdateUserProfileDto updateUserProfileDto)**: This method updates the profile details of a user. It takes the user's unique identifier and an object (`UpdateUserProfileDto`) containing the new profile data. It returns a `Task` that yields a `Result<UserProfileDto>`, indicating the success or failure of the update operation along with the potentially updated profile data.
    //3. **UpdateProfilePictureAsync(Guid userId, string imageUrl)**: This method allows updating of a user's profile picture. It requires the `userId` and the new `imageUrl` pointing to the image location. The method returns a `Task` that yields a `Result`, which indicates the outcome of the update operation. The `Result` might not include data, just a success or error status.
    //4. **ResultDeleteUserAccountAsync(Guid userId)**: This function is responsible for deleting a user account based on their `userId`. The function signature suggests there might be a typo (`ResultDeleteUserAccountAsync` should likely be `DeleteUserAccountAsync`). It returns a `Task`, implying an asynchronous operation, but it may be intended to return a `Result` to indicate success or failure. If not, this could simply mean the operation may not return any comprehensive data beyond completion status.
    //Overall, this interface abstracts the user profile services and facilitates consistent usage across different parts of an application that deal with user management, while also aiming to handle operations in an asynchronous and robust manner with feedback on operation outcomes.
    public interface IUserService
    {
        Task<Result<UserProfileDto>> GetUserProfileAsync(Guid userId);
        Task<Result<UserProfileDto>> UpdateUserProfileAsync(Guid userId, UpdateUserProfileDto updateUserProfileDto);
        Task<Result> UpdateProfilePictureAsync(Guid userId, string imageUrl);
        Task<Result> ResultDeleteUserAccountAsync(Guid userId);
    }
}
