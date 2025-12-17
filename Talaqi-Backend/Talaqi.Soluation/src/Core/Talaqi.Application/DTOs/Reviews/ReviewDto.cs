using System;

namespace Talaqi.Application.DTOs.Reviews
{
    public class ReviewDto
    {
        public string ReviewerName { get; set; } = string.Empty;
        public string? ReviewerPhotoUrl { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
