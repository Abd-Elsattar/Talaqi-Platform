using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Talaqi.Domain.Entities;

namespace Talaqi.Infrastructure.Data.Configuration
{
    public class VerificationCodeConfiguration : IEntityTypeConfiguration<VerificationCode>
    {
        public void Configure(EntityTypeBuilder<VerificationCode> builder)
        {
            builder.ToTable("VerificationCodes");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(x => x.Code)
                .IsRequired()
                .HasMaxLength(10);

            builder.Property(x => x.Purpose)
                .IsRequired()
                .HasMaxLength(50);

            builder.HasIndex(x => new { x.Email, x.Code, x.Purpose });
        }
    }
}