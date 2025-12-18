using Microsoft.AspNetCore.SignalR;
using Talaqi.API.Hubs;
using Talaqi.Application.DTOs.Messaging;
using Talaqi.Application.Interfaces.Services;

namespace Talaqi.API.Services
{
    public class ChatNotifier : IChatNotifier
    {
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatNotifier(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task NotifyMessageReceivedAsync(Guid userId, MessageDto message)
        {
            await _hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveMessage", message);
        }

        public async Task NotifyReadAsync(Guid conversationId, Guid userId, Guid messageId)
        {
            // Notify the user who sent the message that it was read (optional, depends on if we track individual msg status)
            // Or broadcast to the conversation group
             await _hubContext.Clients.Group($"Conversation_{conversationId}").SendAsync("MessageRead", new
             {
                 ConversationId = conversationId,
                 UserId = userId,
                 MessageId = messageId
             });
        }

        public async Task NotifyTypingAsync(Guid conversationId, Guid userId)
        {
             await _hubContext.Clients.Group($"Conversation_{conversationId}").SendAsync("UserTyping", new 
             { 
                 ConversationId = conversationId, 
                 UserId = userId 
             });
        }
    }
}
