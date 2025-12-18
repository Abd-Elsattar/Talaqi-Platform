using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Talaqi.Application.DTOs.Reports;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Application.Interfaces.Services;
using Talaqi.Domain.Entities.Reporting;
using Talaqi.Domain.Enums;

namespace Talaqi.Application.Services
{
    public class ReportService : IReportService
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public ReportService(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<Talaqi.Domain.Common.Result<Guid>> CreateReportAsync(Guid reporterId, CreateReportDto dto)
        {
            // Rate limiting: Check if user submitted > 3 reports in last 10 minutes
            var tenMinutesAgo = DateTime.UtcNow.AddMinutes(-10);
            var recentReportsCount = await _uow.Reports.GetQueryable()
                .CountAsync(r => r.ReporterId == reporterId && r.CreatedAt >= tenMinutesAgo);

            if (recentReportsCount >= 3)
            {
                return Talaqi.Domain.Common.Result<Guid>.Failure("You have exceeded the limit of 3 reports per 10 minutes. Please try again later.");
            }

            var report = new Report
            {
                ReporterId = reporterId,
                TargetType = dto.TargetType,
                TargetUserId = dto.TargetUserId,
                ConversationId = dto.ConversationId,
                MessageId = dto.MessageId,
                Reason = dto.Reason,
                Description = dto.Description,
                Status = ReportStatus.Pending
            };

            await _uow.Reports.AddAsync(report);
            await _uow.SaveChangesAsync();

            return Talaqi.Domain.Common.Result<Guid>.Success(report.Id);
        }

        public async Task<Talaqi.Domain.Common.Result<IEnumerable<ReportDto>>> GetReportsAsync(ReportFilterDto filter)
        {
            var query = _uow.Reports.GetQueryable()
                .Include(r => r.Reporter)
                .Include(r => r.TargetUser)
                .AsQueryable(); // Cast back to IQueryable to allow further composition without type issues

            if (filter.Status.HasValue)
            {
                query = query.Where(r => r.Status == filter.Status.Value);
            }

            if (filter.TargetType.HasValue)
            {
                query = query.Where(r => r.TargetType == filter.TargetType.Value);
            }

            if (filter.FromDate.HasValue)
            {
                query = query.Where(r => r.CreatedAt >= filter.FromDate.Value);
            }

            if (filter.ToDate.HasValue)
            {
                query = query.Where(r => r.CreatedAt <= filter.ToDate.Value);
            }

            if (filter.ReporterId.HasValue)
            {
                query = query.Where(r => r.ReporterId == filter.ReporterId.Value);
            }

            // Order by most recent
            query = query.OrderByDescending(r => r.CreatedAt);

            // Apply pagination
            var reports = await query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var reportDtos = reports.Select(r => new ReportDto
            {
                Id = r.Id,
                ReporterId = r.ReporterId,
                ReporterName = r.Reporter != null ? r.Reporter.FullName : "Unknown",
                TargetType = r.TargetType,
                TargetUserId = r.TargetUserId,
                TargetUserName = r.TargetUser != null ? r.TargetUser.FullName : "Unknown",
                ConversationId = r.ConversationId,
                MessageId = r.MessageId,
                Reason = r.Reason,
                Description = r.Description,
                Status = r.Status,
                AdminNotes = r.AdminNotes,
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt
            });

            return Talaqi.Domain.Common.Result<IEnumerable<ReportDto>>.Success(reportDtos);
        }

        public async Task<Talaqi.Domain.Common.Result<ReportDto>> GetReportAsync(Guid reportId)
        {
            var report = await _uow.Reports.GetByIdAsync(reportId);
            if (report == null)
            {
                return Talaqi.Domain.Common.Result<ReportDto>.Failure("Report not found");
            }

            var dto = new ReportDto
            {
                Id = report.Id,
                ReporterId = report.ReporterId,
                TargetType = report.TargetType,
                TargetUserId = report.TargetUserId,
                ConversationId = report.ConversationId,
                MessageId = report.MessageId,
                Reason = report.Reason,
                Description = report.Description,
                Status = report.Status,
                AdminNotes = report.AdminNotes,
                CreatedAt = report.CreatedAt,
                UpdatedAt = report.UpdatedAt
            };

            return Talaqi.Domain.Common.Result<ReportDto>.Success(dto);
        }

        public async Task<Talaqi.Domain.Common.Result> UpdateReportStatusAsync(Guid reportId, Guid adminId, UpdateReportStatusDto dto)
        {
            var report = await _uow.Reports.GetByIdAsync(reportId);
            if (report == null)
            {
                return Talaqi.Domain.Common.Result.Failure("Report not found");
            }

            report.Status = dto.Status;
            report.AdminNotes = dto.AdminNotes;
            
            if (dto.Status == ReportStatus.Resolved || dto.Status == ReportStatus.Rejected)
            {
                report.ResolvedAt = DateTime.UtcNow;
                report.ResolvedById = adminId;
            }

            await _uow.Reports.UpdateAsync(report);
            await _uow.SaveChangesAsync();

            return Talaqi.Domain.Common.Result.Success();
        }
    }
}
