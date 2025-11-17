namespace Talaqi.Application.DTOs.Items
{
    public class MatchDto
    {
        public Guid Id { get; set; }
        public Guid LostItemId { get; set; }
        public Guid FoundItemId { get; set; }
        public decimal ConfidenceScore { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public LostItemDto? LostItem { get; set; }
        public FoundItemDto? FoundItem { get; set; }
    }

}
