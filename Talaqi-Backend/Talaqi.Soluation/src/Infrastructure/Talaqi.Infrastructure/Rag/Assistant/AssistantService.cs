using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Talaqi.Application.Rag.Assistant;
using Talaqi.Application.Rag.Embeddings;
using Talaqi.Application.Rag.VectorSearch;
using Talaqi.Infrastructure.Rag.Common;

namespace Talaqi.Infrastructure.Rag.Assistant
{
    public class AssistantService : IAssistantService
    {
        private readonly IEmbeddingService _embeddings;
        private readonly IVectorSearchService _search;
        private readonly HttpClient _http;
        private readonly string _model;

        private const string NoData =
            "لا توجد بيانات كافية في النظام للإجابة على هذا السؤال.";

        public AssistantService(IConfiguration config,
            IEmbeddingService embeddings,
            IVectorSearchService search)
        {
            _embeddings = embeddings;
            _search = search;

            var apiKey = config["OpenAI:ApiKey"]
                ?? throw new InvalidOperationException("Missing OpenAI API Key");

            _model = config["OpenAI:ChatModel"] ?? "gpt-4o-mini";

            _http = new HttpClient();
            _http.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", apiKey);
        }

        public async Task<AskAssistantResponseDto> AskAsync(
            AskAssistantRequestDto request,
            CancellationToken ct)
        {
            var queryVector = await _embeddings.GenerateEmbeddingAsync(request.Question);

            var results = await _search.SearchAsync(new VectorSearchRequest
            {
                QueryEmbedding = queryVector,
                TopK = request.TopK,
                Category = request.Category,
                City = request.City,
                Governorate = request.Governorate,
                ItemType = request.ItemType
            }, ct);

            var snippets = results
                .Select(r => r.NormalizedText)
                .Where(s => !string.IsNullOrWhiteSpace(s))
                .ToList();

            if (!snippets.Any())
            {
                return new AskAssistantResponseDto
                {
                    Answer = NoData,
                    Snippets = new()
                };
            }

            var systemPrompt =
                PromptBuilder.BuildRagSystemPrompt(request.Question, snippets);

            var payload = new
            {
                model = _model,
                temperature = 0.2,
                messages = new[]
                {
                    new { role = "system", content = systemPrompt },
                    new { role = "user", content = request.Question }
                }
            };

            var json = JsonSerializer.Serialize(payload,
                new JsonSerializerOptions
                {
                    Encoder = System.Text.Encodings.Web
                        .JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                });

            using var content =
                new StringContent(json, Encoding.UTF8, "application/json");

            using var response =
                await _http.PostAsync(
                    "https://api.openai.com/v1/chat/completions",
                    content,
                    ct);

            response.EnsureSuccessStatusCode();

            var bytes = await response.Content.ReadAsByteArrayAsync(ct);
            var responseJson = Encoding.UTF8.GetString(bytes);

            using var doc = JsonDocument.Parse(responseJson);

            var answer =
                doc.RootElement
                   .GetProperty("choices")[0]
                   .GetProperty("message")
                   .GetProperty("content")
                   .GetString()
                   ?.Trim();

            if (string.IsNullOrWhiteSpace(answer))
                answer = NoData;

            return new AskAssistantResponseDto
            {
                Answer = answer,
                Snippets = results.Select(r => new AssistantItemSnippetDto
                {
                    ItemId = r.ItemId,
                    ItemType = r.ItemType,
                    Snippet = r.NormalizedText,
                    Score = r.Score
                }).ToList()
            };
        }
    }
}
