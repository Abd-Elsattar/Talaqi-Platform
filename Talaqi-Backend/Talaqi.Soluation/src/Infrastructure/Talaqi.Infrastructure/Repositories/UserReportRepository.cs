using Microsoft.EntityFrameworkCore;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Domain.Entities;
using Talaqi.Infrastructure.Data;

namespace Talaqi.Infrastructure.Repositories
{
    public class UserReportRepository : BaseRepository<UserReport>, IUserReportRepository
    {
        public UserReportRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<UserReport>> GetReportsForUserAsync(Guid reportedUserId, int page = 1, int pageSize = 50)
        {
            return await _dbSet
                .Where(r => r.ReportedUserId == reportedUserId)
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<bool> HasRecentReportAsync(Guid reporterId, Guid reportedUserId, TimeSpan window)
        {
            var since = DateTime.UtcNow - window;
            return await _dbSet.AnyAsync(r => r.ReporterId == reporterId && r.ReportedUserId == reportedUserId && r.CreatedAt >= since);
        }
    }
}
