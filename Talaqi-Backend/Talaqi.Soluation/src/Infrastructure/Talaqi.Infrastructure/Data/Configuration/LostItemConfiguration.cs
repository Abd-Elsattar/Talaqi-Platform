using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Talaqi.Domain.Entities;

namespace Talaqi.Infrastructure.Data.Configuration
{
    public class LostItemConfiguration : IEntityTypeConfiguration<LostItem>
    {
        public void Configure(EntityTypeBuilder<LostItem> builder)
        {
            builder.ToTable("LostItems");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Category).IsRequired();

            builder.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(x => x.Description)
                .IsRequired()
                .HasMaxLength(2000);

            builder.Property(x => x.ContactInfo)
                .IsRequired()
                .HasMaxLength(500);

            builder.OwnsOne(x => x.Location, location =>
            {
                location.Property(l => l.Address).HasMaxLength(500);
                location.Property(l => l.City).HasMaxLength(100);
                location.Property(l => l.Governorate).HasMaxLength(100);
            });

            builder.HasMany(x => x.Matches)
                .WithOne(x => x.LostItem)
                .HasForeignKey(x => x.LostItemId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(x => x.UserId);
            builder.HasIndex(x => x.Category);
            builder.HasIndex(x => x.Status);
            builder.HasIndex(x => x.CreatedAt);
        }
    }
}