using System;
using System.ComponentModel.DataAnnotations;

namespace Talaqi.Domain.Rag.Embeddings
{
    /// <summary>
    /// Stores embedding vectors for Lost and Found items to support RAG.
    /// </summary>
    public class ItemEmbedding
    {
        /// <summary>Primary key.</summary>
        public Guid Id { get; set; }

        /// <summary>Associated item id.</summary>
        public Guid ItemId { get; set; }

        /// <summary>Item type: "Lost" or "Found".</summary>
        [MaxLength(16)]
        public string ItemType { get; set; } = string.Empty;

        /// <summary>Embedding vector stored as float array.</summary>
        public float[] Embedding { get; set; } = Array.Empty<float>();

        /// <summary>Normalized text used to generate the embedding.</summary>
        [MaxLength(4000)]
        public string NormalizedText { get; set; } = string.Empty;

        /// <summary>Category name for optional filtering.</summary>
        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;

        /// <summary>City for optional filtering.</summary>
        [MaxLength(100)]
        public string? City { get; set; }

        /// <summary>Governorate for optional filtering.</summary>
        [MaxLength(100)]
        public string? Governorate { get; set; }

        /// <summary>Last update timestamp.</summary>
        public DateTime LastUpdatedAt { get; set; }
    }
}
