namespace Talaqi.Domain.Enums.Messaging
{
    public enum MessageDeliveryStatus
    {
        Pending = 0,
        Sent = 1,      // On server
        Delivered = 2, // On recipient device
        Seen = 3       // Read by recipient
    }
}
