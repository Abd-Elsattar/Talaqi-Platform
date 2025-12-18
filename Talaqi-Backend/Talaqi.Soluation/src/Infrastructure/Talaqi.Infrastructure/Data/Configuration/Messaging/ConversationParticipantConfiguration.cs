using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Talaqi.Domain.Entities.Messaging;

namespace Talaqi.Infrastructure.Data.Configuration.Messaging
{
    public class ConversationParticipantConfiguration : IEntityTypeConfiguration<ConversationParticipant>
    {
        public void Configure(EntityTypeBuilder<ConversationParticipant> builder)
        {
            builder.ToTable("ConversationParticipants");

            // Composite Key
            builder.HasKey(cp => new { cp.ConversationId, cp.UserId });

            builder.Property(cp => cp.Nickname)
                .HasMaxLength(50);

            // Relationships
            builder.HasOne(cp => cp.User)
                .WithMany() // Assuming User doesn't explicitly navigate to Participants (or add it later)
                .HasForeignKey(cp => cp.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Don't delete participants if user is deleted, or Cascade if appropriate. Usually Restrict/SetNull to keep history.
            
            // LastReadMessage optional link
            builder.HasOne(cp => cp.LastReadMessage)
                .WithMany()
                .HasForeignKey(cp => cp.LastReadMessageId)
                .OnDelete(DeleteBehavior.NoAction); // Avoid cycles
        }
    }
}
