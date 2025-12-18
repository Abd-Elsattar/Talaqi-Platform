using System;
using Talaqi.Domain.Enums;

namespace Talaqi.Domain.Entities.Reporting
{
    public class Report : BaseEntity
    {
        public Guid ReporterId { get; set; }
        public virtual User Reporter { get; set; } = null!;

        public ReportTargetType TargetType { get; set; }

        // Context References
        public Guid? TargetUserId { get; set; }
        public virtual User? TargetUser { get; set; }

        public Guid? ConversationId { get; set; }
        public virtual Talaqi.Domain.Entities.Messaging.Conversation? Conversation { get; set; }

        public Guid? MessageId { get; set; }
        public virtual Talaqi.Domain.Entities.Messaging.Message? Message { get; set; }

        public ReportReason Reason { get; set; }
        public string? Description { get; set; }

        public ReportStatus Status { get; set; } = ReportStatus.Pending;

        // Admin Actions
        public string? AdminNotes { get; set; }
        public Guid? ResolvedById { get; set; }
        public virtual User? ResolvedBy { get; set; }
        public DateTime? ResolvedAt { get; set; }
    }
}
