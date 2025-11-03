using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Application.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public UserDto User { get; set; } = new();
    }
}
//This C# code defines a class named `AuthResponseDto`, which appears to be a Data Transfer Object (DTO) used to encapsulate authentication response data in an application, possibly during a login or token refresh scenario. Here's a breakdown of the class and its properties:
//1. **`AccessToken` (string):** 
//   - This property is meant to store the access token, which is typically a short-lived token given to the client after successful authentication. The access token is used to authenticate subsequent requests without needing to provide credentials each time.
//2. **`RefreshToken` (string):** 
//   - This property holds the refresh token, which is used to obtain a new access token when the current one expires, without requiring the user to log in again. Refresh tokens usually have a longer lifespan than access tokens.
//3. **`ExpiresAt` (DateTime):** 
//   - This property is used to store the expiration date and time of the access token. It indicates when the current access token will become invalid and a new token will need to be obtained.
//4. **`User` (UserDto):**
//   - This property holds an instance of another DTO, `UserDto`, which likely contains information about the authenticated user, such as their ID, username, or roles. The `User` property is initialized with a new instance using the `= new();` syntax, which ensures that the `User` property is not null and that a default `UserDto` is available even if no specific user details are set.
//The design of this class suggests that it is meant to be serialized, perhaps to or from JSON, for communication between client and server in situations where user authentication details are being exchanged. DTOs like this help encapsulate and organize data for transport, improving code maintainability and readability while also providing a clear structure for necessary authentication information.