
namespace Talaqi.Application.DTOs.Statistics
{
    public class MatchStatistics
    {
        public int Total { get; set; }
        public int Pending { get; set; }
        public int Confirmed { get; set; }
        public int Resolved { get; set; }
        public decimal AverageConfidenceScore { get; set; }
        public int GeneratedToday { get; set; }
    }
}
