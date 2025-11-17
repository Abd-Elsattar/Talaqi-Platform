using System.Text;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OpenAI.Chat;
using Talaqi.Application.DTOs.AI;
using Talaqi.Application.Interfaces.Services;

namespace Talaqi.Infrastructure.Services
{
    public class AIService : IAIService
    {
        private readonly ChatClient _chatClient;
        private readonly ILogger<AIService> _logger;
        private readonly IMemoryCache _cache;
        private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(6);

        public AIService(IConfiguration config, ILogger<AIService> logger, IMemoryCache cache)
        {
            _logger = logger;
            _cache = cache;

            var apiKey = config["OpenAI:ApiKey"]
                ?? throw new InvalidOperationException("Missing OpenAI API Key.");
            var model = config["OpenAI:Model"] ?? "gpt-4o-mini";

            _chatClient = new ChatClient(model: model, apiKey: apiKey);
        }

        #region Image / Text / Location analysis (implements IAIService)

        public async Task<AIAnalysisResult> AnalyzeImageAsync(string imageUrl)
        {
            if (_cache.TryGetValue($"img:{imageUrl}", out AIAnalysisResult cached))
                return cached;

            try
            {
                ChatCompletion completion = await _chatClient.CompleteChatAsync(new List<ChatMessage>
                {
                    new SystemChatMessage("You are an expert in image analysis."),
                    new UserChatMessage($"Analyze this image at URL: {imageUrl}. Describe main objects, dominant colors and notable features.")
                });

                var description = completion?.Content?.FirstOrDefault()?.Text ?? "No description available.";
                var keywords = ExtractKeywords(description);

                var analysis = new AIAnalysisResult
                {
                    Success = true,
                    ImageFeatures = Convert.ToBase64String(Encoding.UTF8.GetBytes(imageUrl)),
                    Keywords = keywords,
                    AdditionalData = new Dictionary<string, object>
                    {
                        { "description", description },
                        { "color_dominant", keywords.FirstOrDefault(k => k.Contains("color")) ?? "unknown" }
                    }
                };

                _cache.Set($"img:{imageUrl}", analysis, CacheDuration);
                return analysis;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AnalyzeImageAsync failed");
                return new AIAnalysisResult { Success = false, Error = ex.Message };
            }
        }

        public async Task<AIAnalysisResult> AnalyzeTextAsync(string description)
        {
            var cacheKey = $"txt:{description.GetHashCode()}";
            if (_cache.TryGetValue(cacheKey, out AIAnalysisResult cached))
                return cached;

            try
            {
                ChatCompletion completion = await _chatClient.CompleteChatAsync(new List<ChatMessage>
                {
                    new SystemChatMessage("You are an NLP assistant that extracts keywords."),
                    new UserChatMessage($"Extract up to 10 important keywords from this text: {description}")
                });

                var output = completion?.Content?.FirstOrDefault()?.Text ?? "";
                var keywords = ExtractKeywords(output);

                var analysis = new AIAnalysisResult
                {
                    Success = true,
                    Keywords = keywords
                };

                _cache.Set(cacheKey, analysis, CacheDuration);
                return analysis;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AnalyzeTextAsync failed");
                return new AIAnalysisResult { Success = false, Error = ex.Message };
            }
        }

        public Task<AIAnalysisResult> AnalyzeLocationAsync(string location)
        {
            var normalized = (location ?? string.Empty).Trim().ToLowerInvariant();
            var cacheKey = $"loc:{normalized}";
            if (_cache.TryGetValue(cacheKey, out AIAnalysisResult cached))
                return Task.FromResult(cached);

            var result = new AIAnalysisResult
            {
                Success = true,
                AdditionalData = new Dictionary<string, object>
                {
                    { "normalized_address", normalized },
                    { "timestamp", DateTime.UtcNow }
                }
            };

            _cache.Set(cacheKey, result, CacheDuration);
            return Task.FromResult(result);
        }

        public async Task<AIAnalysisResult> AnalyzeLostItemAsync(string? imageUrl, string description, string location)
        {
            var results = new List<AIAnalysisResult>();

            if (!string.IsNullOrWhiteSpace(imageUrl))
                results.Add(await AnalyzeImageAsync(imageUrl!));

            results.Add(await AnalyzeTextAsync(description));
            results.Add(await AnalyzeLocationAsync(location));

            return CombineResults(results);
        }

        public Task<AIAnalysisResult> AnalyzeFoundItemAsync(string? imageUrl, string description, string location)
            => AnalyzeLostItemAsync(imageUrl, description, location);
        #endregion
        #region Matching
        public double ComputeMatchScore(AIAnalysisResult lostItem, AIAnalysisResult foundItem)
        {
            double keywordScore = 0, imageScore = 0, locationScore = 0;

            if (lostItem.Keywords?.Any() == true && foundItem.Keywords?.Any() == true)
            {
                var intersect = lostItem.Keywords.Intersect(foundItem.Keywords).Count();
                var union = lostItem.Keywords.Union(foundItem.Keywords).Count();
                keywordScore = union == 0 ? 0 : (double)intersect / union;
            }

            if (!string.IsNullOrEmpty(lostItem.ImageFeatures) && !string.IsNullOrEmpty(foundItem.ImageFeatures))
                imageScore = lostItem.ImageFeatures == foundItem.ImageFeatures ? 1.0 : 0.5;

            if (lostItem.AdditionalData.TryGetValue("normalized_address", out var lostLoc) &&
                foundItem.AdditionalData.TryGetValue("normalized_address", out var foundLoc))
                locationScore = lostLoc!.ToString() == foundLoc!.ToString() ? 1.0 : 0.4;

            var total = (keywordScore * 0.6) + (imageScore * 0.25) + (locationScore * 0.15);
            return Math.Round(total, 2);
        }

        #endregion
        #region Helpers
        private List<string> ExtractKeywords(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return new List<string>();

            var common = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                "the","a","an","and","or","in","on","for","with","is","was","are","of",
                "at","to","it","this","that","from","by","you","your","my","our","their"
            };

            return text.ToLowerInvariant()
                .Split(new[] { ' ', ',', '.', ';', ':', '-', '\n', '\r', '!' }, StringSplitOptions.RemoveEmptyEntries)
                .Where(w => w.Length > 3 && !common.Contains(w))
                .Distinct()
                .Take(25)
                .ToList();
        }

        private AIAnalysisResult CombineResults(IEnumerable<AIAnalysisResult> results)
        {
            var list = results.ToList();
            var combined = new AIAnalysisResult
            {
                Success = list.Any(r => r.Success),
                Keywords = list.SelectMany(r => r.Keywords ?? new List<string>()).Distinct().ToList(),
                AdditionalData = new Dictionary<string, object>()
            };

            foreach (var r in list)
            {
                if (r.AdditionalData == null) continue;
                foreach (var kvp in r.AdditionalData)
                {
                    if (!combined.AdditionalData.ContainsKey(kvp.Key))
                        combined.AdditionalData[kvp.Key] = kvp.Value;
                }
            }

            var img = list.FirstOrDefault(r => !string.IsNullOrEmpty(r.ImageFeatures));
            if (img != null) combined.ImageFeatures = img.ImageFeatures;

            return combined;
        }
        #endregion
    }
}
