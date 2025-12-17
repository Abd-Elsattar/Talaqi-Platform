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

        // New DbSets
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<Message> Messages => Set<Message>();

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

            // Reviews configuration: unique reviewer-reviewed pair
            modelBuilder.Entity<Review>(builder =>
            {
                builder.HasIndex(r => new { r.ReviewerId, r.ReviewedUserId }).IsUnique();

                builder.HasOne(r => r.Reviewer)
                       .WithMany(u => u.GivenReviews)
                       .HasForeignKey(r => r.ReviewerId)
                       .OnDelete(DeleteBehavior.Restrict);

                builder.HasOne(r => r.ReviewedUser)
                       .WithMany(u => u.ReceivedReviews)
                       .HasForeignKey(r => r.ReviewedUserId)
                       .OnDelete(DeleteBehavior.Restrict);
            });

            // Messages configuration
            modelBuilder.Entity<Message>(builder =>
            {
                builder.HasOne(m => m.Sender)
                       .WithMany()
                       .HasForeignKey(m => m.SenderId)
                       .OnDelete(DeleteBehavior.Restrict);

                builder.HasOne(m => m.Receiver)
                       .WithMany()
                       .HasForeignKey(m => m.ReceiverId)
                       .OnDelete(DeleteBehavior.Restrict);

                builder.HasIndex(m => new { m.SenderId, m.ReceiverId });
                builder.HasIndex(m => m.Timestamp);
            });
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