using Microsoft.EntityFrameworkCore;
using Talaqi.Domain.Entities;
using Talaqi.Infrastructure.Data.Configuration;

namespace Talaqi.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<LostItem> LostItems => Set<LostItem>();
        public DbSet<FoundItem> FoundItems => Set<FoundItem>();
        public DbSet<Match> Matches => Set<Match>();
        public DbSet<VerificationCode> VerificationCodes => Set<VerificationCode>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new LostItemConfiguration());
            modelBuilder.ApplyConfiguration(new FoundItemConfiguration());
            modelBuilder.ApplyConfiguration(new MatchConfiguration());
            modelBuilder.ApplyConfiguration(new VerificationCodeConfiguration());

            // Global query filters
            modelBuilder.Entity<User>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<LostItem>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<FoundItem>().HasQueryFilter(e => !e.IsDeleted);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries<BaseEntity>();

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    entry.Entity.Id = Guid.NewGuid();
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}