
namespace Talaqi.Application.DTOs.Statistics
{
    public class DashboardStatisticsDto
    {
        public UserStatistics Users { get; set; } = new();
        public ItemStatistics Items { get; set; } = new();
        public MatchStatistics Matches { get; set; } = new();
        public List<RecentActivityDto> RecentActivities { get; set; } = new();
    }
}
