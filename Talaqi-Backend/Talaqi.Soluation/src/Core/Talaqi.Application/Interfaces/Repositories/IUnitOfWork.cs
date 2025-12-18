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
using Talaqi.Application.Interfaces.Repositories.Messaging;
using Talaqi.Application.Interfaces.Repositories.Reporting;

namespace Talaqi.Application.Interfaces.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }
        ILostItemRepository LostItems { get; }
        IFoundItemRepository FoundItems { get; }
        IMatchRepository Matches { get; }
        
        // Messaging
        IConversationRepository Conversations { get; }
        IMessageRepository Messages { get; }
        
        IReportRepository Reports { get; } // Replaces UserReports eventually
        IUserReportRepository UserReports { get; }
        IMatchCandidateRepository MatchCandidates { get; }
        IVerificationCodeRepository VerificationCodes { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

        Task ExecuteTransactionalAsync(Func<Task> operation);
    }
}
