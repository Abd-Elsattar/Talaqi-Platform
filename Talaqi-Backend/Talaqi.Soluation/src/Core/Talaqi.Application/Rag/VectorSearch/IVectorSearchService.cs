namespace Talaqi.Application.Rag.VectorSearch
{
    public class VectorSearchRequest
    {
        public required float[] QueryEmbedding { get; set; }
        public int TopK { get; set; } = 5;
        public string? Category { get; set; }
        public string? City { get; set; }
        public string? Governorate { get; set; }
        public string? ItemType { get; set; } // Lost|Found or null
    }

    public class VectorSearchResultItem
    {
        public Guid ItemId { get; set; }
        public string ItemType { get; set; } = string.Empty;
        public float Score { get; set; }
        public string NormalizedText { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string? City { get; set; }
        public string? Governorate { get; set; }
    }

    public interface IVectorSearchService
    {
        Task<List<VectorSearchResultItem>> SearchAsync(VectorSearchRequest request, CancellationToken ct);
    }
}
