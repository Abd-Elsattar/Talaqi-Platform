using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Talaqi.Domain.Rag.Knowledge;

namespace Talaqi.Infrastructure.Data.Configuration
{
    public class PlatformKnowledgeConfiguration : IEntityTypeConfiguration<PlatformKnowledge>
    {
        public void Configure(EntityTypeBuilder<PlatformKnowledge> builder)
        {
            builder.ToTable("PlatformKnowledge");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Title).IsRequired().HasMaxLength(200);
            builder.Property(x => x.Content).IsRequired().HasMaxLength(4000);
            builder.Property(x => x.Category).IsRequired().HasMaxLength(100);
        }
    }
}
