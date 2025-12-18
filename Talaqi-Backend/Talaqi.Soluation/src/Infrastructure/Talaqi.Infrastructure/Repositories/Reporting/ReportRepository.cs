using Microsoft.EntityFrameworkCore;
using Talaqi.Application.Interfaces.Repositories.Reporting;
using Talaqi.Domain.Entities.Reporting;
using Talaqi.Infrastructure.Data;

namespace Talaqi.Infrastructure.Repositories.Reporting
{
    public class ReportRepository : BaseRepository<Report>, IReportRepository
    {
        public ReportRepository(ApplicationDbContext context) : base(context)
        {
        }

        public new IQueryable<Report> GetQueryable()
        {
            return _context.Reports.AsQueryable();
        }
    }
}
