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
        private readonly MatchingOptions _options;

        // Configurable thresholds per category
        private readonly Dictionary<ItemCategory, (decimal candidate, decimal match)> _thresholds = new()
        {
            { ItemCategory.People, (candidate: 30m, match: 55m) },
            { ItemCategory.Pets, (candidate: 28m, match: 50m) },
            { ItemCategory.PersonalBelongings, (candidate: 25m, match: 52m) }
        };

        private readonly TimeSpan _maxDateWindow = TimeSpan.FromDays(60);
        private readonly int _topNExpose = 5;
        private readonly int _maxCandidatesPerItem = 50;

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

        public MatchingService(IUnitOfWork u, IEmailService email, IMapper mapper, Microsoft.Extensions.Options.IOptions<MatchingOptions> options)
        {
            _unitOfWork = u;
            _emailService = email;
            _mapper = mapper;
            _options = options.Value;
        }

        public async Task<Result<List<MatchDto>>> FindMatchesForLostItemAsync(Guid lostItemId)
        {
            var lostItem = await _unitOfWork.LostItems.GetByIdAsync(lostItemId);
            if (lostItem == null)
                return Result<List<MatchDto>>.Failure("Lost item not found");

            var lostAI = JsonSerializer.Deserialize<AIAnalysisResult>(lostItem.AIAnalysisData ?? "{}");
            var foundItems = await _unitOfWork.FoundItems.GetByCategoryAsync(lostItem.Category);
            // Stage 1: Candidate generation with low threshold
            var candidates = new List<MatchCandidate>();
            foreach (var found in foundItems.Where(x => x.Status == ItemStatus.Active && !x.IsDeleted))
            {
                if (candidates.Count >= _maxCandidatesPerItem) break;
                var foundAI = JsonSerializer.Deserialize<AIAnalysisResult>(found.AIAnalysisData ?? "{}");
                var (sText, sImage, sLoc, sDate, agg, reasons) = ComputeEnsembleScores(foundAI, lostAI, found, lostItem);

                var catCandidate = _options.CandidateThresholds.TryGetValue(lostItem.Category, out var ct) ? ct : 25m;
                if (agg >= catCandidate)
                {
                    await UpsertCandidate(found, lostItem, sText, sImage, sLoc, sDate, agg, reasons, candidates);
                }
            }

            // Stage 2: Promote candidates to matches with strict rules
            var promotedMatches = await PromoteCandidatesAsync(candidates, lostItem.Category);

            await _unitOfWork.SaveChangesAsync();

            // Expose Top-N only
            var dtos = promotedMatches
                .OrderByDescending(m => m.ConfidenceScore)
                .Take(_topNExpose)
                .Select(_mapper.Map<MatchDto>)
                .ToList();

            return Result<List<MatchDto>>.Success(dtos);
        }

        public async Task<Result<List<MatchDto>>> FindMatchesForFoundItemAsync(Guid foundItemId)
        {
            var foundItem = await _unitOfWork.FoundItems.GetByIdAsync(foundItemId);
            if (foundItem == null)
                return Result<List<MatchDto>>.Failure("Found item not found");

            var foundAI = JsonSerializer.Deserialize<AIAnalysisResult>(foundItem.AIAnalysisData ?? "{}");
            var lostItems = await _unitOfWork.LostItems.GetByCategoryAsync(foundItem.Category);
            var candidates = new List<MatchCandidate>();
            foreach (var lost in lostItems.Where(x => x.Status == ItemStatus.Active && !x.IsDeleted))
            {
                if (candidates.Count >= _maxCandidatesPerItem) break;
                var lostAI = JsonSerializer.Deserialize<AIAnalysisResult>(lost.AIAnalysisData ?? "{}");
                var (sText, sImage, sLoc, sDate, agg, reasons) = ComputeEnsembleScores(foundAI, lostAI, foundItem, lost);

                var catCandidate = _options.CandidateThresholds.TryGetValue(foundItem.Category, out var ct) ? ct : 25m;
                if (agg >= catCandidate)
                {
                    await UpsertCandidate(foundItem, lost, sText, sImage, sLoc, sDate, agg, reasons, candidates);
                }
            }

            var promotedMatches = await PromoteCandidatesAsync(candidates, foundItem.Category);
            await _unitOfWork.SaveChangesAsync();

            var dtos = promotedMatches
                .OrderByDescending(m => m.ConfidenceScore)
                .Take(_topNExpose)
                .Select(_mapper.Map<MatchDto>)
                .ToList();

            return Result<List<MatchDto>>.Success(dtos);
        }

        private decimal CalculateMatchScore(
    AIAnalysisResult? foundAI,
    AIAnalysisResult? lostAI,
    FoundItem found,
    LostItem lost)
        {
            decimal scoreKeywords = 0;
            decimal scoreSemantic = 0;

            if (foundAI?.Keywords != null && lostAI?.Keywords != null)
            {
                var foundKw = NormalizeKeywords(foundAI.Keywords);
                var lostKw = NormalizeKeywords(lostAI.Keywords);

                var intersect = foundKw.Intersect(lostKw, StringComparer.OrdinalIgnoreCase).Count();
                var union = foundKw.Union(lostKw, StringComparer.OrdinalIgnoreCase).Count();

                if (union > 0)
                {
                    var jaccard = intersect / (decimal)union;
                    var bonus = intersect >= 3 ? 0.1m : 0m;
                    scoreKeywords = Math.Clamp((jaccard + bonus) * 100m, 0, 100);
                }
            }

            var foundEmb = GetEmbedding(foundAI);
            var lostEmb = GetEmbedding(lostAI);
            if (foundEmb != null && lostEmb != null)
            {
                var cos = (decimal)(CosineSimilarity(foundEmb, lostEmb) * 100.0);
                scoreSemantic = Math.Clamp(cos, 0, 100);
            }

            // Blend text only
            var textScore =
                scoreSemantic > 0
                    ? (0.6m * scoreSemantic + 0.4m * scoreKeywords)
                    : scoreKeywords;

            return Math.Clamp(textScore, 0, 100);
        }


        private (decimal sText, decimal sImage, decimal sLoc, decimal sDate, decimal agg, Dictionary<string, object> reasons)
            ComputeEnsembleScores(AIAnalysisResult? foundAI, AIAnalysisResult? lostAI, FoundItem found, LostItem lost)
        {
            // Reuse existing calculations for text (keywords+semantic), location and date
            var textScore = CalculateMatchScore(foundAI, lostAI, found, lost);

            // Image similarity via embeddings if present
            var imgA = GetImageEmbedding(foundAI);
            var imgB = GetImageEmbedding(lostAI);
            decimal imgScore = 0;
            if (imgA != null && imgB != null)
            {
                imgScore = (decimal)(CosineSimilarity(imgA, imgB) * 100.0);
                imgScore = Math.Clamp(imgScore, 0, 100);
            }

            // Location-only and Date-only components already inside CalculateMatchScore, but we also derive standalone:
            decimal gpsScore = 0; int adminScore = 0;
            if (found.Location.Latitude != null && lost.Location.Latitude != null)
            {
                var dist = Haversine(
                    found.Location.Latitude.Value, found.Location.Longitude!.Value,
                    lost.Location.Latitude.Value, lost.Location.Longitude!.Value);
                var score = 100.0 * Math.Exp(-(dist / 5.0));
                gpsScore = (decimal)Math.Clamp(score, 0, 100);
            }
            var foundAddr = foundAI?.AdditionalData?.GetValueOrDefault("normalized_address")?.ToString();
            var lostAddr = lostAI?.AdditionalData?.GetValueOrDefault("normalized_address")?.ToString();
            if (!string.IsNullOrWhiteSpace(foundAddr) && !string.IsNullOrWhiteSpace(lostAddr) &&
                foundAddr.Equals(lostAddr, StringComparison.OrdinalIgnoreCase)) adminScore = 100;
            else if (found.Location.City == lost.Location.City) adminScore = 75;
            else if (found.Location.Governorate == lost.Location.Governorate) adminScore = 55;
            var locScore = Math.Max(gpsScore, adminScore);

            var days = Math.Abs((found.DateFound - lost.DateLost).TotalDays);
            var dateScore = (decimal)Math.Clamp(100.0 * Math.Exp(-(days / 7.0)), 5, 100);

            // Dynamic weighting: category-aware blend and missing data compensation
            var cat = lost.Category;
            var (candidate, match) = _thresholds.ContainsKey(cat) ? _thresholds[cat] : (25m, 50m);
            decimal wText = 0.5m, wImage = 0.2m, wLoc = 0.2m, wDate = 0.1m;
            if (cat == ItemCategory.People) { wText = 0.35m; wImage = 0.25m; wLoc = 0.30m; wDate = 0.10m; }
            if (cat == ItemCategory.PersonalBelongings) { wText = 0.55m; wImage = 0.25m; wLoc = 0.10m; wDate = 0.10m; }
            if (cat == ItemCategory.Pets) { wText = 0.45m; wImage = 0.25m; wLoc = 0.20m; wDate = 0.10m; }

            // Missing data compensation
            if (string.IsNullOrWhiteSpace(found.ImageUrl) || string.IsNullOrWhiteSpace(lost.ImageUrl))
            {
                // shift weight from image to text/location
                var shift = wImage * 0.5m; wImage -= shift; wText += shift * 0.7m; wLoc += shift * 0.3m;
            }
            if (found.Location.Latitude == null || lost.Location.Latitude == null)
            {
                var shift = wLoc * 0.5m; wLoc -= shift; wText += shift * 0.7m; wImage += shift * 0.3m;
            }

            // Age-aware thresholds could be handled during promotion; here just include dateScore
            var aggregate = Math.Clamp(wText * textScore + wImage * imgScore + wLoc * locScore + wDate * dateScore, 0, 100);

            var reasons = new Dictionary<string, object>
            {
                ["shared_keywords"] = (lostAI?.Keywords != null && foundAI?.Keywords != null)
                    ? NormalizeKeywords(lostAI.Keywords).Intersect(NormalizeKeywords(foundAI.Keywords), StringComparer.OrdinalIgnoreCase).Take(10).ToList()
                    : new List<string>(),
                ["location_score"] = (double)locScore,
                ["date_days_difference"] = days,
                ["image_similarity"] = (double)imgScore,
                ["text_score"] = (double)textScore,
                ["aggregate"] = (double)aggregate
            };

            return (textScore, imgScore, locScore, dateScore, aggregate, reasons);
        }

        private static List<string> NormalizeKeywords(IEnumerable<string> keywords)
        {
            return keywords
                .Select(k => k?.Trim().ToLowerInvariant())
                .Where(k => !string.IsNullOrWhiteSpace(k))
                .Distinct()
                .ToList();
        }

        private static double[]? GetEmbedding(AIAnalysisResult? ai)
        {
            if (ai?.AdditionalData == null) return null;
            if (!ai.AdditionalData.TryGetValue("embedding", out var embObj) || embObj == null) return null;

            if (embObj is double[] arr) return arr;
            if (embObj is IEnumerable<double> enumerable) return enumerable.ToArray();
            if (embObj is IEnumerable<object> objs)
            {
                try { return objs.Select(o => Convert.ToDouble(o)).ToArray(); } catch { return null; }
            }
            return null;
        }

        private static double[]? GetImageEmbedding(AIAnalysisResult? ai)
        {
            if (ai?.AdditionalData == null) return null;
            if (!ai.AdditionalData.TryGetValue("image_embedding", out var embObj) || embObj == null) return null;
            if (embObj is double[] arr) return arr;
            if (embObj is IEnumerable<double> enumerable) return enumerable.ToArray();
            if (embObj is IEnumerable<object> objs)
            {
                try { return objs.Select(o => Convert.ToDouble(o)).ToArray(); } catch { return null; }
            }
            return null;
        }

        private static double CosineSimilarity(double[] a, double[] b)
        {
            if (a.Length == 0 || b.Length == 0) return 0;
            int len = Math.Min(a.Length, b.Length);
            double dot = 0, na = 0, nb = 0;
            for (int i = 0; i < len; i++)
            {
                dot += a[i] * b[i];
                na += a[i] * a[i];
                nb += b[i] * b[i];
            }
            if (na == 0 || nb == 0) return 0;
            return dot / (Math.Sqrt(na) * Math.Sqrt(nb));
        }

        private async Task TryCreateMatch(FoundItem found, LostItem lost, decimal score, List<Match> list, string? reasonsJson = null)
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

            match.MatchDetails = reasonsJson;
            // Structured explanation
            match.MatchExplanation = reasonsJson;

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

        // Stage helpers
        private async Task UpsertCandidate(FoundItem found, LostItem lost,
            decimal sText, decimal sImage, decimal sLoc, decimal sDate, decimal agg,
            Dictionary<string, object> reasons, List<MatchCandidate> list)
        {
            var existing = await _unitOfWork.MatchCandidates.GetByItemsAsync(lost.Id, found.Id);
            var json = JsonSerializer.Serialize(reasons);
            if (existing != null)
            {
                existing.ScoreText = sText;
                existing.ScoreImage = sImage;
                existing.ScoreLocation = sLoc;
                existing.ScoreDate = sDate;
                existing.AggregateScore = agg;
                existing.ReasonsJson = json;
            }
            else
            {
                var candidate = new MatchCandidate
                {
                    LostItemId = lost.Id,
                    FoundItemId = found.Id,
                    ScoreText = sText,
                    ScoreImage = sImage,
                    ScoreLocation = sLoc,
                    ScoreDate = sDate,
                    AggregateScore = agg,
                    ReasonsJson = json,
                    CreatedAt = DateTime.UtcNow
                };
                await _unitOfWork.MatchCandidates.AddAsync(candidate);
                list.Add(candidate);
            }
        }

        private async Task<List<Match>> PromoteCandidatesAsync(List<MatchCandidate> candidates, ItemCategory category)
        {
            var matches = new List<Match>();
            var promotionThreshold = _options.PromotionThresholds.TryGetValue(category, out var pt) ? pt : 50m;
            foreach (var c in candidates)
            {
                var lost = await _unitOfWork.LostItems.GetByIdAsync(c.LostItemId);
                var found = await _unitOfWork.FoundItems.GetByIdAsync(c.FoundItemId);
                if (lost == null || found == null) continue;

                // Hard filters
                if (lost.Category != found.Category) continue;
                if (lost.IsDeleted || found.IsDeleted) continue;
                if (lost.Status != ItemStatus.Active || found.Status != ItemStatus.Active) continue;
                var days = Math.Abs((found.DateFound - lost.DateLost).TotalDays);
                if (days > _maxDateWindow.TotalDays) continue;
                if (_options.StrictLocationGovernorate && !string.Equals(lost.Location.Governorate, found.Location.Governorate, StringComparison.OrdinalIgnoreCase)) continue;

                // Age-aware: relax match threshold slightly for older items
                var ageDays = Math.Min(180, Math.Max(0, (int)(DateTime.UtcNow - lost.CreatedAt).TotalDays));
                var relax = Math.Min(10m, (decimal)ageDays / 30m * 2m); // up to 10 pts relaxation
                var effectiveMatchThreshold = Math.Max(40m, promotionThreshold - relax);

                if (c.AggregateScore >= effectiveMatchThreshold)
                {
                    // Idempotency check
                    var existing = await _unitOfWork.Matches.GetMatchByItemsAsync(c.LostItemId, c.FoundItemId);
                    if (existing != null) { c.Promoted = true; continue; }
                    await TryCreateMatch(found, lost, c.AggregateScore, matches, c.ReasonsJson);
                    c.Promoted = true;
                }
            }
            return matches;
        }
    }
}
