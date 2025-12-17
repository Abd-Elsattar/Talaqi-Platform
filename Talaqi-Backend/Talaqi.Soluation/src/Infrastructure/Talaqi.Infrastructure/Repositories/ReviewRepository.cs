using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Domain.Entities;
using Talaqi.Infrastructure.Data;

namespace Talaqi.Infrastructure.Repositories
{
    public class ReviewRepository : BaseRepository<Review>, IReviewRepository
    {
        public ReviewRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Review>> GetReviewsForUserAsync(Guid reviewedUserId)
        {
            return await _dbSet
                .Include(r => r.Reviewer)
                .Where(r => r.ReviewedUserId == reviewedUserId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool> HasReviewAsync(Guid reviewerId, Guid reviewedUserId)
        {
            return await _dbSet.AnyAsync(r => r.ReviewerId == reviewerId && r.ReviewedUserId == reviewedUserId);
        }
    }
}
