using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Talaqi.Domain.Entities;

namespace Talaqi.Infrastructure.Data.Configuration
{
    public class UserReportConfiguration : IEntityTypeConfiguration<UserReport>
    {
        public void Configure(EntityTypeBuilder<UserReport> builder)
        {
            builder.ToTable("UserReports");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.ReporterId).IsRequired();
            builder.Property(x => x.ReportedUserId).IsRequired();
            builder.Property(x => x.Reason).IsRequired().HasMaxLength(500);
            builder.Property(x => x.Description).HasMaxLength(2000);

            // Immutable: prevent updates at DB level? We'll rely on app-layer immutability
            // Indexes for admin filtering
            builder.HasIndex(x => x.ReportedUserId);
            builder.HasIndex(x => x.ReporterId);
            builder.HasIndex(x => x.CreatedAt);
        }
    }
}
