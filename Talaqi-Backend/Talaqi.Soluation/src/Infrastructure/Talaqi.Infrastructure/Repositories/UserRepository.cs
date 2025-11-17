using Microsoft.EntityFrameworkCore;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Domain.Entities;
using Talaqi.Infrastructure.Data;

namespace Talaqi.Infrastructure.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _dbSet.ToListAsync();
        }
        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet
                .FirstOrDefaultAsync(u => u.Email == email.ToLower());
        }

        public async Task<User?> GetByPhoneAsync(string phone)
        {
            return await _dbSet
                .FirstOrDefaultAsync(u => u.PhoneNumber == phone);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _dbSet
                .AnyAsync(u => u.Email == email.ToLower());
        }

        public async Task<IEnumerable<User>> GetActiveUsersAsync()
        {
            return await _dbSet
                .Where(u => u.IsActive)
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> GetUsersByRoleAsync(string role)
        {
            return await _dbSet
                .Where(u => u.Role == role)
                .ToListAsync();
        }

    }
}
