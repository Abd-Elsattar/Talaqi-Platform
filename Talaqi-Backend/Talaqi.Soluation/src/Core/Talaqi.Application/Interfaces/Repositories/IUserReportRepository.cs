using Talaqi.Domain.Entities;

namespace Talaqi.Application.Interfaces.Repositories
{
    public interface IUserReportRepository : IBaseRepository<UserReport>
    {
        Task<IEnumerable<UserReport>> GetReportsForUserAsync(Guid reportedUserId, int page = 1, int pageSize = 50);
        Task<bool> HasRecentReportAsync(Guid reporterId, Guid reportedUserId, TimeSpan window);
    }
}
