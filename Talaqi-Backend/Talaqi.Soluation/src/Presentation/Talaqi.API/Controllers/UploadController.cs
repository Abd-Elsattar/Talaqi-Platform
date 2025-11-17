using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Talaqi.Application.Interfaces.Services;

namespace Talaqi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UploadController : ControllerBase
    {
        private readonly IFileService _fileService;

        public UploadController(IFileService fileService)
        {
            _fileService = fileService;
        }

        [HttpPost("image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var imageUrl = await _fileService.UploadImageAsync(file);

            if (imageUrl == null)
                return BadRequest("Failed to upload image. Please ensure the file is a valid image (JPG, PNG, GIF) and under 5MB.");

            return Ok(new { imageUrl });
        }
    }
}
