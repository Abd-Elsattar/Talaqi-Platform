using System;
using Talaqi.Domain.Entities;

namespace Talaqi.Domain.Entities.Messaging
{
    public class Attachment : BaseEntity
    {
        public Guid MessageId { get; set; }
        
        public string Url { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty; // MIME type
        public long SizeBytes { get; set; }
        
        // For Image/Video dimensions or duration
        public int? Width { get; set; }
        public int? Height { get; set; }
        public double? DurationSeconds { get; set; }

        public virtual Message Message { get; set; } = null!;
    }
}
