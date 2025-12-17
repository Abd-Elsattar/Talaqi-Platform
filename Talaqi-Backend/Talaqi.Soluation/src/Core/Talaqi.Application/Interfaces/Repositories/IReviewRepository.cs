using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Domain.Entities;

namespace Talaqi.Application.Interfaces.Repositories
{
    public interface IReviewRepository : IBaseRepository<Review>
    {
        Task<IEnumerable<Review>> GetReviewsForUserAsync(Guid reviewedUserId);
        Task<bool> HasReviewAsync(Guid reviewerId, Guid reviewedUserId);
    }
}
