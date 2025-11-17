namespace Talaqi.Application.DTOs.Items
{
    public class CreateFoundItemDto
    {
        public string Category { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public LocationDto Location { get; set; } = new();
        public DateTime DateFound { get; set; }
        public string ContactInfo { get; set; } = string.Empty;
    }
}
