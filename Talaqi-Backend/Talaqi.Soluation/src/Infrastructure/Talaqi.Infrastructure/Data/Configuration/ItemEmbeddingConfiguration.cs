using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Talaqi.Domain.Rag.Embeddings;

namespace Talaqi.Infrastructure.Data.Configuration
{
    /// <summary>
    /// EF Core configuration for ItemEmbedding storage and indexes.
    /// </summary>
    public class ItemEmbeddingConfiguration : IEntityTypeConfiguration<ItemEmbedding>
    {
        public void Configure(EntityTypeBuilder<ItemEmbedding> builder)
        {
            builder.ToTable("ItemEmbeddings");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.ItemType)
                .IsRequired()
                .HasMaxLength(16);

            builder.Property(x => x.NormalizedText)
                .IsRequired()
                .HasMaxLength(4000);

            builder.Property(x => x.Category)
                .HasMaxLength(100);

            builder.Property(x => x.City)
                .HasMaxLength(100);

            builder.Property(x => x.Governorate)
                .HasMaxLength(100);

            builder.Property(x => x.LastUpdatedAt)
                .IsRequired();

            // Store float[] using EF Core value converter to varbinary(max)
            builder.Property(x => x.Embedding)
                .HasConversion(
                    v => FloatArrayToBytes(v),
                    v => BytesToFloatArray(v))
                .HasColumnType("varbinary(max)")
                .Metadata.SetValueComparer(new ValueComparer<float[]>(
                    (a, b) => a != null && b != null && a.SequenceEqual(b),
                    v => v != null ? v.Aggregate(0, (hash, f) => HashCode.Combine(hash, f.GetHashCode())) : 0,
                    v => v != null ? v.ToArray() : Array.Empty<float>()));

            // Indexes for efficient retrieval and filtering
            builder.HasIndex(x => new { x.ItemId, x.ItemType }).IsUnique();
            builder.HasIndex(x => x.Category);
            builder.HasIndex(x => x.City);
            builder.HasIndex(x => x.Governorate);
            builder.HasIndex(x => x.LastUpdatedAt);
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
