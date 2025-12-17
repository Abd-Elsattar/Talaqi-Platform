using System.Collections.Generic;

namespace Talaqi.Application.DTOs.Reviews
{
    public class UserReviewsSummaryDto
    {
        public decimal AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public List<ReviewDto> Reviews { get; set; } = new();
    }
}
