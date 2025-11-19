using System.ComponentModel.DataAnnotations;

namespace Talaqi.Application.DTOs.Auth
{
    public class ConfirmEmailDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Verification code is required")]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "Verification code must be 6 characters")]
        public string Code { get; set; } = string.Empty;
    }
}
