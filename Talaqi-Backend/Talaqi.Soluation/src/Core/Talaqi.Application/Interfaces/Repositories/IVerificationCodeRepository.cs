using Talaqi.Domain.Entities;

namespace Talaqi.Application.Interfaces.Repositories
{
    public interface IVerificationCodeRepository : IBaseRepository<VerificationCode>
    {
        Task<VerificationCode?> GetValidCodeAsync(string email, string code, string purpose);
        Task InvalidateCodesForEmailAsync(string email, string purpose);
    }
}