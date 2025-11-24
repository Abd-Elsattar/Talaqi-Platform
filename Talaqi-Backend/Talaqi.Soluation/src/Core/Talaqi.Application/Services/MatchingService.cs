using AutoMapper;
using System.Text.Json;
using Talaqi.Application.Common;
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

        private const decimal MATCH_THRESHOLD = 60m;


        private readonly Dictionary<ItemCategory, CategoryWeights> _weights =
            new Dictionary<ItemCategory, CategoryWeights>
        {
            {
                ItemCategory.People,
                new CategoryWeights
                {
                    Keywords = 0.45m,
                    Location = 0.35m,
                    Date = 0.20m
                }
            },
            {
                ItemCategory.PersonalBelongings,
                new CategoryWeights
                {
                    Keywords = 0.55m,
                    Location = 0.30m,
                    Date = 0.15m
                }
            },
            {
                ItemCategory.Pets,
                new CategoryWeights
                {
                    Keywords = 0.50m,
                    Location = 0.40m,
                    Date = 0.10m
                }
            }
        };

        public MatchingService(IUnitOfWork u, IEmailService email, IMapper mapper)
        {
            _unitOfWork = u;
            _emailService = email;
            _mapper = mapper;
        }

        public async Task<Result<List<MatchDto>>> FindMatchesForLostItemAsync(Guid lostItemId)
        {
            var lostItem = await _unitOfWork.LostItems.GetByIdAsync(lostItemId);
            if (lostItem == null)
                return Result<List<MatchDto>>.Failure("Lost item not found");

            var lostAI = JsonSerializer.Deserialize<AIAnalysisResult>(lostItem.AIAnalysisData ?? "{}");
            var foundItems = await _unitOfWork.FoundItems.GetByCategoryAsync(lostItem.Category);

            var matches = new List<Match>();

            foreach (var found in foundItems.Where(x => x.Status == ItemStatus.Active && !x.IsDeleted))
            {
                var foundAI = JsonSerializer.Deserialize<AIAnalysisResult>(found.AIAnalysisData ?? "{}");

                var score = CalculateMatchScore(foundAI, lostAI, found, lostItem);

                if (score >= MATCH_THRESHOLD)
                {
                    await TryCreateMatch(found, lostItem, score, matches);
                }
            }

            await _unitOfWork.SaveChangesAsync();
            return Result<List<MatchDto>>.Success(matches.Select(_mapper.Map<MatchDto>).ToList());
        }

        public async Task<Result<List<MatchDto>>> FindMatchesForFoundItemAsync(Guid foundItemId)
        {
            var foundItem = await _unitOfWork.FoundItems.GetByIdAsync(foundItemId);
            if (foundItem == null)
                return Result<List<MatchDto>>.Failure("Found item not found");

            var foundAI = JsonSerializer.Deserialize<AIAnalysisResult>(foundItem.AIAnalysisData ?? "{}");
            var lostItems = await _unitOfWork.LostItems.GetByCategoryAsync(foundItem.Category);

            var matches = new List<Match>();

            foreach (var lost in lostItems.Where(x => x.Status == ItemStatus.Active && !x.IsDeleted))
            {
                var lostAI = JsonSerializer.Deserialize<AIAnalysisResult>(lost.AIAnalysisData ?? "{}");

                var score = CalculateMatchScore(foundAI, lostAI, foundItem, lost);

                if (score >= MATCH_THRESHOLD)
                {
                    await TryCreateMatch(foundItem, lost, score, matches);
                }
            }

            await _unitOfWork.SaveChangesAsync();
            return Result<List<MatchDto>>.Success(matches.Select(_mapper.Map<MatchDto>).ToList());
        }

        private decimal CalculateMatchScore(
            AIAnalysisResult? foundAI,
            AIAnalysisResult? lostAI,
            FoundItem found,
            LostItem lost)
        {
            var weights = _weights.ContainsKey(lost.Category)
                ? _weights[lost.Category]
                : new CategoryWeights { Keywords = 0.50m, Location = 0.30m, Date = 0.20m };

            decimal scoreKeywords = 0;
            decimal scoreLocation = 0;
            decimal scoreDate = 0;

            if (foundAI?.Keywords != null && lostAI?.Keywords != null)
            {
                var intersect = foundAI.Keywords
                    .Intersect(lostAI.Keywords, StringComparer.OrdinalIgnoreCase).Count();

                var union = foundAI.Keywords
                    .Union(lostAI.Keywords, StringComparer.OrdinalIgnoreCase).Count();

                if (union > 0)
                    scoreKeywords = (intersect / (decimal)union) * 100m;
            }

            if (found.Location.Latitude != null && lost.Location.Latitude != null)
            {
                var dist = Haversine(
                    found.Location.Latitude.Value, found.Location.Longitude!.Value,
                    lost.Location.Latitude.Value, lost.Location.Longitude!.Value);

                scoreLocation = dist switch
                {
                    <= 0.2 => 100,
                    <= 2 => 75,
                    <= 10 => 40,
                    _ => 10
                };
            }

            var days = Math.Abs((found.DateFound - lost.DateLost).TotalDays);

            scoreDate = days switch
            {
                <= 1 => 100,
                <= 3 => 80,
                <= 7 => 60,
                <= 30 => 30,
                _ => 10
            };

            decimal final =
                (scoreKeywords * weights.Keywords) +
                (scoreLocation * weights.Location) +
                (scoreDate * weights.Date);

            return Math.Clamp(final, 0, 100);
        }

        private async Task TryCreateMatch(FoundItem found, LostItem lost, decimal score, List<Match> list)
        {
            var exists = await _unitOfWork.Matches.GetMatchByItemsAsync(lost.Id, found.Id);
            if (exists != null) return;

            var match = new Match
            {
                LostItemId = lost.Id,
                FoundItemId = found.Id,
                ConfidenceScore = score,
                Status = MatchStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Matches.AddAsync(match);
            list.Add(match);

            await _emailService.SendMatchNotificationAsync(
                lost.User.Email,
                $"A potential match found for your lost item: {lost.Title}");

            match.NotificationSent = true;
            match.NotificationSentAt = DateTime.UtcNow;
        }

        private double Haversine(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371;
            double dLat = ToRad(lat2 - lat1);
            double dLon = ToRad(lon2 - lon1);

            double a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRad(lat1)) * Math.Cos(ToRad(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            return 2 * R * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        }

        private double ToRad(double x) => x * Math.PI / 180;

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
    }
}
