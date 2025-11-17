using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Talaqi.Application.Interfaces.Services;

namespace Talaqi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MatchesController : ControllerBase
    {
        private readonly IMatchingService _matchingService;

        public MatchesController(IMatchingService matchingService)
        {
            _matchingService = matchingService;
        }

        [HttpGet("my-matches")]
        public async Task<IActionResult> GetMyMatches()
        {
            var userId = GetUserId();
            var result = await _matchingService.GetUserMatchesAsync(userId);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _matchingService.GetMatchByIdAsync(id);

            if (!result.IsSuccess)
                return NotFound(result);

            return Ok(result);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateMatchStatusDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            var result = await _matchingService.UpdateMatchStatusAsync(id, dto.Status, userId);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userIdClaim ?? throw new UnauthorizedAccessException());
        }
    }

    public class UpdateMatchStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }

}

