//namespace Talaqi.Application.Interfaces.Repositories
//{
//    public interface IUnitOfWork : IDisposable
//    {
//        IUserRepository Users { get; }
//        ILostItemRepository LostItems { get; }
//        IFoundItemRepository FoundItems { get; }
//        IMatchRepository Matches { get; }
//        IVerificationCodeRepository VerificationCodes { get; }

//        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
//        Task BeginTransactionAsync();
//        Task CommitTransactionAsync();
//        Task RollbackTransactionAsync();
//    }
//}
using Talaqi.Application.Interfaces.Repositories;

namespace Talaqi.Application.Interfaces.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        // Repositories
        IUserRepository Users { get; }
        ILostItemRepository LostItems { get; }
        IFoundItemRepository FoundItems { get; }
        IMatchRepository Matches { get; }
        IVerificationCodeRepository VerificationCodes { get; }

        // Save changes
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

        // ⭐ Unified Transaction API (Final)
        Task ExecuteTransactionalAsync(Func<Task> operation);
    }
}
