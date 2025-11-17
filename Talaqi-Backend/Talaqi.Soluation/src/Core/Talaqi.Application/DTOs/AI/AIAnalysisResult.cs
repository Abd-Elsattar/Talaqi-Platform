namespace Talaqi.Application.DTOs.AI
{
    public class AIAnalysisResult
    {
        public bool Success { get; set; }
        public string? ImageFeatures { get; set; }
        public List<string> Keywords { get; set; } = new();
        public Dictionary<string, object> AdditionalData { get; set; } = new();
        public string? Error { get; set; }
    }
}
