using Talaqi.Application.DTOs.AI;

namespace Talaqi.Application.Interfaces.Services
{
    public interface IAIService
    {
        Task<AIAnalysisResult> AnalyzeImageAsync(string imageUrl);
        Task<AIAnalysisResult> AnalyzeTextAsync(string description);
        Task<AIAnalysisResult> AnalyzeLocationAsync(string location);
        Task<AIAnalysisResult> AnalyzeLostItemAsync(string? imageUrl, string description, string location);
        Task<AIAnalysisResult> AnalyzeFoundItemAsync(string? imageUrl, string description, string location);
    }
}
