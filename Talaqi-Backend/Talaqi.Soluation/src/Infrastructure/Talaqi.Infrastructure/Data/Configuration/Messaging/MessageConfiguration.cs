using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Talaqi.Domain.Entities.Messaging;

namespace Talaqi.Infrastructure.Data.Configuration.Messaging
{
    public class MessageConfiguration : IEntityTypeConfiguration<Message>
    {
        public void Configure(EntityTypeBuilder<Message> builder)
        {
            builder.ToTable("Messages");

            builder.HasKey(m => m.Id);

            builder.Property(m => m.Content)
                .HasMaxLength(4000); // Limit message size

            // Relationships
            builder.HasOne(m => m.Sender)
                .WithMany()
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict); // Keep message if sender deleted

            builder.HasOne(m => m.ReplyToMessage)
                .WithMany()
                .HasForeignKey(m => m.ReplyToMessageId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(m => m.Attachments)
                .WithOne(a => a.Message)
                .HasForeignKey(a => a.MessageId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(m => m.Deliveries)
                .WithOne(d => d.Message)
                .HasForeignKey(d => d.MessageId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
