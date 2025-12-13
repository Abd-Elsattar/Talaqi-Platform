using AutoMapper;
using System.Text.Json;
using Talaqi.Application.Common;
using Talaqi.Application.DTOs.Items;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Application.Interfaces.Services;
using Talaqi.Domain.Entities;
using Talaqi.Domain.Enums;
using Talaqi.Domain.ValueObjects;

namespace Talaqi.Application.Services
{
    public class LostItemService : ILostItemService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAIService _aiService;
        private readonly IMatchingService _matchingService;
        private readonly IMapper _mapper;
        private readonly Talaqi.Application.Rag.Embeddings.IEmbeddingService _embeddingService;

        public LostItemService(IUnitOfWork unitOfWork, IAIService aiService, IMapper mapper, IMatchingService matchingService, Talaqi.Application.Rag.Embeddings.IEmbeddingService embeddingService)
        {
            _unitOfWork = unitOfWork;
            _aiService = aiService;
            _mapper = mapper;
            _matchingService = matchingService;
            _embeddingService = embeddingService;
        }

        public async Task<Result<LostItemDto>> CreateLostItemAsync(CreateLostItemDto dto, Guid userId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return Result<LostItemDto>.Failure("User not found");

            if (!Enum.TryParse<ItemCategory>(dto.Category, out var category))
                return Result<LostItemDto>.Failure("Invalid category");

            var aiResult = await _aiService.AnalyzeLostItemAsync(
                dto.ImageUrl, dto.Description, dto.Location.Address);

            var lostItem = new LostItem
            {
                UserId = userId,
                Category = category,
                Title = dto.Title,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl,
                Location = _mapper.Map<Location>(dto.Location),
                DateLost = dto.DateLost,
                ContactInfo = dto.ContactInfo,
                Status = ItemStatus.Active,
                AIAnalysisData = JsonSerializer.Serialize(aiResult),
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.ExecuteTransactionalAsync(async () =>
            {
                await _unitOfWork.LostItems.AddAsync(lostItem);
                await _unitOfWork.SaveChangesAsync();

                await _matchingService.FindMatchesForLostItemAsync(lostItem.Id);
                _ = Task.Run(async () =>
                {
                    try { await _embeddingService.UpsertItemEmbeddingAsync(lostItem, "Lost"); }
                    catch { /* swallow to avoid blocking */ }
                });
            });
            

            var result = _mapper.Map<LostItemDto>(lostItem);
            result.UserName = user.FullName;
            result.UserProfilePicture = user.ProfilePictureUrl ?? "";

            return Result<LostItemDto>.Success(result, "Lost item reported successfully");
        }

        public async Task<Result<LostItemDto>> GetLostItemByIdAsync(Guid id)
        {
            var item = await _unitOfWork.LostItems.GetByIdAsync(id);

            if (item == null || item.IsDeleted)
                return Result<LostItemDto>.Failure("Lost item not found");

            var dto = _mapper.Map<LostItemDto>(item);
            dto.UserName = item.User.FullName;
            dto.UserProfilePicture = item.User.ProfilePictureUrl ?? "";
            dto.MatchCount = item.Matches.Count;

            return Result<LostItemDto>.Success(dto);
        }

        public async Task<Result<PaginatedList<LostItemDto>>> GetAllLostItemsAsync(
            int pageNumber, int pageSize, string? category = null)
        {
            var items = await _unitOfWork.LostItems.GetActiveLostItemsAsync(pageNumber, pageSize);
            var totalCount = await _unitOfWork.LostItems.CountAsync(x => !x.IsDeleted && x.Status == ItemStatus.Active);

            var dtos = items.Select(x =>
            {
                var dto = _mapper.Map<LostItemDto>(x);
                dto.UserName = x.User.FullName;
                dto.UserProfilePicture = x.User.ProfilePictureUrl ?? "";
                dto.MatchCount = x.Matches.Count;
                return dto;
            }).ToList();

            var result = new PaginatedList<LostItemDto>(dtos, totalCount, pageNumber, pageSize);
            return Result<PaginatedList<LostItemDto>>.Success(result);
        }

        public async Task<Result<List<LostItemDto>>> GetUserLostItemsAsync(Guid userId)
        {
            var items = await _unitOfWork.LostItems.GetByUserIdAsync(userId);
            var dtos = items.Select(x =>
            {
                var dto = _mapper.Map<LostItemDto>(x);
                dto.UserName = x.User.FullName;
                dto.UserProfilePicture = x.User.ProfilePictureUrl ?? "";
                dto.MatchCount = x.Matches.Count;
                return dto;
            }).ToList();

            return Result<List<LostItemDto>>.Success(dtos);
        }

        public async Task<Result<List<LostItemDto>>> GetLostItemsFeedAsync(int count = 20)
        {
            var items = await _unitOfWork.LostItems.GetRecentFeedAsync(count);
            var dtos = items.Select(x =>
            {
                var dto = _mapper.Map<LostItemDto>(x);
                dto.UserName = x.User.FullName;
                dto.UserProfilePicture = x.User.ProfilePictureUrl ?? "";
                dto.MatchCount = x.Matches.Count;
                return dto;
            }).ToList();

            return Result<List<LostItemDto>>.Success(dtos);
        }

        public async Task<Result<LostItemDto>> UpdateLostItemAsync(Guid id, UpdateLostItemDto dto, Guid userId)
        {
            var item = await _unitOfWork.LostItems.GetByIdAsync(id);

            if (item == null || item.IsDeleted)
                return Result<LostItemDto>.Failure("Lost item not found");

            if (item.UserId != userId)
                return Result<LostItemDto>.Failure("Unauthorized");

            item.Title = dto.Title;
            item.Description = dto.Description;
            item.ImageUrl = dto.ImageUrl;
            item.Location = _mapper.Map<Location>(dto.Location);
            item.ContactInfo = dto.ContactInfo;
            item.UpdatedAt = DateTime.UtcNow;

            if (Enum.TryParse<ItemStatus>(dto.Status, out var status))
                item.Status = status;

            await _unitOfWork.SaveChangesAsync();

            var result = _mapper.Map<LostItemDto>(item);
            // Trigger re-matching on update
            await _matchingService.FindMatchesForLostItemAsync(item.Id);
            _ = Task.Run(async () =>
            {
                try { await _embeddingService.UpsertItemEmbeddingAsync(item, "Lost"); }
                catch { }
            });
            return Result<LostItemDto>.Success(result, "Lost item updated successfully");
        }

        public async Task<Result> DeleteLostItemAsync(Guid id, Guid userId)
        {
            var item = await _unitOfWork.LostItems.GetByIdAsync(id);

            if (item == null || item.IsDeleted)
                return Result.Failure("Lost item not found");

            if (item.UserId != userId)
                return Result.Failure("Unauthorized");

            item.IsDeleted = true;
            item.DeletedAt = DateTime.UtcNow;
            item.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();

            _ = Task.Run(async () =>
            {
                try { await _embeddingService.RemoveItemEmbeddingAsync(item.Id, "Lost"); }
                catch { }
            });

            return Result.Success("Lost item deleted successfully");
        }
    }
}