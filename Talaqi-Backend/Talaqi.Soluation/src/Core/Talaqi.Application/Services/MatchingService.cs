using AutoMapper;
using System.Text.Json;
using Talaqi.Application.Common;
using Talaqi.Application.DTOs.AI;
using Talaqi.Application.DTOs.Items;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Application.Interfaces.Services;
using Talaqi.Domain.Entities;
using Talaqi.Domain.Enums;

namespace Talaqi.Application.Services
{
    public class MatchingService : IMatchingService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;
        private const decimal MATCH_THRESHOLD = 60.0m; 

        public MatchingService(IUnitOfWork unitOfWork, IEmailService emailService, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _emailService = emailService;
            _mapper = mapper;
        }

        public async Task<Result<List<MatchDto>>> FindMatchesForLostItemAsync(Guid lostItemId)
        {
            var lostItem = await _unitOfWork.LostItems.GetByIdAsync(lostItemId);

            if (lostItem == null)
                return Result<List<MatchDto>>.Failure("Lost item not found");

            var lostAnalysis = JsonSerializer.Deserialize<AIAnalysisResult>(lostItem.AIAnalysisData ?? "{}");

            var foundItems = await _unitOfWork.FoundItems.GetByCategoryAsync(lostItem.Category);
            var matches = new List<Match>();

            foreach (var foundItem in foundItems.Where(x => x.Status == ItemStatus.Active && !x.IsDeleted))
            {
                var foundAnalysis = JsonSerializer.Deserialize<AIAnalysisResult>(foundItem.AIAnalysisData ?? "{}");

                var score = CalculateMatchScore(lostAnalysis, foundAnalysis, foundItem, lostItem );

                if (score >= MATCH_THRESHOLD)
                {
                    var existingMatch = await _unitOfWork.Matches
                        .GetMatchByItemsAsync(lostItem.Id, foundItem.Id);

                    if (existingMatch == null)
                    {
                        var match = new Match
                        {
                            LostItemId = lostItem.Id,
                            FoundItemId = foundItem.Id,
                            ConfidenceScore = score,
                            Status = MatchStatus.Pending,
                            CreatedAt = DateTime.UtcNow
                        };

                        await _unitOfWork.Matches.AddAsync(match);
                        matches.Add(match);

                        await _emailService.SendMatchNotificationAsync(
                            lostItem.User.Email,
                            $"A potential match found for your lost item: {lostItem.Title}");

                        match.NotificationSent = true;
                        match.NotificationSentAt = DateTime.UtcNow;
                    }
                }
            }

            await _unitOfWork.SaveChangesAsync();

            var matchDtos = matches.Select(x => _mapper.Map<MatchDto>(x)).ToList();

            return Result<List<MatchDto>>.Success(matchDtos);
        }


        public async Task<Result<List<MatchDto>>> FindMatchesForFoundItemAsync(Guid foundItemId)
        {
            var foundItem = await _unitOfWork.FoundItems.GetByIdAsync(foundItemId);

            if (foundItem == null)
                return Result<List<MatchDto>>.Failure("Found item not found");

            var foundAnalysis = JsonSerializer.Deserialize<AIAnalysisResult>(foundItem.AIAnalysisData ?? "{}");

            var lostItems = await _unitOfWork.LostItems.GetByCategoryAsync(foundItem.Category);
            var matches = new List<Match>();

            foreach (var lostItem in lostItems.Where(x => x.Status == ItemStatus.Active && !x.IsDeleted))
            {
                var lostAnalysis = JsonSerializer.Deserialize<AIAnalysisResult>(lostItem.AIAnalysisData ?? "{}");
                var score = CalculateMatchScore(foundAnalysis, lostAnalysis, foundItem, lostItem);

                if (score >= MATCH_THRESHOLD)
                {
                    var existingMatch = await _unitOfWork.Matches
                        .GetMatchByItemsAsync(lostItem.Id, foundItem.Id);

                    if (existingMatch == null)
                    {
                        var match = new Match
                        {
                            LostItemId = lostItem.Id,
                            FoundItemId = foundItem.Id,
                            ConfidenceScore = score,
                            Status = MatchStatus.Pending,
                            CreatedAt = DateTime.UtcNow
                        };

                        await _unitOfWork.Matches.AddAsync(match);
                        matches.Add(match);

                        await _emailService.SendMatchNotificationAsync(
                            lostItem.User.Email,
                            $"A potential match found for your lost item: {lostItem.Title}");

                        match.NotificationSent = true;
                        match.NotificationSentAt = DateTime.UtcNow;
                    }
                }
            }

            await _unitOfWork.SaveChangesAsync();

            var matchDtos = matches.Select(x => _mapper.Map<MatchDto>(x)).ToList();
            return Result<List<MatchDto>>.Success(matchDtos);
        }

        public async Task<Result<List<MatchDto>>> GetUserMatchesAsync(Guid userId)
        {
            var matches = await _unitOfWork.Matches.GetMatchesForUserAsync(userId);
            var dtos = matches.Select(x => _mapper.Map<MatchDto>(x)).ToList();

            return Result<List<MatchDto>>.Success(dtos);
        }

        public async Task<Result<MatchDto>> GetMatchByIdAsync(Guid matchId)
        {
            var match = await _unitOfWork.Matches.GetByIdAsync(matchId);

            if (match == null)
                return Result<MatchDto>.Failure("Match not found");

            var dto = _mapper.Map<MatchDto>(match);
            return Result<MatchDto>.Success(dto);
        }

        public async Task<Result> UpdateMatchStatusAsync(Guid matchId, string status, Guid userId)
        {
            var match = await _unitOfWork.Matches.GetByIdAsync(matchId);

            if (match == null)
                return Result.Failure("Match not found");

            if (match.LostItem.UserId != userId)
                return Result.Failure("Unauthorized");

            if (Enum.TryParse<MatchStatus>(status, out var matchStatus))
            {
                match.Status = matchStatus;
                match.UpdatedAt = DateTime.UtcNow;

                await _unitOfWork.SaveChangesAsync();
                return Result.Success("Match status updated");
            }

            return Result.Failure("Invalid status");
        }

        private decimal CalculateMatchScore(AIAnalysisResult? foundAnalysis, AIAnalysisResult? lostAnalysis,
                                            FoundItem foundItem, LostItem lostItem)
        {
            decimal score = 0;
            int factors = 0;

            if (foundAnalysis?.Keywords != null && lostAnalysis?.Keywords != null)
            {
                var commonKeywords = foundAnalysis.Keywords
                    .Intersect(lostAnalysis.Keywords, StringComparer.OrdinalIgnoreCase).Count();
                var totalKeywords = Math.Max(foundAnalysis.Keywords.Count, lostAnalysis.Keywords.Count);

                if (totalKeywords > 0)
                {
                    score += (commonKeywords / (decimal)totalKeywords) * 40;
                    factors++;
                }
            }

            if (foundItem.Location.Latitude.HasValue && lostItem.Location.Latitude.HasValue)
            {
                var distance = CalculateDistance(
                    foundItem.Location.Latitude.Value, foundItem.Location.Longitude!.Value,
                    lostItem.Location.Latitude.Value, lostItem.Location.Longitude!.Value);

                var locationScore = Math.Max(0, 30 - (distance / 5 * 30));
                score += (decimal)locationScore;
                factors++;
            }

            var daysDifference = Math.Abs((foundItem.DateFound - lostItem.DateLost).TotalDays);
            var dateScore = Math.Max(0, 30 - (daysDifference / 30 * 30)); 
            score += (decimal)dateScore;
            factors++;

            return factors > 0 ? score : 0;
        }

        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371; 
            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        private double ToRadians(double degrees) => degrees * Math.PI / 180;
    }
}
