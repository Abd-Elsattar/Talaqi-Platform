using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Talaqi.Application.DTOs.Items;
using Talaqi.Application.Interfaces.Services;

namespace Talaqi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FoundItemsController : ControllerBase
    {
        private readonly IFoundItemService _foundItemService;

        public FoundItemsController(IFoundItemService foundItemService)
        {
            _foundItemService = foundItemService;
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _foundItemService.GetFoundItemByIdAsync(id);

            if (!result.IsSuccess)
                return NotFound(result);

            return Ok(result);
        }

        [HttpGet("my-items")]
        public async Task<IActionResult> GetMyItems()
        {
            var userId = GetUserId();
            var result = await _foundItemService.GetUserFoundItemsAsync(userId);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateFoundItemDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            var result = await _foundItemService.CreateFoundItemAsync(dto, userId);

            if (!result.IsSuccess)
                return BadRequest(result);

            return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateFoundItemDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            var result = await _foundItemService.UpdateFoundItemAsync(id, dto, userId);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = GetUserId();
            var result = await _foundItemService.DeleteFoundItemAsync(id, userId);

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
}
