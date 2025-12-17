using Microsoft.EntityFrameworkCore.Storage;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Infrastructure.Data;

namespace Talaqi.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IDbContextTransaction? _transaction;

        private IUserRepository? _users;
        private ILostItemRepository? _lostItems;
        private IFoundItemRepository? _foundItems;
        private IMatchRepository? _matches;
        private IVerificationCodeRepository? _verificationCodes;

        // New repositories backing fields
        private IReviewRepository? _reviews;
        private IMessageRepository? _messages;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public IUserRepository Users => _users ??= new UserRepository(_context);
        public ILostItemRepository LostItems => _lostItems ??= new LostItemRepository(_context);
        public IFoundItemRepository FoundItems => _foundItems ??= new FoundItemRepository(_context);
        public IMatchRepository Matches => _matches ??= new MatchRepository(_context);
        public IVerificationCodeRepository VerificationCodes => _verificationCodes ??= new VerificationCodeRepository(_context);

        // New properties
        public IReviewRepository Reviews => _reviews ??= new ReviewRepository(_context);
        public IMessageRepository Messages => _messages ??= new MessageRepository(_context);


        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
                    => await _context.SaveChangesAsync(cancellationToken);

        public async Task BeginTransactionAsync()
            => _transaction = await _context.Database.BeginTransactionAsync();

        public async Task CommitTransactionAsync()
        {
            if (_transaction == null) return;
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction == null) return;
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}
