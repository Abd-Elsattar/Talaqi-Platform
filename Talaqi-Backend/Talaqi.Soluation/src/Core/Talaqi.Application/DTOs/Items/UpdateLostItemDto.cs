
namespace Talaqi.Application.DTOs.Items
{
    public class UpdateLostItemDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public LocationDto Location { get; set; } = new();
        public string ContactInfo { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
