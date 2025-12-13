namespace Talaqi.Application.Rag.Assistant
{
    public class AskAssistantRequestDto
    {
        public string Question { get; set; } = string.Empty;
        public int TopK { get; set; } = 5;
        public string? Category { get; set; }
        public string? City { get; set; }
        public string? Governorate { get; set; }
        public string? ItemType { get; set; }
    }

    public class AssistantItemSnippetDto
    {
        public Guid ItemId { get; set; }
        public string ItemType { get; set; } = string.Empty;
        public string Snippet { get; set; } = string.Empty;
        public float Score { get; set; }
    }

    public class AskAssistantResponseDto
    {
        public string Answer { get; set; } = string.Empty;
        public List<AssistantItemSnippetDto> Snippets { get; set; } = new();
    }

    public interface IAssistantService
    {
        Task<AskAssistantResponseDto> AskAsync(AskAssistantRequestDto request, CancellationToken ct);
    }
}
