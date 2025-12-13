using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Talaqi.Domain.Rag.Embeddings;

namespace Talaqi.Infrastructure.Data.Configuration
{
    public class PlatformKnowledgeEmbeddingConfiguration : IEntityTypeConfiguration<PlatformKnowledgeEmbedding>
    {
        public void Configure(EntityTypeBuilder<PlatformKnowledgeEmbedding> builder)
        {
            builder.ToTable("PlatformKnowledgeEmbeddings");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Category).HasMaxLength(100);
            builder.Property(x => x.NormalizedText).IsRequired().HasMaxLength(4000);
            builder.Property(x => x.LastUpdatedAt).IsRequired();
            builder.Property(x => x.Embedding)
                .HasConversion(
                    v => FloatArrayToBytes(v),
                    v => BytesToFloatArray(v))
                .HasColumnType("varbinary(max)")
                .Metadata.SetValueComparer(new ValueComparer<float[]>(
                    (a, b) => a != null && b != null && a.SequenceEqual(b),
                    v => v != null ? v.Aggregate(0, (hash, f) => HashCode.Combine(hash, f.GetHashCode())) : 0,
                    v => v != null ? v.ToArray() : Array.Empty<float>()));

            builder.HasIndex(x => x.Category);
            builder.HasIndex(x => x.LastUpdatedAt);
            builder.HasIndex(x => x.KnowledgeId).IsUnique();
        }

        private static byte[] FloatArrayToBytes(float[] arr)
        {
            if (arr == null || arr.Length == 0) return Array.Empty<byte>();
            var bytes = new byte[arr.Length * sizeof(float)];
            Buffer.BlockCopy(arr, 0, bytes, 0, bytes.Length);
            return bytes;
        }

        private static float[] BytesToFloatArray(byte[] bytes)
        {
            if (bytes == null || bytes.Length == 0) return Array.Empty<float>();
            var arr = new float[bytes.Length / sizeof(float)];
            Buffer.BlockCopy(bytes, 0, arr, 0, bytes.Length);
            return arr;
        }
    }
}
