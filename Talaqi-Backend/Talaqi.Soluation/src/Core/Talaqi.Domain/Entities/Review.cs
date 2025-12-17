using System;

namespace Talaqi.Domain.Entities
{
    public class Review : BaseEntity
    {
        public Guid ReviewerId { get; set; }
        public User Reviewer { get; set; } = null!;

        public Guid ReviewedUserId { get; set; }
        public User ReviewedUser { get; set; } = null!;

        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
