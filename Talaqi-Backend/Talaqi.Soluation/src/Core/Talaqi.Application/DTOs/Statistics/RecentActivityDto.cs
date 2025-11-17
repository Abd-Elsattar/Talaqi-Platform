
namespace Talaqi.Application.DTOs.Statistics
{
    public class RecentActivityDto
    {
        public string Type { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string? UserName { get; set; }
        public string? ItemTitle { get; set; }
    }
}
