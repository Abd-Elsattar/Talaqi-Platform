using Talaqi.Application.Common;
using Talaqi.Application.DTOs.Items;

namespace Talaqi.Application.Interfaces.Services
{
    public interface ILostItemService
    {
        Task<Result<LostItemDto>> CreateLostItemAsync(CreateLostItemDto createLostItemDto, Guid userId);
        Task<Result<LostItemDto>> GetLostItemByIdAsync(Guid lostItemId);
        Task<Result<PaginatedList<LostItemDto>>> GetAllLostItemsAsync(int pageNumber, int pageSize, string? category = null);
        Task<Result<List<LostItemDto>>> GetUserLostItemsAsync(Guid userId);
        Task<Result<List<LostItemDto>>> GetLostItemsFeedAsync(int count);
        Task<Result<LostItemDto>> UpdateLostItemAsync(Guid id, UpdateLostItemDto updateLostItemDto, Guid userId);
        Task<Result> DeleteLostItemAsync(Guid id, Guid userId);
    }
} //The provided code defines an interface `ILostItemService` in C#. This interface outlines a contract for managing lost items within an application. The interface declares several methods that must be implemented by a class that agrees to adhere to this contract. Here is a breakdown of each method in the interface:
  //1. **CreateLostItemAsync(CreateLostItemDto createLostItemDto, Guid userId)**:
  //   - **Purpose**: To create a new lost item entry in the system.
  //   - **Parameters**: 
  //     - `createLostItemDto`: An object containing the details needed to create a lost item.
  //     - `userId`: The identifier of the user creating the lost item.
  //   - **Returns**: A `Task` that, when completed, results in a `Result` object encapsulating a `LostItemDto` representing the newly created lost item.
  //2. **GetLostItemByIdAsync(Guid lostItemId)**:
  //   - **Purpose**: To retrieve the details of a single lost item using its unique identifier.
  //   - **Parameters**: 
  //     - `lostItemId`: The unique identifier of the lost item to be fetched.
  //   - **Returns**: A `Task` that, once completed, provides a `Result` containing a `LostItemDto` for the specified lost item.
  //3. **GetAllLostItemsAsync(int pageNumber, int pageSize, string? category = null)**:
  //   - **Purpose**: To retrieve a paginated list of all lost items, with optional filtering by category.
  //   - **Parameters**: 
  //     - `pageNumber`: The page number to retrieve.
  //     - `pageSize`: The number of items per page.
  //     - `category` (optional): A category to filter the lost items.
  //   - **Returns**: A `Task` resulting in a `Result` containing a `PaginatedList` of `LostItemDto` objects.
  //4. **GetUserLostItemsAsync(Guid userId)**:
  //   - **Purpose**: To fetch all lost items reported by a specific user, identified by their user ID.
  //   - **Parameters**: 
  //     - `userId`: The ID of the user whose lost items are to be retrieved.
  //   - **Returns**: A `Task` with a `Result` that contains a list of `LostItemDto` for that user.
  //5. **GetLostItemsFeedAsync(int count)**:
  //   - **Purpose**: To get a feed of recent lost items, limited to a specified count.
  //   - **Parameters**: 
  //     - `count`: The number of recent lost items to retrieve.
  //   - **Returns**: A `Task` resulting in a `Result` holding a list of `LostItemDto` for display as a feed.
  //6. **UpdateLostItemAsync(Guid id, UpdateLostItemDto updateLostItemDto, Guid userId)**:
  //   - **Purpose**: To update the details of an existing lost item.
  //   - **Parameters**: 
  //     - `id`: The unique identifier of the lost item to update.
  //     - `updateLostItemDto`: An object containing the updated data for the lost item.
  //     - `userId`: The ID of the user performing the update operation.
  //   - **Returns**: A `Task` ending in a `Result` containing the updated `LostItemDto`.
  //7. **DeleteLostItemAsync(Guid id, Guid userId)**:
  //   - **Purpose**: To delete a specified lost item from the system.
  //   - **Parameters**: 
  //     - `id`: The ID of the lost item to delete.
  //     - `userId`: The ID of the user requesting the deletion, likely for authorization purposes.
  //   - **Returns**: A `Task` that resolves to a `Result` indicating success or failure of the deletion.
  //These methods use `Result` objects, which typically encapsulate the outcome of an operation, including success/failure and any relevant data or error messages. `Dto` stands for Data Transfer Object, which is a design pattern used to transfer data between software application subsystems. The `PaginatedList<T>` suggests that results can be returned in a paginated format, beneficial for handling large datasets.
