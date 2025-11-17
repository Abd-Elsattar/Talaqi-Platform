
namespace Talaqi.Application.DTOs.Statistics
{
    public class ItemStatistics
    {
        public int TotalLost { get; set; }
        public int TotalFound { get; set; }
        public int ActiveLost { get; set; }
        public int ActiveFound { get; set; }
        public int ResolvedToday { get; set; }
        public Dictionary<string, int> ByCategory { get; set; } = new();
    }
}
