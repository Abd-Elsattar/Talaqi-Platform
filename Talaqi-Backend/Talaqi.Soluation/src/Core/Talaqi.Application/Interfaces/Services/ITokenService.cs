using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Domain.Entities;

namespace Talaqi.Application.Interfaces.Services
{
    //The `ITokenService` interface defines a contract for a service that is responsible for generating various types of tokens that are used for authentication and verification purposes in a software application. Here is a breakdown of each method in the interface:
    //1. **GenerateAccessToken(User user)**:
    //   - This method is intended to create an access token for a given user. An access token is often a string that includes claims about the user's identity and permissions and is used to allow the user to access certain resources or services without having to repeatedly authenticate themselves.
    //   - Typically, an access token has a limited lifespan and can be included in the headers of HTTP requests to provide proof of authentication and authorization.
    //2. **GenerateRefreshToken()**:
    //   - This method generates a refresh token, which is used to obtain a new access token when the current access token expires. This helps maintain a session without requiring the user to log in again.
    //   - Refresh tokens generally have a longer expiration time and are stored securely, often as HTTP-only cookies or in secure storage on the client side.
    //3. **GenerateVerificationCode()**:
    //   - This method produces a verification code, which can be used for multi-factor authentication (MFA) or to verify user actions like email confirmation or password resets.
    //   - Verification codes are usually short-lived and are often sent to the user through a different communication channel (e.g., email or SMS) to provide an extra layer of security.
    //Overall, the `ITokenService` interface is a crucial component of any system that requires secure authentication and authorization by generating and managing tokens and codes that support various security features and use cases.
    public interface ITokenService
    {
        string GenerateAccessToken(User user);
        string GenerateRefreshToken();
        string GenerateVerificationCode();
    }
}
