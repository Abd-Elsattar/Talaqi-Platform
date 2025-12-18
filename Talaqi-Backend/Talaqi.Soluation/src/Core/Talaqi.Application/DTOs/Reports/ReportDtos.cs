using System;
using Talaqi.Domain.Enums;

namespace Talaqi.Application.DTOs.Reports
{
    public class CreateReportDto
    {
        public ReportTargetType TargetType { get; set; }
        public Guid? TargetUserId { get; set; }
        public Guid? ConversationId { get; set; }
        public Guid? MessageId { get; set; }
        public ReportReason Reason { get; set; }
        public string? Description { get; set; }
    }

    public class ReportDto
    {
        public Guid Id { get; set; }
        public Guid ReporterId { get; set; }
        // We might not want to expose ReporterName to normal users, but for admins yes.
        public string ReporterName { get; set; } = string.Empty;
        
        public ReportTargetType TargetType { get; set; }
        
        public Guid? TargetUserId { get; set; }
        public string? TargetUserName { get; set; }
        
        public Guid? ConversationId { get; set; }
        public Guid? MessageId { get; set; }
        
        public ReportReason Reason { get; set; }
        public string? Description { get; set; }
        
        public ReportStatus Status { get; set; }
        public string? AdminNotes { get; set; }
        
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class UpdateReportStatusDto
    {
        public ReportStatus Status { get; set; }
        public string? AdminNotes { get; set; }
    }

    public class ReportFilterDto
    {
        public ReportStatus? Status { get; set; }
        public ReportReason? Reason { get; set; }
        public ReportTargetType? TargetType { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string? SearchTerm { get; set; } // For searching description or user names
        public Guid? ReporterId { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
