using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Talaqi.Application.DTOs.Reports;
using Talaqi.Domain.Common;

namespace Talaqi.Application.Interfaces.Services
{
    public interface IReportService
    {
        Task<Result<Guid>> CreateReportAsync(Guid reporterId, CreateReportDto dto);
        Task<Result<IEnumerable<ReportDto>>> GetReportsAsync(ReportFilterDto filter);
        Task<Result<ReportDto>> GetReportAsync(Guid reportId);
        Task<Result> UpdateReportStatusAsync(Guid reportId, Guid adminId, UpdateReportStatusDto dto);
    }
}
