using System;
using Talaqi.Domain.Enums;

namespace Talaqi.Application.DTOs.Reports
{
    public class CreateUserReportDto
    {
        public Guid ReportedUserId { get; set; }
        public ReportReason Reason { get; set; }
        public string? Description { get; set; }
    }

    public class UserReportDto
    {
        public Guid Id { get; set; }
        public Guid ReporterId { get; set; }
        public Guid ReportedUserId { get; set; }
        public ReportReason Reason { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid? ReviewedById { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public string? AdminNote { get; set; }
        public int? ActionTaken { get; set; }
    }
}
