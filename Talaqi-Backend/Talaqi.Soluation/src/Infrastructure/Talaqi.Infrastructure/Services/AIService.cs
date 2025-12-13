using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OpenAI.Chat;
using OpenAI.Embeddings;
using Talaqi.Application.Interfaces.Services;

namespace Talaqi.Infrastructure.Services
{
    public class AIService : IAIService
    {
        private readonly ChatClient _chat;
        private readonly EmbeddingClient _embeddings;
        private readonly ILogger<AIService> _logger;
        private readonly IMemoryCache _cache;

        private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(6);

        public AIService(IConfiguration config, ILogger<AIService> logger, IMemoryCache cache)
        {
            _logger = logger;
            _cache = cache;

            var apiKey = config["OpenAI:ApiKey"]
                ?? throw new InvalidOperationException("Missing OpenAI API Key");

            _chat = new ChatClient(
                model: config["OpenAI:VisionModel"] ?? "gpt-4o-mini",
                apiKey: apiKey
            );

            _embeddings = new EmbeddingClient(
                model: "text-embedding-3-small",
                apiKey: apiKey
            );
        }

        // =====================================================
        // IMAGE ANALYSIS (VISION)
        // =====================================================
        public async Task<AIAnalysisResult> AnalyzeImageAsync(string imageUrl)
        {
            if (_cache.TryGetValue($"img:{imageUrl}", out AIAnalysisResult cached))
                return cached;

            try
            {
                byte[] imageBytes;
                using (var http = new HttpClient())
                    imageBytes = await http.GetByteArrayAsync(imageUrl);

                ChatCompletion completion = await _chat.CompleteChatAsync(
                    new List<ChatMessage>
                    {
                        ChatMessage.CreateUserMessage(new ChatMessageContentPart[]
                        {
                            ChatMessageContentPart.CreateTextPart(
                                "Describe the item clearly: type, color, material, shape, and any distinctive features. Be concise."
                            ),
                            ChatMessageContentPart.CreateImagePart(
                                new BinaryData(imageBytes), "image/jpeg")
                        })
                    });

                var desc = completion?.Content?.FirstOrDefault()?.Text ?? "";

                var keywords = ExtractKeywords(desc);
                var embedding = await CreateEmbeddingAsync(desc);
                var imageEmbedding = await this.GetImageEmbeddingAsync(imageUrl);

                var result = new AIAnalysisResult
                {
                    Success = true,
                    Description = desc,
                    Keywords = keywords,
                    Tags = keywords.Take(10).ToList(),
                    AdditionalData = new Dictionary<string, object>
                    {
                        ["embedding"] = embedding,
                        ["image_embedding"] = imageEmbedding ?? Array.Empty<double>()
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

        // =====================================================
        // TEXT ANALYSIS + EMBEDDING
        // =====================================================
        public async Task<AIAnalysisResult> AnalyzeTextAsync(string text)
        {
            var key = $"txt:{text.GetHashCode()}";
            if (_cache.TryGetValue(key, out AIAnalysisResult cached))
                return cached;

            try
            {
                var keywords = ExtractKeywords(text);
                var embedding = await CreateEmbeddingAsync(text);

                var result = new AIAnalysisResult
                {
                    Success = true,
                    Keywords = keywords,
                    Tags = keywords.Take(10).ToList(),
                    AdditionalData = new Dictionary<string, object>
                    {
                        ["embedding"] = embedding
                    }
                };

                _cache.Set(key, result, CacheDuration);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AnalyzeTextAsync failed");
                return new AIAnalysisResult { Success = false, Error = ex.Message };
            }
        }

        // =====================================================
        // LOCATION NORMALIZATION
        // =====================================================
        public Task<AIAnalysisResult> AnalyzeLocationAsync(string location)
        {
            var normalized = (location ?? "").Trim().ToLowerInvariant();
            var key = $"loc:{normalized}";

            if (_cache.TryGetValue(key, out AIAnalysisResult cached))
                return Task.FromResult(cached);

            var result = new AIAnalysisResult
            {
                Success = true,
                AdditionalData = new Dictionary<string, object>
                {
                    ["normalized_address"] = normalized
                }
            };

            _cache.Set(key, result, CacheDuration);
            return Task.FromResult(result);
        }

        // =====================================================
        // LOST / FOUND PIPELINE
        // =====================================================
        public async Task<AIAnalysisResult> AnalyzeLostItemAsync(string? img, string desc, string loc)
        {
            var list = new List<AIAnalysisResult>();

            if (!string.IsNullOrWhiteSpace(img))
                list.Add(await AnalyzeImageAsync(img));

            list.Add(await AnalyzeTextAsync(desc));
            list.Add(await AnalyzeLocationAsync(loc));

            return Combine(list);
        }

        public Task<AIAnalysisResult> AnalyzeFoundItemAsync(string? img, string desc, string loc)
            => AnalyzeLostItemAsync(img, desc, loc);

        public async Task<double[]?> GetImageEmbeddingAsync(string imageUrl)
        {
            try
            {
                byte[] imageBytes;
                using (var http = new HttpClient())
                    imageBytes = await http.GetByteArrayAsync(imageUrl);

                ChatCompletion completion = await _chat.CompleteChatAsync(
                    new List<ChatMessage>
                    {
                        ChatMessage.CreateUserMessage(new ChatMessageContentPart[]
                        {
                            ChatMessageContentPart.CreateTextPart(
                                "Summarize the visible features for embedding purposes."),
                            ChatMessageContentPart.CreateImagePart(new BinaryData(imageBytes), "image/jpeg")
                        })
                    });

                var summary = completion?.Content?.FirstOrDefault()?.Text ?? string.Empty;
                var embedding = await CreateEmbeddingAsync(summary);
                return embedding;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "GetImageEmbeddingAsync failed for {ImageUrl}", imageUrl);
                return null;
            }
        }

        // =====================================================
        // INTERNAL HELPERS
        // =====================================================
        private async Task<double[]> CreateEmbeddingAsync(string text)
        {
            var response = await _embeddings.GenerateEmbeddingAsync(text);
            // Use ToFloats() to get the embedding vector as a ReadOnlyMemory<float>
            return response.Value.ToFloats()
                .ToArray()
                .Select(f => (double)f)
                .ToArray();
        }

        private AIAnalysisResult Combine(List<AIAnalysisResult> list)
        {
            return new AIAnalysisResult
            {
                Success = list.Any(x => x.Success),
                Description = list.FirstOrDefault(x => !string.IsNullOrWhiteSpace(x.Description))?.Description,
                Keywords = list.SelectMany(x => x.Keywords ?? new()).Distinct().ToList(),
                Tags = list.SelectMany(x => x.Tags ?? new()).Distinct().Take(10).ToList(),

                AdditionalData = list
                    .Where(x => x.AdditionalData != null)
                    .SelectMany(x => x.AdditionalData!)
                    .GroupBy(x => x.Key)
                    .ToDictionary(x => x.Key, x => x.First().Value)
            };
        }

        private List<string> ExtractKeywords(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return new();

            var stopWords = new HashSet<string>
            {
                "the","a","an","and","or","in","for","with","this","that","from",
                "cannot","access","view","image","images","directly"
            };

            return text.ToLowerInvariant()
                .Split(new[] { ' ', ',', '.', '\n', '\r' },
                       StringSplitOptions.RemoveEmptyEntries)
                .Where(w => w.Length > 3 && !stopWords.Contains(w))
                .Distinct()
                .Take(25)
                .ToList();
        }
    }
}