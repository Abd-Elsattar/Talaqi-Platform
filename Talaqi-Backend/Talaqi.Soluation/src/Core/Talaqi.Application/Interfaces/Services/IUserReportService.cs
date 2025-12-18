using Talaqi.Application.Common;
using Talaqi.Application.DTOs.Reports;

namespace Talaqi.Application.Interfaces.Services
{
    public interface IUserReportService
    {
        Task<Result> CreateReportAsync(CreateUserReportDto dto, Guid reporterId);
        Task<Result<IEnumerable<UserReportDto>>> GetReportsForUserAsync(Guid reportedUserId, int page = 1, int pageSize = 50);
        Task<Result<IEnumerable<UserReportDto>>> AdminListReportsAsync(int page = 1, int pageSize = 50, Guid? reportedUserId = null, Guid? reporterId = null, int? reason = null);
    }
}
