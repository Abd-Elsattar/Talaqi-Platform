using Microsoft.EntityFrameworkCore; // Using Entity Framework Core to work with the database
using Microsoft.EntityFrameworkCore.Metadata.Builders; // Provides API for configuring a model
using Talaqi.Domain.Entities; 

namespace Talaqi.Infrastructure.Data.Configuration 
{
    public class MatchConfiguration : IEntityTypeConfiguration<Match>
    {
        public void Configure(EntityTypeBuilder<Match> builder)
        {
            builder.ToTable("Matches");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.ConfidenceScore)
                .IsRequired()
                .HasPrecision(5, 2);

            builder.Property(x => x.Status).IsRequired();

            builder.HasIndex(x => x.LostItemId);
            builder.HasIndex(x => x.FoundItemId);
            builder.HasIndex(x => x.Status);
            builder.HasIndex(x => new { x.LostItemId, x.FoundItemId }).IsUnique();
        }
    }
}