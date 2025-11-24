public class AIAnalysisResult
{
    public bool Success { get; set; }
    public string? Error { get; set; }

    public List<string>? Keywords { get; set; }
    public string? ImageFeatures { get; set; }
    public Dictionary<string, object>? AdditionalData { get; set; }

    public List<string>? Tags { get; set; }
    public string? Description { get; set; }
}
