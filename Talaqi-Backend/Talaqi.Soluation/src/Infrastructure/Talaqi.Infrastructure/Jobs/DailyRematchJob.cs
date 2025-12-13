using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Application.Interfaces.Services;

namespace Talaqi.Infrastructure.Jobs
{
    public class DailyRematchJob : BackgroundService
    {
        private readonly ILogger<DailyRematchJob> _logger;
        private readonly IServiceScopeFactory _scopeFactory;

        private readonly TimeSpan _interval = TimeSpan.FromDays(1);
        private readonly TimeSpan _staleCandidateAge = TimeSpan.FromDays(30);

        public DailyRematchJob(ILogger<DailyRematchJob> logger, IServiceScopeFactory scopeFactory)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("DailyRematchJob started");
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await RunOnceAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "DailyRematchJob run failed");
                }
                await Task.Delay(_interval, stoppingToken);
            }
        }

        private async Task RunOnceAsync(CancellationToken token)
        {
            var start = DateTime.UtcNow;
            int promoted = 0, cleaned = 0;

            using var scope = _scopeFactory.CreateScope();
            var uow = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
            var matching = scope.ServiceProvider.GetRequiredService<IMatchingService>();

            // Incremental: load unpromoted candidates and re-evaluate
            var candidates = await uow.MatchCandidates.GetPendingAsync();
            foreach (var c in candidates)
            {
                var existing = await uow.Matches.GetMatchByItemsAsync(c.LostItemId, c.FoundItemId);
                if (existing != null) { c.Promoted = true; continue; }
                var resLost = await matching.FindMatchesForLostItemAsync(c.LostItemId);
                var resFound = await matching.FindMatchesForFoundItemAsync(c.FoundItemId);
                if (resLost.IsSuccess || resFound.IsSuccess) promoted++;
            }

            // Cleanup stale candidates
            var allCandidates = await uow.MatchCandidates.GetAllAsync();
            foreach (var c in allCandidates)
            {
                if (c.CreatedAt < DateTime.UtcNow - _staleCandidateAge)
                {
                    await uow.MatchCandidates.DeleteAsync(c);
                    cleaned++;
                }
            }

            await uow.SaveChangesAsync(token);
            _logger.LogInformation("DailyRematchJob done in {Elapsed}ms: promoted={Promoted}, cleaned={Cleaned}", (DateTime.UtcNow-start).TotalMilliseconds, promoted, cleaned);
        }
    }
}
