using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Talaqi.Application.DTOs.Chat;
using Talaqi.Application.Interfaces.Repositories;
using Microsoft.Extensions.Localization;
using Talaqi.API.Resources;

namespace Talaqi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStringLocalizer<SharedResources> _localizer;

        public ChatController(IUnitOfWork unitOfWork, IStringLocalizer<SharedResources> localizer)
        {
            _unitOfWork = unitOfWork;
            _localizer = localizer;
        }

        [HttpGet("history/{otherUserId}")]
        public async Task<IActionResult> GetHistory(string otherUserId)
        {
            if (!Guid.TryParse(otherUserId, out var otherId))
                return BadRequest(_localizer["InvalidUserId"]);

            var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserIdClaim == null) return Unauthorized();

            var currentUserId = Guid.Parse(currentUserIdClaim);

            var messages = await _unitOfWork.Messages.GetConversationAsync(currentUserId, otherId, 100);

            var dto = messages.Select(m => new MessageDto
            {
                SenderId = m.SenderId.ToString(),
                SenderName = m.Sender.FullName,
                Content = m.Content,
                Timestamp = m.Timestamp,
                IsRead = m.IsRead
            }).ToList();

            return Ok(dto);
        }
    }
}
