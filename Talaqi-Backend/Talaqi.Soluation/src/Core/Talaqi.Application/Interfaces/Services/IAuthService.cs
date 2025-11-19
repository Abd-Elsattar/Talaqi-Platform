using Talaqi.Application.Common;
using Talaqi.Application.DTOs.Auth;

namespace Talaqi.Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task<Result<AuthResponseDto>> RegisterAsync(RegisterDto dto);
        Task<Result<AuthResponseDto>> LoginAsync(LoginDto dto);
        Task<Result> SendEmailConfirmationCodeAsync(SendEmailConfirmationCodeDto dto);
        Task<Result> ConfirmEmailAsync(ConfirmEmailDto dto);
        Task<Result<AuthResponseDto>> RefreshTokenAsync(string refreshToken);
        Task<Result> ForgotPasswordAsync(ForgotPasswordDto dto);
        Task<Result> ResetPasswordAsync(ResetPasswordDto dto);
    }
}
