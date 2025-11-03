using Talaqi.Application.Common;
using Talaqi.Application.DTOs.Items;

namespace Talaqi.Application.Interfaces.Services
{
    //The `IFoundItemService` interface defines a contract for managing "found items" in a system, which appears to handle operations related to items that have been found, likely in a lost-and-found context. Below is a breakdown of the purpose and function of each method in this interface:
    //1. **CreateFoundItemAsync(CreateFoundItemDto dto, Guid userId)**:
    //   - **Purpose**: To create a new found item record in the system.
    //   - **Parameters**:
    //     - `CreateFoundItemDto dto`: Data transfer object containing details about the found item to be created.
    //     - `Guid userId`: The unique identifier of the user who found the item.
    //   - **Returns**: A `Task` that, when awaited, provides a `Result<FoundItemDto>`, indicating the success or failure of the creation operation and, if successful, the details of the found item.
    //2. **GetFoundItemByIdAsync(Guid id)**:
    //   - **Purpose**: To retrieve details of a specific found item.
    //   - **Parameters**:
    //     - `Guid id`: The unique identifier of the found item to be retrieved.
    //   - **Returns**: A `Task` that, when awaited, provides a `Result<FoundItemDto>`, containing the details of the found item if the operation is successful.
    //3. **GetUserFoundItemsAsync(Guid userId)**:
    //   - **Purpose**: To retrieve all found items associated with a specific user.
    //   - **Parameters**:
    //     - `Guid userId`: The unique identifier of the user whose found items are being retrieved.
    //   - **Returns**: A `Task` that, when awaited, provides a `Result<List<FoundItemDto>>`, containing a list of found item details for the specified user.
    //4. **UpdateFoundItemAsync(Guid id, UpdateFoundItemDto dto, Guid userId)**:
    //   - **Purpose**: To update the details of a specific found item.
    //   - **Parameters**:
    //     - `Guid id`: The unique identifier of the found item to be updated.
    //     - `UpdateFoundItemDto dto`: Data transfer object containing the updated details of the found item.
    //     - `Guid userId`: The unique identifier of the user requesting the update.
    //   - **Returns**: A `Task` that, when awaited, provides a `Result<FoundItemDto>`, indicating the outcome of the update operation and the updated item details if successful.
    //5. **DeleteFoundItemAsync(Guid id, Guid userId)**:
    //   - **Purpose**: To delete a specific found item from the system.
    //   - **Parameters**:
    //     - `Guid id`: The unique identifier of the found item to be deleted.
    //     - `Guid userId`: The unique identifier of the user requesting the deletion.
    //   - **Returns**: A `Task` that, when awaited, provides a `Result`, indicating the success or failure of the deletion operation.
    //Each method returns a `Result` object wrapped in a `Task`, representing asynchronous operations, which is common in C# for non-blocking and responsive application behavior, especially when interacting with databases or external systems. The `Result` likely represents the outcome, with possible success and error information, while the generic type (`FoundItemDto`, `List<FoundItemDto>`) represents the data associated with successful operations.
    public interface IFoundItemService
    {
        Task<Result<FoundItemDto>> CreateFoundItemAsync(CreateFoundItemDto dto, Guid userId);
        Task<Result<FoundItemDto>> GetFoundItemByIdAsync(Guid id);
        Task<Result<List<FoundItemDto>>> GetUserFoundItemsAsync(Guid userId);
        Task<Result<FoundItemDto>> UpdateFoundItemAsync(Guid id, UpdateFoundItemDto dto, Guid userId);
        Task<Result> DeleteFoundItemAsync(Guid id, Guid userId);
    }
}
