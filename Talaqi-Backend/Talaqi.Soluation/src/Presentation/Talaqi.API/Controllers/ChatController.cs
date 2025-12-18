using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Talaqi.API.Common.Extensions;
using Talaqi.Application.DTOs.Messaging;
using Talaqi.Application.Interfaces.Services;

namespace Talaqi.API.Controllers
{
    [ApiController]
    [Route("api/chat")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IMessagingService _messagingService;

        public ChatController(IMessagingService messagingService)
        {
            _messagingService = messagingService;
        }

        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userId = User.GetUserId();
            var result = await _messagingService.GetUserConversationsAsync(userId, page, pageSize);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("conversations/{id}")]
        public async Task<IActionResult> GetConversation(Guid id)
        {
            var userId = User.GetUserId();
            var result = await _messagingService.GetConversationAsync(id, userId);
            if (!result.IsSuccess) return NotFound(result);
            return Ok(result);
        }

        [HttpPost("conversations/start")]
        public async Task<IActionResult> StartConversation([FromBody] StartConversationRequest request)
        {
            var userId = User.GetUserId();
            var result = await _messagingService.StartPrivateConversationAsync(userId, request.UserId, request.MatchId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("messages")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageDto request)
        {
            var userId = User.GetUserId();
            var result = await _messagingService.SendMessageAsync(userId, request);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("conversations/{conversationId}/messages")]
        public async Task<IActionResult> GetMessages(Guid conversationId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            var userId = User.GetUserId();
            var result = await _messagingService.GetMessagesAsync(conversationId, userId, page, pageSize);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("conversations/{conversationId}/read")]
        public async Task<IActionResult> MarkAsRead(Guid conversationId, [FromBody] MarkReadRequest request)
        {
            var userId = User.GetUserId();
            var result = await _messagingService.MarkAsReadAsync(conversationId, userId, request.MessageId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("messages/{id}")]
        public async Task<IActionResult> DeleteMessage(Guid id)
        {
            var userId = User.GetUserId();
            var result = await _messagingService.DeleteMessageAsync(id, userId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }
    }

    public class StartConversationRequest
    {
        public Guid UserId { get; set; }
        public Guid? MatchId { get; set; }
    }

    public class MarkReadRequest
    {
        public Guid MessageId { get; set; }
    }
}
