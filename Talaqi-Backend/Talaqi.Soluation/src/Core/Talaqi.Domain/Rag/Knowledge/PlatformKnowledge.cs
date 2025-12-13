using System.ComponentModel.DataAnnotations;
using Talaqi.Domain.Entities;

namespace Talaqi.Domain.Rag.Knowledge
{
    public class PlatformKnowledge : BaseEntity
    {
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(4000)]
        public string Content { get; set; } = string.Empty; // Arabic content

        [MaxLength(100)]
        public string Category { get; set; } = string.Empty; // About, HowTo, FAQ
    }
}
