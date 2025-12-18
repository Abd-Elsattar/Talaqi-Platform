using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Talaqi.Domain.Entities.Messaging;

namespace Talaqi.Infrastructure.Data.Configuration.Messaging
{
    public class ConversationConfiguration : IEntityTypeConfiguration<Conversation>
    {
        public void Configure(EntityTypeBuilder<Conversation> builder)
        {
            builder.ToTable("Conversations");

            builder.HasKey(c => c.Id);

            builder.Property(c => c.Type)
                .IsRequired();

            builder.Property(c => c.Title)
                .HasMaxLength(100);
            
            builder.Property(c => c.ImageUrl)
                .HasMaxLength(500);

            // Relationships
            builder.HasMany(c => c.Participants)
                .WithOne(p => p.Conversation)
                .HasForeignKey(p => p.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(c => c.Messages)
                .WithOne(m => m.Conversation)
                .HasForeignKey(m => m.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
