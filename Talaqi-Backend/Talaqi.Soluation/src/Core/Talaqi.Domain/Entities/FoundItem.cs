using Talaqi.Domain.Enums;
using Talaqi.Domain.ValueObjects;

namespace Talaqi.Domain.Entities
{
    public class FoundItem : ItemBase
    {
        public DateTime DateFound { get; set; }
        public DateTime? DeletedAt { get; set; }

        // Navigation Properties
        public virtual User User { get; set; } = null!;
        public virtual ICollection<Match> Matches { get; set; } = new List<Match>();
    }

}