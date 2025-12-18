using System;

namespace Talaqi.Domain.Entities
{
    public class UserReport : BaseEntity
    {
        // Reporter who filed the report
        public Guid ReporterId { get; set; }

        // The user being reported
        public Guid ReportedUserId { get; set; }

        // Reason for reporting
        public Talaqi.Domain.Enums.ReportReason Reason { get; set; }

        // Optional description provided by reporter
        public string? Description { get; set; }

        // Audit fields
        // CreatedAt inherited from BaseEntity

        // Admin review metadata (nullable until reviewed)
        public Guid? ReviewedById { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public string? AdminNote { get; set; }
        public Talaqi.Domain.Enums.ReportAction? ActionTaken { get; set; }
    }
}
