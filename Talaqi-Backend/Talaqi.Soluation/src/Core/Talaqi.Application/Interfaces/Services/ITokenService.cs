using Talaqi.Domain.Entities;

namespace Talaqi.Application.Interfaces.Services
{
    public interface ITokenService
    {
        string GenerateAccessToken(User user);
        string GenerateRefreshToken();
        string GenerateVerificationCode();
    }
}
