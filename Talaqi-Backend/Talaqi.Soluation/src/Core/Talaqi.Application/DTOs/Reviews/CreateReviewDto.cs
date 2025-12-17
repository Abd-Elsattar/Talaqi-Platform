using System;
using System.ComponentModel.DataAnnotations;

namespace Talaqi.Application.DTOs.Reviews
{
    public class CreateReviewDto
    {
        [Required]
        [Range(1,5)]
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
