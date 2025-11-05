using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Talaqi.Application.Interfaces.Services;
using Talaqi.Domain.Entities;

namespace Talaqi.Infrastructure.Services
{
    public class TokenService : ITokenService
    {
        // Private field to hold the configuration settings
        private readonly IConfiguration _configuration;

        // Constructor to inject the configuration settings
        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Method to generate an access token for a given user
        public string GenerateAccessToken(User user)
        {
            // Retrieve the secret key from the configuration settings
            var secretKey = _configuration["JwtSetting:Secret"]
                ?? throw new InvalidOperationException("JWT Secret not configured");

            // Create a symmetric security key using the secret key
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            // Create signing credentials using the key and HMAC SHA256 algorithm
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Define the claims for the JWT token
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // Create a new JWT token with issuer, audience, claims, expiration, and signing credentials
            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["JwtSettings:ExpirationInMinutes"] ?? "60")),
                signingCredentials: credentials
            );

            // Return the serialized JWT token as a string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Method to generate a refresh token
        public string GenerateRefreshToken()
        {
            // Create an array of 32 bytes to hold the random number
            var randomNumber = new byte[32];

            // Use a secure random number generator to fill the array with random bytes
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);

            // Convert the random bytes to a Base64 string and return it
            return Convert.ToBase64String(randomNumber);
        }

        // Method to generate a verification code
        public string GenerateVerificationCode()
        {
            // Create an instance of Random to generate random numbers
            var random = new Random();

            // Generate a random number between 100000 and 999999 and return it as a string
            return random.Next(100000, 999999).ToString();
        }
    }
}
//This C# class, `TokenService`, is part of the `Talaqi.Infrastructure.Services` namespace and implements the `ITokenService` interface. It provides functionalities for generating JSON Web Tokens (JWTs), refresh tokens, and verification codes. Here’s how each part of the code works:
//### Key Features:
//1. **Dependency Injection:**
//   - The class uses dependency injection to get an instance of `IConfiguration`, which holds configuration settings such as JWT secret, issuer, audience, and token expiration times. This helps in managing configurations outside the code, typically set in appsettings.json.
//2. **JWT Access Token Generation:**
//   - **Secret Key:** Retrieved from configuration settings (`_configuration["JwtSetting:Secret"]`). It is used to sign the token to ensure its authenticity and integrity.
//   - **Symmetric Security Key:** Created using the secret key, which is a byte array encoded in UTF-8.
//   - **Signing Credentials:** Uses HMAC SHA256 algorithm, which is a secure hashing algorithm, to create a signing credential for the JWT.
//   - **Claims:** Critical information included in the token, such as user ID, email, role, and a unique identifier (`Jti`).
//   - **Token Creation:** The JWT is composed with issuer, audience, expiration, claims, and signing credentials, customized based on application needs.
//   - **Expiration:** Determined by `JwtSettings:ExpirationInMinutes` from the configuration. Default is set to 60 minutes if not found.
//3. **Refresh Token Generation:**
//   - Uses `RandomNumberGenerator` to generate a 32-byte secure random number, crucial for security and avoiding predictable sequences.
//   - Returns the refresh token as a Base64 string.
//4. **Verification Code Generation:**
//   - Utilizes the `Random` class to generate a 6-digit number, representing the verification code.
//   - Typically used for secondary verification methods like email or SMS codes.
//### Importance:
//- **Security:** The secure generation of tokens and encoding using a secret key ensures the tokens can't be easily spoofed or altered, providing reliable user authentication in web applications.
//- **Modularity:** Separates the token-related functionality, making the service easy to test, extend, or modify.
//- **Configurability:** The reliance on configuration settings allows for flexibility and adaptation to different environments without altering the codebase.
//### Practical Considerations:
//- **Distribution of the Secret Key:** Ensure that the JWT secret is stored securely and not exposed in the source code or version control systems.
//- **Token Lifetime Management:** Appropriate settings for token expiration and refresh mechanisms are crucial for balancing security and user experience.
//- **Scalability and Performance:** Efficient handling of token issuance and verification impacts overall performance, especially in high-traffic applications.