using Microsoft.EntityFrameworkCore;
using Talaqi.Domain.Entities;
using Talaqi.Domain.Rag.Embeddings;
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
        public DbSet<MatchCandidate> MatchCandidates => Set<MatchCandidate>();
        public DbSet<VerificationCode> VerificationCodes => Set<VerificationCode>();
        public DbSet<ItemEmbedding> ItemEmbeddings => Set<ItemEmbedding>();
        public DbSet<Talaqi.Domain.Rag.Knowledge.PlatformKnowledge> PlatformKnowledge => Set<Talaqi.Domain.Rag.Knowledge.PlatformKnowledge>();
        public DbSet<Talaqi.Domain.Rag.Embeddings.PlatformKnowledgeEmbedding> PlatformKnowledgeEmbeddings => Set<Talaqi.Domain.Rag.Embeddings.PlatformKnowledgeEmbedding>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new LostItemConfiguration());
            modelBuilder.ApplyConfiguration(new FoundItemConfiguration());
            modelBuilder.ApplyConfiguration(new MatchConfiguration());
            // Optionally configure MatchCandidate via conventions
            modelBuilder.ApplyConfiguration(new VerificationCodeConfiguration());
            modelBuilder.ApplyConfiguration(new ItemEmbeddingConfiguration());
            modelBuilder.ApplyConfiguration(new PlatformKnowledgeConfiguration());
            modelBuilder.ApplyConfiguration(new PlatformKnowledgeEmbeddingConfiguration());

            // Global query filters
            modelBuilder.Entity<User>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<LostItem>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<FoundItem>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<Talaqi.Domain.Rag.Knowledge.PlatformKnowledge>().HasQueryFilter(e => !e.IsDeleted);

            // Configure decimal precision for MatchCandidate scores
            modelBuilder.Entity<MatchCandidate>(b =>
            {
                b.Property(x => x.ScoreText).HasColumnType("decimal(5,2)");
                b.Property(x => x.ScoreImage).HasColumnType("decimal(5,2)");
                b.Property(x => x.ScoreLocation).HasColumnType("decimal(5,2)");
                b.Property(x => x.ScoreDate).HasColumnType("decimal(5,2)");
                b.Property(x => x.AggregateScore).HasColumnType("decimal(5,2)");
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