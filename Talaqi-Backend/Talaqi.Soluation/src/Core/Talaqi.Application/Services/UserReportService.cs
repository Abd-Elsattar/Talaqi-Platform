using Microsoft.Extensions.Logging;
using Talaqi.Application.Common;
using Microsoft.EntityFrameworkCore;
using Talaqi.Application.DTOs.Reports;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Application.Interfaces.Services;
using Talaqi.Domain.Entities;
using Talaqi.Domain.Enums;

namespace Talaqi.Application.Services
{
    public class UserReportService : IUserReportService
    {
        private readonly IUnitOfWork _uow;
        private readonly ILogger<UserReportService> _logger;

        // throttle window for duplicate detection
        private static readonly TimeSpan DuplicateWindow = TimeSpan.FromHours(24);

        public UserReportService(IUnitOfWork uow, ILogger<UserReportService> logger)
        {
            _uow = uow;
            _logger = logger;
        }

        public async Task<Result> CreateReportAsync(CreateUserReportDto dto, Guid reporterId)
        {
            if (reporterId == dto.ReportedUserId)
                return Result.Failure("You cannot report yourself");

            var reported = await _uow.Users.GetByIdAsync(dto.ReportedUserId);
            if (reported == null || reported.IsDeleted)
                return Result.Failure("Reported user not found");

            // prevent frequent duplicate reports from same reporter
            var recent = await _uow.UserReports.HasRecentReportAsync(reporterId, dto.ReportedUserId, DuplicateWindow);
            if (recent)
                return Result.Failure("You have recently reported this user. Please wait before reporting again.");

            var report = new UserReport
            {
                ReporterId = reporterId,
                ReportedUserId = dto.ReportedUserId,
                Reason = dto.Reason,
                Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description?.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            await _uow.UserReports.AddAsync(report);
            await _uow.SaveChangesAsync();

            _logger.LogInformation("User report created: Reporter={ReporterId} Reported={ReportedUserId} Reason={Reason}", reporterId, dto.ReportedUserId, dto.Reason);

            return Result.Success("Report submitted successfully");
        }

        public async Task<Result<IEnumerable<UserReportDto>>> GetReportsForUserAsync(Guid reportedUserId, int page = 1, int pageSize = 50)
        {
            var reports = await _uow.UserReports.GetReportsForUserAsync(reportedUserId, page, pageSize);
            var dtos = reports.Select(r => new UserReportDto
            {
                Id = r.Id,
                ReporterId = r.ReporterId,
                ReportedUserId = r.ReportedUserId,
                Reason = r.Reason,
                Description = r.Description,
                CreatedAt = r.CreatedAt,
                ReviewedAt = r.ReviewedAt,
                ReviewedById = r.ReviewedById,
                AdminNote = r.AdminNote,
                ActionTaken = r.ActionTaken.HasValue ? (int?) (int)r.ActionTaken.Value : null
            });

            return Result<IEnumerable<UserReportDto>>.Success(dtos);
        }

        public async Task<Result<IEnumerable<UserReportDto>>> AdminListReportsAsync(int page = 1, int pageSize = 50, Guid? reportedUserId = null, Guid? reporterId = null, int? reason = null)
        {
            // Build queryable filters
            var query = _uow.UserReports.GetQueryable();

            if (reportedUserId.HasValue) query = query.Where(r => r.ReportedUserId == reportedUserId.Value);
            if (reporterId.HasValue) query = query.Where(r => r.ReporterId == reporterId.Value);
            if (reason.HasValue) query = query.Where(r => (int)r.Reason == reason.Value);

            var list = await query.OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = list.Select(r => new UserReportDto
            {
                Id = r.Id,
                ReporterId = r.ReporterId,
                ReportedUserId = r.ReportedUserId,
                Reason = r.Reason,
                Description = r.Description,
                CreatedAt = r.CreatedAt,
                ReviewedAt = r.ReviewedAt,
                ReviewedById = r.ReviewedById,
                AdminNote = r.AdminNote,
                ActionTaken = (int?)r.ActionTaken
            });

            return Result<IEnumerable<UserReportDto>>.Success(dtos);
        }
    }
}
