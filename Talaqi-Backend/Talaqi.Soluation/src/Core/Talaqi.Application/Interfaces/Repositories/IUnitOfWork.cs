namespace Talaqi.Application.Interfaces.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }
        ILostItemRepository LostItems { get; }
        IFoundItemRepository FoundItems { get; }
        IMatchRepository Matches { get; }
        IVerificationCodeRepository VerificationCodes { get; }

        // New repositories
        IReviewRepository Reviews { get; }
        IMessageRepository Messages { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}