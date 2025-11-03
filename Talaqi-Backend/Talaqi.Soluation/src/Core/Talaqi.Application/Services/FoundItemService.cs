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
    /// Provides services for managing found items, including methods for adding, updating, and retrieving items. 
    /// This class implements the IFoundItemService interface, ensuring compliance with the specified contract 
    /// for handling found item operations.
    /// </summary>
    public class FoundItemService : IFoundItemService
    {
        // Dependencies for unit of work, AI processing, matching service, and data mapping.
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAIService _aiService;
        private readonly IMatchingService _matchingService;
        private readonly IMapper _mapper;

        /// <summary>
        /// Initializes a new instance of the FoundItemService class.
        /// </summary>
        /// <param name="unitOfWork">The unit of work for managing data transactions.</param>
        /// <param name="aiService">The AI service to be used for processing.</param>
        /// <param name="matchingService">The service used for matching found items.</param>
        /// <param name="mapper">An object mapper for transforming data models.</param>
        public FoundItemService(IUnitOfWork unitOfWork, IAIService aiService,
                       IMatchingService matchingService, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _aiService = aiService;
            _matchingService = matchingService;
            _mapper = mapper;
        }

        /// <summary>
        /// Creates a new found item entry in the system, analyzes it with AI, and attempts to find potential matches.
        /// </summary>
        /// <param name="dto">The data transfer object containing the details of the found item to be created.</param>
        /// <param name="userId">The unique identifier of the user reporting the found item.</param>
        /// <returns>
        /// A result containing the newly created found item's data as a FoundItemDto if successful; 
        /// otherwise, returns a failure message.
        /// </returns>
        public async Task<Result<FoundItemDto>> CreateFoundItemAsync(CreateFoundItemDto dto, Guid userId)
        {
            // Retrieve user by userId.
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return Result<FoundItemDto>.Failure("User not found.");

            // Validate and parse the item category.
            if (!Enum.TryParse<ItemCategory>(dto.Category, out var category))
                return Result<FoundItemDto>.Failure("Invalid category");

            // Analyze with AI for additional processing or insights.
            var aiResult = await _aiService.AnalyzeFoundItemAsync(
                dto.ImageUrl, dto.Description, dto.Location.Address);

            // Create a new FoundItem entity instance with the provided data.
            var foundItem = new FoundItem
            {
                UserId = userId,
                Category = category,
                Title = dto.Title,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl,
                Location = _mapper.Map<Location>(dto.Location),
                DateFound = dto.DateFound,
                ContactInfo = dto.ContactInfo,
                Status = ItemStatus.Active,
                AIAnalysisData = JsonSerializer.Serialize(aiResult),
                CreateAt = DateTime.UtcNow
            };

            // Begin a transactional operation.
            await _unitOfWork.BeginTransactionAsync();

            try
            {
                // Add the new found item to the data store and trigger save changes.
                await _unitOfWork.FoundItems.AddAsync(foundItem);
                await _unitOfWork.SaveChangesAsync();

                // Trigger the matching process to find potential matches.
                await _matchingService.FindMatchesForFoundItemAsync(foundItem.Id);

                // Commit the transaction if everything is successful.
                await _unitOfWork.CommitTransactionAsync();

                // Map the result and return a success response.
                var result = _mapper.Map<FoundItemDto>(foundItem);
                result.UserName = user.FullName;
                return Result<FoundItemDto>.Success(result, "Found item reported successfully");
            }
            catch (Exception)
            {
                // Rollback transaction on error and rethrow.
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        /// <summary>
        /// Retrieves a found item by its unique identifier asynchronously.
        /// </summary>
        /// <param name="id">The unique identifier for the found item.</param>
        /// <returns>
        /// A <see cref="Result{FoundItemDto}"/> representing the success or failure of retrieving the found item.
        /// If successful, the result contains the <see cref="FoundItemDto"/>. 
        /// If the item is not found or marked as deleted, a failure result is returned with an appropriate message.
        /// </returns>
        public async Task<Result<FoundItemDto>> GetFoundItemByIdAsync(Guid id)
        {
            // Fetch the found item by its id.
            var item = await _unitOfWork.FoundItems.GetByIdAsync(id);

            // Check if the item exists and is not marked as deleted.
            if (item == null || item.IsDeleted)
                return Result<FoundItemDto>.Failure("Found item not found.");

            // Map the entity to DTO and include user information.
            var dto = _mapper.Map<FoundItemDto>(item);
            dto.UserName = item.User.FullName;
            return Result<FoundItemDto>.Success(dto);
        }

        /// <summary>
        /// Asynchronously retrieves a list of items found by a specific user and maps them to Data Transfer Objects (DTOs) with additional user information.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains a Result object wrapping a list of FoundItemDto objects,
        /// each enriched with the user's full name.
        /// </returns>
        public async Task<Result<List<FoundItemDto>>> GetUserFoundItemsAsync(Guid userId)
        {
            // Fetch all found items associated with a user.
            var items = await _unitOfWork.FoundItems.GetByUserIdAsync(userId);

            // Map each item to DTO and annotate with user information.
            var dtos = items.Select(x =>
            {
                var dto = _mapper.Map<FoundItemDto>(x);
                dto.UserName = x.User.FullName;
                return dto;
            }).ToList();

            // Return the result list.
            return Result<List<FoundItemDto>>.Success(dtos);
        }

        /// <summary>
        /// Updates the details of an existing found item based on the provided identifier and data transfer object. 
        /// Validates the user's authorization and updates the found item in the database if it is not deleted. 
        /// </summary>
        /// <param name="id">The unique identifier of the found item to update.</param>
        /// <param name="dto">The data transfer object containing updated details of the found item.</param>
        /// <param name="userId">The unique identifier of the user requesting the update.</param>
        /// <returns>
        /// A task that represents the asynchronous operation. The task result contains a Result object 
        /// that indicates whether the update was successful and includes the updated FoundItemDto if successful.
        /// </returns>
        public async Task<Result<FoundItemDto>> UpdateFoundItemAsync(Guid id, UpdateFoundItemDto dto, Guid userId)
        {
            // Retrieve the found item by its identifier.
            var item = await _unitOfWork.FoundItems.GetByIdAsync(id);

            // Check if the item exists and is not deleted.
            if (item == null || item.IsDeleted)
                return Result<FoundItemDto>.Failure("Found item not found.");

            // Verify user authorization for the operation.
            if (item.UserId != userId)
                return Result<FoundItemDto>.Failure("Unauthorized");

            // Update item details using provided data.
            item.Title = dto.Title;
            item.Description = dto.Description;
            item.ImageUrl = dto.ImageUrl;
            item.Location = _mapper.Map<Location>(dto.Location);
            item.ContactInfo = dto.ContactInfo;
            item.UpdatedAt = DateTime.UtcNow;

            // Attempt to update the item status if specified.
            if (Enum.TryParse<ItemStatus>(dto.Status, out var status))
                item.Status = status;

            // Save changes to the data store.
            await _unitOfWork.SaveChangesAsync();

            // Map the updated entity back to a DTO for the result.
            var result = _mapper.Map<FoundItemDto>(item);
            return Result<FoundItemDto>.Success(result, "Found item updated successfully");
        }

        /// <summary>
        /// Asynchronously deletes a found item by marking it as deleted, ensuring the item exists and the user has authorization.
        /// </summary>
        /// <param name="id">The unique identifier of the found item to be deleted.</param>
        /// <param name="userId">The unique identifier of the user requesting the deletion.</param>
        /// <returns>
        /// A <see cref="Result"/> indicating the outcome of the operation; it can be a success message 
        /// if deletion is successful, or a failure message if the item is not found or unauthorized.
        /// </returns>
        public async Task<Result> DeleteFoundItemAsync(Guid id, Guid userId)
        {
            // Fetch the item by its unique identifier.
            var item = await _unitOfWork.FoundItems.GetByIdAsync(id);

            // Check if the item exists and is not yet deleted.
            if (item == null || item.IsDeleted)
                return Result.Failure("Found item not found.");

            // Verify user authorization for deleting the item.
            if (item.UserId != userId)
                return Result.Failure("Unauthorized");

            // Mark the item as deleted and update the timestamp.
            item.IsDeleted = true;
            item.UpdatedAt = DateTime.UtcNow;

            // Persist changes to the data store.
            await _unitOfWork.SaveChangesAsync();

            // Return successful operation result.
            return Result.Success("Found item deleted successfully");
        }
    }
}