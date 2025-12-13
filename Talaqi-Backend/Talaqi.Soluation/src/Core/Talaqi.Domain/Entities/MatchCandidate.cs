using Talaqi.Domain.Enums;

namespace Talaqi.Domain.Entities
{
    public class MatchCandidate : BaseEntity
    {
        public Guid LostItemId { get; set; }
        public Guid FoundItemId { get; set; }
        public decimal ScoreText { get; set; }
        public decimal ScoreImage { get; set; }
        public decimal ScoreLocation { get; set; }
        public decimal ScoreDate { get; set; }
        public decimal AggregateScore { get; set; }
        public string? ReasonsJson { get; set; }
        public bool Promoted { get; set; }
        public DateTime? DeletedAt { get; set; }

        // Navigation
        public virtual LostItem LostItem { get; set; } = null!;
        public virtual FoundItem FoundItem { get; set; } = null!;
    }
}
