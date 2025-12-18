using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using Talaqi.Application.Interfaces.Services;

namespace Talaqi.API.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        // We could inject a service here to update user online status in DB
        // private readonly IUserService _userService; 

        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(userId))
            {
                // TODO: Update user status to Online in DB
                // await _userService.SetOnlineStatusAsync(Guid.Parse(userId), true);

                // Add Admins to "Admins" group
                if (Context.User.IsInRole("Admin"))
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
                }
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(userId))
            {
                // TODO: Update user status to Offline and LastSeen in DB
                // await _userService.SetOnlineStatusAsync(Guid.Parse(userId), false);
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinConversation(string conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Conversation_{conversationId}");
        }

        public async Task LeaveConversation(string conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Conversation_{conversationId}");
        }

        public async Task Typing(string conversationId)
        {
            var userId = Context.UserIdentifier;
            if (userId != null)
            {
                await Clients.OthersInGroup($"Conversation_{conversationId}").SendAsync("UserTyping", new
                {
                    ConversationId = conversationId,
                    UserId = userId
                });
            }
        }
        
        public async Task StopTyping(string conversationId)
        {
             var userId = Context.UserIdentifier;
            if (userId != null)
            {
                await Clients.OthersInGroup($"Conversation_{conversationId}").SendAsync("UserStoppedTyping", new
                {
                    ConversationId = conversationId,
                    UserId = userId
                });
            }
        }
    }
}
