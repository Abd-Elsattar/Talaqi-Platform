using System.ComponentModel.DataAnnotations;

namespace Talaqi.Application.DTOs.Auth
{
    public class SendEmailConfirmationCodeDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; } = string.Empty;
    }
}
