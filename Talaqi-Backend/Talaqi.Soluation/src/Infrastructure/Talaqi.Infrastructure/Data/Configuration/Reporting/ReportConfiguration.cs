using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Talaqi.Domain.Entities.Reporting;

namespace Talaqi.Infrastructure.Data.Configuration.Reporting
{
    public class ReportConfiguration : IEntityTypeConfiguration<Report>
    {
        public void Configure(EntityTypeBuilder<Report> builder)
        {
            builder.ToTable("Reports");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Description)
                .HasMaxLength(1000);

            builder.Property(x => x.AdminNotes)
                .HasMaxLength(1000);

            // Relationships
            builder.HasOne(x => x.Reporter)
                .WithMany()
                .HasForeignKey(x => x.ReporterId)
                .OnDelete(DeleteBehavior.Restrict); // Don't delete reports if user is deleted

            builder.HasOne(x => x.TargetUser)
                .WithMany()
                .HasForeignKey(x => x.TargetUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Conversation)
                .WithMany()
                .HasForeignKey(x => x.ConversationId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(x => x.Message)
                .WithMany()
                .HasForeignKey(x => x.MessageId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(x => x.ResolvedBy)
                .WithMany()
                .HasForeignKey(x => x.ResolvedById)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes for performance
            builder.HasIndex(x => x.Status);
            builder.HasIndex(x => x.CreatedAt);
            builder.HasIndex(x => x.TargetType);
            builder.HasIndex(x => x.ReporterId);
            builder.HasIndex(x => x.TargetUserId);
        }
    }
}
