using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Talaqi.Application.DTOs.Users;
using Talaqi.Application.Interfaces.Services;

namespace Talaqi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IFileService _fileService;

        public UsersController(IUserService userService, IFileService fileService)
        {
            _userService = userService;
            _fileService = fileService;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetUserId();
            var result = await _userService.GetUserProfileAsync(userId);

            if (!result.IsSuccess)
                return NotFound(result);

            return Ok(result);
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            var result = await _userService.UpdateUserProfileAsync(userId, dto);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("profile-picture")]
        public async Task<IActionResult> UploadProfilePicture(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var imagePath = await _fileService.UploadImageAsync(file);

            if (imagePath == null)
                return BadRequest("Failed to upload image");

            var requestBase = $"{Request.Scheme}://{Request.Host}";
            var imageUrl = $"{requestBase}{imagePath}"; 

            var userId = GetUserId();
            var result = await _userService.UpdateProfilePictureAsync(userId, imageUrl);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(new { imageUrl, message = result.Message });
        }


        [HttpDelete("account")]
        public async Task<IActionResult> DeleteAccount()
        {
            var userId = GetUserId();
            var result = await _userService.DeleteUserAccountAsync(userId);

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

