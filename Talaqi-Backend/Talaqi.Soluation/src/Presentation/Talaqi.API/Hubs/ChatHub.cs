using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using Talaqi.Application.DTOs.Chat;
using Talaqi.Application.Interfaces.Repositories;
using Microsoft.Extensions.Localization;
using Talaqi.API.Resources;

namespace Talaqi.API.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStringLocalizer<SharedResources> _localizer;

        public ChatHub(IUnitOfWork unitOfWork, IStringLocalizer<SharedResources> localizer)
        {
            _unitOfWork = unitOfWork;
            _localizer = localizer;
        }

        public override Task OnConnectedAsync()
        {
            // nothing custom required for basic one-to-one; user id mapping is from claims
            return base.OnConnectedAsync();
        }

        public async Task SendMessage(Talaqi.Application.DTOs.Chat.SendMessageDto dto)
        {
            var senderClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (senderClaim == null) throw new HubException(_localizer["Unauthorized"]);

            if (!Guid.TryParse(senderClaim, out var senderId))
                throw new HubException(_localizer["InvalidUserId"]);

            if (!Guid.TryParse(dto.ReceiverId, out var receiverId))
                throw new HubException(_localizer["InvalidUserId"]);

            if (string.IsNullOrWhiteSpace(dto.Content))
                throw new HubException(_localizer["EmptyMessage"]);

            var message = new Talaqi.Domain.Entities.Message
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = dto.Content,
                Timestamp = DateTime.UtcNow,
                IsRead = false
            };

            await _unitOfWork.Messages.AddAsync(message);
            await _unitOfWork.SaveChangesAsync();

            var messageDto = new MessageDto
            {
                SenderId = senderId.ToString(),
                SenderName = (Context.User?.Identity?.Name) ?? string.Empty,
                Content = message.Content,
                Timestamp = message.Timestamp,
                IsRead = message.IsRead
            };

            // Send to receiver (by user id)
            await Clients.User(receiverId.ToString()).SendAsync("ReceiveMessage", messageDto);
            // Also notify sender
            await Clients.Caller.SendAsync("MessageSent", messageDto);
        }
    }
}
