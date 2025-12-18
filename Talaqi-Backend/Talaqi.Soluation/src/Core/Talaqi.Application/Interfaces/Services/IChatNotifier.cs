using Talaqi.Application.DTOs.Messaging;

namespace Talaqi.Application.Interfaces.Services
{
    public interface IChatNotifier
    {
        Task NotifyMessageReceivedAsync(Guid userId, MessageDto message);
        Task NotifyTypingAsync(Guid conversationId, Guid userId);
        Task NotifyReadAsync(Guid conversationId, Guid userId, Guid messageId);
    }
}
