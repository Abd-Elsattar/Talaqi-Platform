using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Application.Common;
using Talaqi.Application.DTOs.Auth;

namespace Talaqi.Application.Interfaces.Services
{
    //The `IAuthService` interface is designed to define a set of authentication-related methods for a service in an application. Each method is asynchronous, returning a `Task` to indicate asynchronous execution, allowing for potentially non-blocking operations. The interface likely represents a pattern you might see in a .NET application utilizing asynchronous programming and a common result pattern using a `Result` wrapper to convey both the outcome and the potential data or error details.
    //Here's a breakdown of each method defined in the interface:
    //1. **RegisterAsync**: This method takes a `RegisterDto` object as a parameter and is intended for user registration. It returns a `Task<Result<AuthResponseDto>>`, suggesting that the registration process will return an asynchronous operation that wraps around both the success/error result and an `AuthResponseDto` which likely contains authentication details for the newly registered user.
    //2. **LoginAsync**: This method accepts a `LoginDto` which likely contains login credentials (like username and password) and returns a `Task<Result<AuthResponseDto>>`. This pattern indicates that after handling the login request, the application will return both the success/error status and an authentication response, probably including tokens or user session info.
    //3. **forgotPasswordAsync**: Taking a `ForgotPasswordDto` suggests this method is responsible for triggering a forgot password process, often including sending a reset link or token to the user's registered email. It returns a `Task<Result>`, which means it only reports on the success or failure of the operation without any additional data payload.
    //4. **ResetPasswordAsync**: This method requires a `ResetPasswordDto`, which might contain the token from the forgot password process and new password details. It returns a `Task<Result>`, indicating whether the password reset operation was successful or if there were errors.
    //5. **RefreshTokenAsync**: Designed to handle token refreshing—a common practice in maintaining user session security—it accepts a `string` which is the refresh token. This method returns a `Task<Result<AuthResponseDto>>`, suggesting that upon refreshing the token, new authentication details (likely with a new access token) will be returned alongside the operation result.
    //Overall, this interface outlines a contract for an authentication service to implement common authentication-related activities, abstracting the underlying logic and emphasizing asynchronous behaviors with error handling.
    public interface IAuthService
    {
        Task<Result<AuthResponseDto>> RegisterAsync(RegisterDto registerDto);
        Task<Result<AuthResponseDto>> LoginAsync(LoginDto loginDto);
        Task<Result> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto);
        Task<Result> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
        Task<Result<AuthResponseDto>> RefreshTokenAsync(string refreshToken);
    }
}
