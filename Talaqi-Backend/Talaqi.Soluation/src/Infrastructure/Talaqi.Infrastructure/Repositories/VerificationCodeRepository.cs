using Microsoft.EntityFrameworkCore;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Domain.Entities;
using Talaqi.Infrastructure.Data;

namespace Talaqi.Infrastructure.Repositories
{
    public class VerificationCodeRepository : BaseRepository<VerificationCode>, IVerificationCodeRepository
    {
        public VerificationCodeRepository(ApplicationDbContext context) : base(context) { }

        public async Task<VerificationCode?> GetValidCodeAsync(string email, string code, string purpose)
        {
            return await _dbSet
                .Where(x => x.Email == email.ToLower() &&
                           x.Code == code &&
                           x.Purpose == purpose &&
                           !x.IsUsed &&
                           x.ExpiresAt > DateTime.UtcNow)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task InvalidateCodesForEmailAsync(string email, string purpose)
        {
            var codes = await _dbSet
                .Where(x => x.Email == email.ToLower() && x.Purpose == purpose && !x.IsUsed)
                .ToListAsync();

            foreach (var code in codes)
            {
                code.IsUsed = true;
            }
        }
    }
}
