using AutoMapper;
using System.Text.Json;
using Talaqi.Application.Common;
using Talaqi.Application.DTOs.AI;
using Talaqi.Application.DTOs.Items;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Application.Interfaces.Services;
using Talaqi.Domain.Entities;
using Talaqi.Domain.Enums;
using Talaqi.Domain.ValueObjects;
using Microsoft.Extensions.DependencyInjection;

namespace Talaqi.Application.Services
{
    public class FoundItemService : IFoundItemService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAIService _aiService;
        private readonly IMatchingService _matchingService;
        private readonly IMapper _mapper;

        public FoundItemService(IUnitOfWork unitOfWork, IAIService aiService,
                               IMatchingService matchingService, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _aiService = aiService;
            _matchingService = matchingService;
            _mapper = mapper;
        }

        public async Task<Result<FoundItemDto>> CreateFoundItemAsync(CreateFoundItemDto dto, Guid userId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return Result<FoundItemDto>.Failure("User not found");

            if (!Enum.TryParse<ItemCategory>(dto.Category, out var category))
                return Result<FoundItemDto>.Failure("Invalid category");

            // Analyze with AI
            var aiResult = await _aiService.AnalyzeFoundItemAsync(
                dto.ImageUrl, dto.Description, dto.Location.Address);

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
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.BeginTransactionAsync();

            try
            {
                await _unitOfWork.FoundItems.AddAsync(foundItem);
                await _unitOfWork.SaveChangesAsync();

                // Trigger matching process
                await _matchingService.FindMatchesForFoundItemAsync(foundItem.Id);

                await _unitOfWork.CommitTransactionAsync();

                var result = _mapper.Map<FoundItemDto>(foundItem);
                result.UserName = user.FullName;

                return Result<FoundItemDto>.Success(result, "Found item reported successfully");
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        public async Task<Result<FoundItemDto>> GetFoundItemByIdAsync(Guid id)
        {
            var item = await _unitOfWork.FoundItems.GetByIdAsync(id);

            if (item == null || item.IsDeleted)
                return Result<FoundItemDto>.Failure("Found item not found");

            var dto = _mapper.Map<FoundItemDto>(item);
            dto.UserName = item.User.FullName;

            return Result<FoundItemDto>.Success(dto);
        }

        public async Task<Result<List<FoundItemDto>>> GetUserFoundItemsAsync(Guid userId)
        {
            var items = await _unitOfWork.FoundItems.GetByUserIdAsync(userId);
            var dtos = items.Select(x =>
            {
                var dto = _mapper.Map<FoundItemDto>(x);
                dto.UserName = x.User.FullName;
                return dto;
            }).ToList();

            return Result<List<FoundItemDto>>.Success(dtos);
        }

        public async Task<Result<FoundItemDto>> UpdateFoundItemAsync(Guid id, UpdateFoundItemDto dto, Guid userId)
        {
            var item = await _unitOfWork.FoundItems.GetByIdAsync(id);

            if (item == null || item.IsDeleted)
                return Result<FoundItemDto>.Failure("Found item not found");

            if (item.UserId != userId)
                return Result<FoundItemDto>.Failure("Unauthorized");

            item.Title = dto.Title;
            item.Description = dto.Description;
            item.ImageUrl = dto.ImageUrl;
            item.Location = _mapper.Map<Location>(dto.Location);
            item.ContactInfo = dto.ContactInfo;
            item.UpdatedAt = DateTime.UtcNow;

            if (Enum.TryParse<ItemStatus>(dto.Status, out var status))
                item.Status = status;

            await _unitOfWork.SaveChangesAsync();

            var result = _mapper.Map<FoundItemDto>(item);
            return Result<FoundItemDto>.Success(result, "Found item updated successfully");
        }

        public async Task<Result> DeleteFoundItemAsync(Guid id, Guid userId)
        {
            var item = await _unitOfWork.FoundItems.GetByIdAsync(id);

            if (item == null || item.IsDeleted)
                return Result.Failure("Found item not found");

            if (item.UserId != userId)
                return Result.Failure("Unauthorized");

            item.IsDeleted = true;
            item.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();

            return Result.Success("Found item deleted successfully");
        }
    }
}