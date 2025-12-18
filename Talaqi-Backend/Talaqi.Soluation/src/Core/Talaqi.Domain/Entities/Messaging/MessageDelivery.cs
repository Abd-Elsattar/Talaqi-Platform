using System;
using Talaqi.Domain.Entities;
using Talaqi.Domain.Enums.Messaging;

namespace Talaqi.Domain.Entities.Messaging
{
    public class MessageDelivery
    {
        public Guid MessageId { get; set; }
        public Guid UserId { get; set; } // Recipient

        public MessageDeliveryStatus Status { get; set; } = MessageDeliveryStatus.Pending;
        public DateTime? DeliveredAt { get; set; }
        public DateTime? SeenAt { get; set; }

        public virtual Message Message { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
}
