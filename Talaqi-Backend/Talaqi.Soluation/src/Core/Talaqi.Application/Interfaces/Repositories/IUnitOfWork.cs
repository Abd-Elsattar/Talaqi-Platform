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
        IUserRepository Users { get; }
        ILostItemRepository LostItems { get; }
        IFoundItemRepository FoundItems { get; }
        IMatchRepository Matches { get; }
        IMatchCandidateRepository MatchCandidates { get; }
        IVerificationCodeRepository VerificationCodes { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

        Task ExecuteTransactionalAsync(Func<Task> operation);
    }
}
