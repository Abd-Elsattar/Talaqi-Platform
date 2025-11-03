using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Talaqi.Application.Common;
using Talaqi.Application.DTOs.Items;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Application.Interfaces.Services;
using Talaqi.Domain.Entities;
using Talaqi.Domain.Enums;
using Talaqi.Domain.ValueObjects;

namespace Talaqi.Application.Services
{
    /// <summary>
    /// Represents a service for managing lost items. This class implements the ILostItemService interface
    /// and provides functionality related to the handling and processing of lost items within the system.
    /// </summary>
    public class LostItemService : ILostItemService
    {
        // Dependencies for database operations, AI processing, and object mapping
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAIService _aiService;
        private readonly IMapper _mapper;

        /// <summary>
        /// Initializes a new instance of the LostItemService class.
        /// </summary>
        /// <param name="unitOfWork">The unit of work for handling database transactions and operations.</param>
        /// <param name="aIService">The AI service interface for processing AI related operations.</param>
        /// <param name="mapper">The object mapper used for entity-object conversion.</param>
        public LostItemService(IUnitOfWork unitOfWork, IAIService aIService, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _aiService = aIService;
            _mapper = mapper;
        }

        /// <summary>
        /// Asynchronously creates a lost item record in the database associated with a specific user, 
        /// and processes the data with AI analysis for additional insights.
        /// </summary>
        /// <param name="createLostItemDto">The data transfer object containing the details of the lost item to be created.</param>
        /// <param name="userId">The unique identifier of the user reporting the lost item.</param>
        /// <returns>
        /// A task that represents the asynchronous operation, containing the result of lost item creation wrapped 
        /// in a Result object. On success, it returns a LostItemDto with the details of the newly created lost item.
        /// On failure, it includes a relevant error message.
        /// </returns>
        public async Task<Result<LostItemDto>> CreateLostItemAsync(CreateLostItemDto createLostItemDto, Guid userId)
        {
            // Retrieve user from the database
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return Result<LostItemDto>.Failure("User not Found");

            // Parse the category
            if (!Enum.TryParse<ItemCategory>(createLostItemDto.Category, out var category))
                return Result<LostItemDto>.Failure("Invalid Category");

            // Perform AI analysis on the lost item
            var aiResult = await _aiService.AnalyzeLostItemAsync(
                createLostItemDto.ImageUrl, createLostItemDto.Description, createLostItemDto.Location.Address);

            // Create a new LostItem entity
            var lostItem = new LostItem
            {
                UserId = userId,
                Category = category,
                Title = createLostItemDto.Title,
                Description = createLostItemDto.Description,
                ImageUrl = createLostItemDto.ImageUrl,
                Location = _mapper.Map<Location>(createLostItemDto.Location),
                DateLost = createLostItemDto.DateLost,
                ContactInfo = createLostItemDto.ContactInfo,
                Status = ItemStatus.Active,
                AIAnalysisData = JsonSerializer.Serialize(aiResult),
                CreateAt = DateTime.UtcNow
            };

            // Add the created lost item to the database
            await _unitOfWork.LostItems.AddAsync(lostItem);
            await _unitOfWork.SaveChangesAsync();

            // Map the LostItem entity to a LostItemDto
            var result = _mapper.Map<LostItemDto>(lostItem);
            result.UserName = user.FullName;
            result.UserProfilePicture = user.ProfilePictureUrl ?? "";

            // Return success result
            return Result<LostItemDto>.Success(result, "Lost item reported successfully");
        }

        /// <summary>
        /// Retrieves a lost item by its ID asynchronously.
        /// </summary>
        /// <param name="lostItemId">The unique identifier of the lost item to retrieve.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains a Result object
        /// which is a success with a LostItemDto if the lost item is found, otherwise a failure with an error message.
        /// </returns>
        public async Task<Result<LostItemDto>> GetLostItemByIdAsync(Guid lostItemId)
        {
            // Retrieve the lost item from the database
            var item = await _unitOfWork.LostItems.GetByIdAsync(lostItemId);

            // Check if the item exists and is not deleted
            if (item == null || item.IsDeleted)
                return Result<LostItemDto>.Failure("Lost item not found");

            // Map the LostItem entity to a LostItemDto
            var itemDto = _mapper.Map<LostItemDto>(item);
            itemDto.UserName = item.User.FullName;
            itemDto.UserProfilePicture = item.User.ProfilePictureUrl ?? "";
            itemDto.MatchCount = item.Matches.Count;

            // Return success result
            return Result<LostItemDto>.Success(itemDto);
        }

        /// <summary>
        /// Retrieves a paginated list of active lost items, optionally filtered by category. 
        /// Each item includes additional user details and match count.
        /// </summary>
        /// <param name="pageNumber">The page number to retrieve.</param>
        /// <param name="pageSize">The number of items per page.</param>
        /// <param name="category">An optional category to filter the lost items.</param>
        /// <returns>
        /// A task that represents the asynchronous operation, containing a result with a paginated list of lost item DTOs.
        /// </returns>
        public async Task<Result<PaginatedList<LostItemDto>>> GetAllLostItemsAsync(
            int pageNumber, int pageSize, string? category = null)
        {
            // Retrieve active lost items from the database
            var items = await _unitOfWork.LostItems.GetActiveLostItemsAsync(pageNumber, pageSize);
            var totalCount = await _unitOfWork.LostItems.CountAsync(x => !x.IsDeleted && x.Status == ItemStatus.Active);

            // Map each lost item to a LostItemDto
            var dtos = items.Select(x =>
            {
                var dto = _mapper.Map<LostItemDto>(x);
                dto.UserName = x.User.FullName;
                dto.UserProfilePicture = x.User.ProfilePictureUrl ?? "";
                dto.MatchCount = x.Matches.Count;
                return dto;
            }).ToList();

            // Construct a paginated list and return it
            var result = new PaginatedList<LostItemDto>(dtos, totalCount, pageNumber, pageSize);
            return Result<PaginatedList<LostItemDto>>.Success(result);
        }

        /// <summary>
        /// Asynchronously retrieves a list of lost items associated with a specific user and maps them to DTOs.
        /// </summary>
        /// <param name="userId">The unique identifier of the user whose lost items are to be retrieved.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains a Result object wrapping a list of LostItemDto entities.
        /// </returns>
        public async Task<Result<List<LostItemDto>>> GetUserLostItemsAsync(Guid userId)
        {
            // Retrieve lost items by user ID
            var items = await _unitOfWork.LostItems.GetByUserIdAsync(userId);

            // Map each lost item to a LostItemDto
            var dtos = items.Select(x =>
            {
                var dto = _mapper.Map<LostItemDto>(x);
                dto.UserName = x.User.FullName;
                dto.UserProfilePicture = x.User.ProfilePictureUrl ?? "";
                dto.MatchCount = x.Matches.Count;
                return dto;
            }).ToList();

            // Return success result
            return Result<List<LostItemDto>>.Success(dtos);
        }

        /// <summary>
        /// Asynchronously retrieves a feed of lost items with a specified count and maps them to a list of LostItemDto objects.
        /// This feed includes details such as user name, profile picture, and match count for each item.
        /// </summary>
        /// <param name="count">The number of lost items to retrieve but defaults to 20 regardless of the input value.</param>
        /// <returns>
        /// A task representing the asynchronous operation, containing a Result object with a list of LostItemDto.
        /// </returns>
        public async Task<Result<List<LostItemDto>>> GetLostItemsFeedAsync(int count)
        {
            // Set the number of items to retrieve to a fixed count (20)
            count = 20;

            // Retrieve recent lost items for the feed
            var items = await _unitOfWork.LostItems.GetRecentFeedAsync(count);

            // Map each lost item to a LostItemDto
            var dtos = items.Select(x =>
            {
                var dto = _mapper.Map<LostItemDto>(x);
                dto.UserName = x.User.FullName;
                dto.UserProfilePicture = x.User.ProfilePictureUrl ?? "";
                dto.MatchCount = x.Matches.Count;
                return dto;
            }).ToList();

            // Return success result
            return Result<List<LostItemDto>>.Success(dtos);
        }

        /// <summary>
        /// Updates the details of a specified lost item identified by its unique ID.
        /// </summary>
        /// <param name="id">The unique identifier of the lost item to update.</param>
        /// <param name="updateLostItemDto">The data transfer object containing the updated details of the lost item.</param>
        /// <param name="userId">The unique identifier of the user attempting the update operation.</param>
        /// <returns>
        /// A result containing the updated lost item details if the operation succeeds, or an error message if it fails.
        /// </returns>
        public async Task<Result<LostItemDto>> UpdateLostItemAsync(Guid id, UpdateLostItemDto updateLostItemDto, Guid userId)
        {
            // Retrieve the lost item from the database
            var item = await _unitOfWork.LostItems.GetByIdAsync(id);
            if (item == null || item.IsDeleted)
                return Result<LostItemDto>.Failure("Lost item not found");

            // Check if the user is authorized to update the item
            if (item.UserId != userId)
                return Result<LostItemDto>.Failure("Unauthorized");

            // Update the lost item's details
            item.Title = updateLostItemDto.Title;
            item.Description = updateLostItemDto.Description;
            item.ImageUrl = updateLostItemDto.ImageUrl;
            item.Location = _mapper.Map<Location>(updateLostItemDto.Location);
            item.ContactInfo = updateLostItemDto.ContactInfo;
            item.UpdatedAt = DateTime.UtcNow;

            // Parse and update status
            if (Enum.TryParse<ItemStatus>(updateLostItemDto.Status, out var status))
                item.Status = status;

            // Save changes to the database
            await _unitOfWork.SaveChangesAsync();

            // Map the updated LostItem to a LostItemDto and return success
            var result = _mapper.Map<LostItemDto>(item);
            return Result<LostItemDto>.Success(result, "Lost item updated successfully");
        }

        /// <summary>
        /// Asynchronously deletes a lost item with the specified identifier if it exists 
        /// and the user is authorized to delete it.
        /// </summary>
        /// <param name="id">The unique identifier of the lost item.</param>
        /// <param name="userId">The unique identifier of the user attempting to delete the item.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains a 
        /// Result object indicating the success or failure of the operation, along with 
        /// an appropriate message.
        /// </returns>
        public async Task<Result> DeleteLostItemAsync(Guid id, Guid userId)
        {
            // Retrieve the lost item from the database
            var item = await _unitOfWork.LostItems.GetByIdAsync(id);

            // Check if the item exists and is not deleted
            if (item == null || item.IsDeleted)
                return Result.Failure("Lost item not found");

            // Check if the user is authorized to delete the item
            if (item.UserId != userId)
                return Result.Failure("Unauthorized");

            // Mark the item as deleted
            item.IsDeleted = true;
            item.UpdatedAt = DateTime.UtcNow;

            // Save changes to the database
            await _unitOfWork.SaveChangesAsync();

            // Return success message
            return Result.Success("Lost item deleted successfully");
        }
    }
}

// The `LostItemService` class implements the `ILostItemService` interface, providing functionality to manage lost items. 
// It handles database operations, AI analyses, and data mappings.
// The class uses:
// 1. Constructor for dependency injection of required services.
// 2. `CreateLostItemAsync`: For reporting new lost items after AI analysis and saves it into the database.
// 3. `GetLostItemByIdAsync`: For retrieving a specific lost item by ID.
// 4. `GetAllLostItemsAsync`: Provides paginated lost items, filtered by category.
// 5. `GetUserLostItemsAsync`: Retrieves all lost items reported by a specific user.
// 6. `GetLostItemsFeedAsync`: Provides a feed of recent lost items for display purposes.
// 7. `UpdateLostItemAsync`: Updates details of an existing lost item by ensuring user authorization.
// 8. `DeleteLostItemAsync`: Marks an item as deleted, ensuring authorized access.
// AutoMapper is used to simplify conversions between domain entities and DTOs, supporting async programming 
// for performance optimization in web apps. AI helps in better item processing and matching.