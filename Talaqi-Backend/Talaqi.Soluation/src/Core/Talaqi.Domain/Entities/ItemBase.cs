using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Domain.Enums;
using Talaqi.Domain.ValueObjects;

namespace Talaqi.Domain.Entities
{
    public abstract class ItemBase : BaseEntity
    {
        public Guid UserId { get; set; }
        public ItemCategory Category { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public Location Location { get; set; } = new();
        public string ContactInfo { get; set; } = string.Empty;
        public string? AIAnalysisData { get; set; }
        public ItemStatus Status { get; set; } = ItemStatus.Active;
    }
}
