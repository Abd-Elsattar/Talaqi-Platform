using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Talaqi.Domain.Entities.Messaging;

namespace Talaqi.Infrastructure.Data.Configuration.Messaging
{
    public class MessageDeliveryConfiguration : IEntityTypeConfiguration<MessageDelivery>
    {
        public void Configure(EntityTypeBuilder<MessageDelivery> builder)
        {
            builder.ToTable("MessageDeliveries");

            builder.HasKey(md => new { md.MessageId, md.UserId });

            builder.HasOne(md => md.User)
                .WithMany()
                .HasForeignKey(md => md.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
