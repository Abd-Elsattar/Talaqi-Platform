using Talaqi.Domain.Enums;

namespace Talaqi.Domain.Entities
{
    public class Match : BaseEntity
    {
        public Guid LostItemId { get; set; }
        public Guid FoundItemId { get; set; }
        public decimal ConfidenceScore { get; set; } 
        public MatchStatus Status { get; set; } = MatchStatus.Pending;
        public bool NotificationSent { get; set; }
        public DateTime? NotificationSentAt { get; set; }
        public string? MatchDetails { get; set; } 

        // Navigation Properties
        public virtual LostItem LostItem { get; set; } = null!;
        public virtual FoundItem FoundItem { get; set; } = null!;
    }
}