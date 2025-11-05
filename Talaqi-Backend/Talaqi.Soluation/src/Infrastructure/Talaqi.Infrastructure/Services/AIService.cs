using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;
using System.Text.Json;
using Talaqi.Application.DTOs.AI;
using Talaqi.Application.Interfaces.Services;

public class AIService : IAIService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    private readonly string _openAiKey;
    private readonly string _googleApiKey;

    public AIService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _config = config;
        _openAiKey = _config["AI:OpenAI:ApiKey"] ?? throw new Exception("Missing OpenAI API Key");
        _googleApiKey = _config["AI:Google:ApiKey"] ?? throw new Exception("Missing Google API Key");
    }

    // ---------- Analyze Image ----------
    public async Task<AIAnalysisResult> AnalyzeImageAsync(string imageUrl)
    {
        try
        {
            var endpoint = "https://api.openai.com/v1/responses";
            var payload = new
            {
                model = "gpt-4o-mini",
                input = new object[]
                {
                    new
                    {
                        role = "user",
                        content = new object[]
                        {
                            new { type = "input_text", text = "Analyze this image. Describe it and list any visible objects or text." },
                            new { type = "input_image", image_url = imageUrl }
                        }
                    }
                }
            };

            using var request = new HttpRequestMessage(HttpMethod.Post, endpoint);
            request.Headers.Add("Authorization", $"Bearer {_openAiKey}");
            request.Content = JsonContent.Create(payload);

            var response = await _httpClient.SendAsync(request);
            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return new AIAnalysisResult { Success = false, Error = json };

            var doc = JsonDocument.Parse(json);
            var content = doc.RootElement
                .GetProperty("output")[0]
                .GetProperty("content")[0]
                .GetProperty("text")
                .GetString();

            return new AIAnalysisResult
            {
                Success = true,
                ImageFeatures = content,
                AdditionalData = new Dictionary<string, object> { ["imageUrl"] = imageUrl }
            };
        }
        catch (Exception ex)
        {
            return new AIAnalysisResult { Success = false, Error = ex.Message };
        }
    }

    // ---------- Analyze Text ----------
    public async Task<AIAnalysisResult> AnalyzeTextAsync(string description)
    {
        try
        {
            var endpoint = "https://api.openai.com/v1/chat/completions";
            var payload = new
            {
                model = "gpt-4o-mini",
                messages = new[]
                {
                    new { role = "system", content = "Analyze the following text. Extract key details, main keywords, and summarize meaning." },
                    new { role = "user", content = description }
                }
            };

            using var request = new HttpRequestMessage(HttpMethod.Post, endpoint);
            request.Headers.Add("Authorization", $"Bearer {_openAiKey}");
            request.Content = JsonContent.Create(payload);

            var response = await _httpClient.SendAsync(request);
            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return new AIAnalysisResult { Success = false, Error = json };

            var doc = JsonDocument.Parse(json);
            var text = doc.RootElement.GetProperty("choices")[0]
                .GetProperty("message").GetProperty("content").GetString();

            var keywords = ExtractKeywords(text);

            return new AIAnalysisResult
            {
                Success = true,
                Keywords = keywords,
                AdditionalData = new Dictionary<string, object>
                {
                    ["textSummary"] = text
                }
            };
        }
        catch (Exception ex)
        {
            return new AIAnalysisResult { Success = false, Error = ex.Message };
        }
    }

    // ---------- Analyze Location ----------
    public async Task<AIAnalysisResult> AnalyzeLocationAsync(string location)
    {
        try
        {
            var endpoint = $"https://maps.googleapis.com/maps/api/geocode/json?address={Uri.EscapeDataString(location)}&key={_googleApiKey}";
            var response = await _httpClient.GetAsync(endpoint);
            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return new AIAnalysisResult { Success = false, Error = json };

            var doc = JsonDocument.Parse(json);
            var result = doc.RootElement.GetProperty("results")[0];
            var formatted = result.GetProperty("formatted_address").GetString();
            var loc = result.GetProperty("geometry").GetProperty("location");
            var lat = loc.GetProperty("lat").GetDouble();
            var lng = loc.GetProperty("lng").GetDouble();

            return new AIAnalysisResult
            {
                Success = true,
                AdditionalData = new Dictionary<string, object>
                {
                    ["formattedAddress"] = formatted!,
                    ["latitude"] = lat,
                    ["longitude"] = lng
                }
            };
        }
        catch (Exception ex)
        {
            return new AIAnalysisResult { Success = false, Error = ex.Message };
        }
    }

    // ---------- Analyze Lost Item ----------
    public async Task<AIAnalysisResult> AnalyzeLostItemAsync(string? imageUrl, string description, string location)
    {
        var imageTask = imageUrl != null ? AnalyzeImageAsync(imageUrl) : Task.FromResult<AIAnalysisResult?>(null);
        var textTask = AnalyzeTextAsync(description);
        var locTask = AnalyzeLocationAsync(location);

        await Task.WhenAll(imageTask!, textTask, locTask);

        var img = imageTask?.Result;
        var txt = textTask.Result;
        var loc = locTask.Result;

        if ((img == null || img.Success) && txt.Success && loc.Success)
        {
            var result = new AIAnalysisResult
            {
                Success = true,
                ImageFeatures = img?.ImageFeatures,
                Keywords = txt.Keywords,
                AdditionalData = new Dictionary<string, object>
                {
                    ["imageAnalysis"] = img?.AdditionalData,
                    ["textAnalysis"] = txt.AdditionalData,
                    ["locationAnalysis"] = loc.AdditionalData,
                    ["type"] = "Lost"
                }
            };
            return result;
        }

        return new AIAnalysisResult
        {
            Success = false,
            Error = img?.Error ?? txt.Error ?? loc.Error
        };
    }

    // ---------- Analyze Found Item ----------
    public async Task<AIAnalysisResult> AnalyzeFoundItemAsync(string? imageUrl, string description, string location)
    {
        var baseResult = await AnalyzeLostItemAsync(imageUrl, description, location);
        if (baseResult.Success)
            baseResult.AdditionalData["type"] = "Found";
        return baseResult;
    }

    // ---------- Helper ----------
    private List<string> ExtractKeywords(string text)
    {
        return text.Split(new[] { ',', '.', '-', '\n' }, StringSplitOptions.RemoveEmptyEntries)
                   .Where(w => w.Length > 2)
                   .Select(w => w.Trim().ToLowerInvariant())
                   .Distinct()
                   .Take(10)
                   .ToList();
    }
}
