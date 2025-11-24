using System.Text;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OpenAI.Chat;
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

        public async Task<AIAnalysisResult> AnalyzeImageAsync(string imageUrl)
        {
            if (_cache.TryGetValue($"img:{imageUrl}", out AIAnalysisResult cached))
                return cached;

            try
            {
                ChatCompletion completion = await _chatClient.CompleteChatAsync(
                    new List<ChatMessage>
                    {
                        new SystemChatMessage("Analyze the image and describe objects, colors, people, and features."),
                        new UserChatMessage($"Image URL: {imageUrl}")
                    });

                var description = completion?.Content?.FirstOrDefault()?.Text ?? "";
                var keywords = ExtractKeywords(description);

                var result = new AIAnalysisResult
                {
                    Success = true,
                    Description = description,
                    Keywords = keywords,
                    Tags = keywords.Take(8).ToList(),
                    ImageFeatures = Convert.ToBase64String(Encoding.UTF8.GetBytes(imageUrl)),
                    AdditionalData = new Dictionary<string, object>
                    {
                        { "description", description }
                    }
                };

                _cache.Set($"img:{imageUrl}", result, CacheDuration);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AnalyzeImageAsync failed");
                return new AIAnalysisResult { Success = false, Error = ex.Message };
            }
        }

        public async Task<AIAnalysisResult> AnalyzeTextAsync(string text)
        {
            var cacheKey = $"txt:{text.GetHashCode()}";
            if (_cache.TryGetValue(cacheKey, out AIAnalysisResult cached))
                return cached;

            try
            {
                ChatCompletion completion = await _chatClient.CompleteChatAsync(
                    new List<ChatMessage>
                    {
                        new SystemChatMessage("Extract important keywords."),
                        new UserChatMessage($"Extract keywords from: {text}")
                    });

                string content = completion?.Content?.FirstOrDefault()?.Text ?? "";
                var keywords = ExtractKeywords(content);

                var result = new AIAnalysisResult
                {
                    Success = true,
                    Keywords = keywords,
                    Tags = keywords.Take(8).ToList()
                };

                _cache.Set(cacheKey, result, CacheDuration);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AnalyzeTextAsync failed");
                return new AIAnalysisResult { Success = false, Error = ex.Message };
            }
        }

        public Task<AIAnalysisResult> AnalyzeLocationAsync(string location)
        {
            var normalized = (location ?? "").Trim().ToLowerInvariant();
            var cacheKey = $"loc:{normalized}";

            if (_cache.TryGetValue(cacheKey, out AIAnalysisResult cached))
                return Task.FromResult(cached);

            var result = new AIAnalysisResult
            {
                Success = true,
                AdditionalData = new Dictionary<string, object>
                {
                    { "normalized_address", normalized }
                }
            };

            _cache.Set(cacheKey, result, CacheDuration);
            return Task.FromResult(result);
        }

        public async Task<AIAnalysisResult> AnalyzeLostItemAsync(string? imageUrl, string desc, string location)
        {
            var list = new List<AIAnalysisResult>();

            if (!string.IsNullOrWhiteSpace(imageUrl))
                list.Add(await AnalyzeImageAsync(imageUrl));

            list.Add(await AnalyzeTextAsync(desc));
            list.Add(await AnalyzeLocationAsync(location));

            return Combine(list);
        }

        public Task<AIAnalysisResult> AnalyzeFoundItemAsync(string? img, string desc, string loc)
            => AnalyzeLostItemAsync(img, desc, loc);

        private AIAnalysisResult Combine(List<AIAnalysisResult> results)
        {
            return new AIAnalysisResult
            {
                Success = results.Any(x => x.Success),
                Keywords = results.SelectMany(x => x.Keywords ?? new()).Distinct().ToList(),
                Tags = results.SelectMany(x => x.Tags ?? new()).Distinct().Take(10).ToList(),
                Description = results.FirstOrDefault(x => !string.IsNullOrEmpty(x.Description))?.Description,
                AdditionalData = results
                    .Where(x => x.AdditionalData != null)
                    .SelectMany(x => x.AdditionalData!)
                    .ToDictionary(kvp => kvp.Key, kvp => kvp.Value),
                ImageFeatures = results.FirstOrDefault(x => !string.IsNullOrEmpty(x.ImageFeatures))?.ImageFeatures
            };
        }

        private List<string> ExtractKeywords(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return new();

            var stop = new HashSet<string>
            {
                "the","a","an","and","or","in","for","with","this","that","from","you","your","was","were","are"
            };

            return text.ToLower()
                .Split(new[] { ' ', ',', '.', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries)
                .Where(w => w.Length > 3 && !stop.Contains(w))
                .Distinct()
                .Take(25)
                .ToList();
        }
    }
}
