using Microsoft.EntityFrameworkCore;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Application.Interfaces.Repositories.Messaging;
using Talaqi.Application.Interfaces.Repositories.Reporting;
using Talaqi.Infrastructure.Data;
using Talaqi.Infrastructure.Repositories.Messaging;
using Talaqi.Infrastructure.Repositories.Reporting;

namespace Talaqi.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly ApplicationDbContext _context;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public IUserRepository Users => new UserRepository(_context);
        public ILostItemRepository LostItems => new LostItemRepository(_context);
        public IFoundItemRepository FoundItems => new FoundItemRepository(_context);
        public IMatchRepository Matches => new MatchRepository(_context);
        
        // Messaging
        public IConversationRepository Conversations => new ConversationRepository(_context);
        public IMessageRepository Messages => new MessageRepository(_context);
        
        public IReportRepository Reports => new ReportRepository(_context);
        public IUserReportRepository UserReports => new UserReportRepository(_context);
        public IMatchCandidateRepository MatchCandidates => new MatchCandidateRepository(_context);
        public IVerificationCodeRepository VerificationCodes => new VerificationCodeRepository(_context);

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
            => await _context.SaveChangesAsync(cancellationToken);

        public async Task ExecuteTransactionalAsync(Func<Task> operation)
        {
            var strategy = _context.Database.CreateExecutionStrategy();

            await strategy.ExecuteAsync(async () =>
            {
                await using var transaction = await _context.Database.BeginTransactionAsync();

                try
                {
                    await operation();
                    await transaction.CommitAsync();
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            });
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
