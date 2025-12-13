using System;
using System.ComponentModel.DataAnnotations;

namespace Talaqi.Domain.Rag.Embeddings
{
    public class PlatformKnowledgeEmbedding
    {
        public Guid Id { get; set; }
        public Guid KnowledgeId { get; set; }

        [MaxLength(100)]
        public string Category { get; set; } = string.Empty; // About, HowTo, FAQ

        [MaxLength(4000)]
        public string NormalizedText { get; set; } = string.Empty;

        public float[] Embedding { get; set; } = Array.Empty<float>();

        public DateTime LastUpdatedAt { get; set; }
    }
}
