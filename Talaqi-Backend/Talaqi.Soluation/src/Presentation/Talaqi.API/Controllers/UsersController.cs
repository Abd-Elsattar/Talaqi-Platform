using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Talaqi.Application.DTOs.Users;
using Talaqi.Application.Interfaces.Services;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Application.DTOs.Reviews;
using Microsoft.Extensions.Localization;
using Talaqi.API.Resources;
using System;

namespace Talaqi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IFileService _fileService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStringLocalizer<SharedResources> _localizer;

        public UsersController(IUserService userService, IFileService fileService, IUnitOfWork unitOfWork, IStringLocalizer<SharedResources> localizer)
        {
            _userService = userService;
            _fileService = fileService;
            _unitOfWork = unitOfWork;
            _localizer = localizer;
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

            var imageUrl = await _fileService.UploadImageAsync(file);

            if (imageUrl == null)
                return BadRequest("Failed to upload image");

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

        // New endpoints for reviews

        [Authorize]
        [HttpGet("{userId}/reviews")]
        [HttpGet("users/{userId}/reviews")]
        public async Task<ActionResult<UserReviewsSummaryDto>> GetUserReviews(string userId)
        {
            if (!Guid.TryParse(userId, out var reviewedUserId))
                return BadRequest(_localizer["InvalidUserId"]);

            var user = await _unitOfWork.Users.GetByIdAsync(reviewedUserId);
            if (user == null)
                return NotFound(_localizer["UserNotFound"]);

            var reviews = (await _unitOfWork.Reviews.GetReviewsForUserAsync(reviewedUserId)).ToList();

            var dtoList = reviews.Select(r => new ReviewDto
            {
                ReviewerName = r.Reviewer.FullName,
                ReviewerPhotoUrl = r.Reviewer.ProfilePictureUrl,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            }).ToList();

            var summary = new UserReviewsSummaryDto
            {
                TotalReviews = dtoList.Count,
                AverageRating = dtoList.Any() ? Math.Round((decimal)dtoList.Sum(r => r.Rating) / dtoList.Count, 2) : 0,
                Reviews = dtoList
            };

            return Ok(summary);
        }

        [Authorize]
        [HttpPost("{userId}/reviews")]
        [HttpPost("users/{userId}/reviews")]
        public async Task<IActionResult> AddReview(string userId, [FromBody] CreateReviewDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!Guid.TryParse(userId, out var reviewedUserId))
                return BadRequest(_localizer["InvalidUserId"]);

            var reviewerId = GetUserId();

            if (reviewerId == reviewedUserId)
                return BadRequest(_localizer["CannotReviewYourself"]);

            var reviewedUser = await _unitOfWork.Users.GetByIdAsync(reviewedUserId);
            if (reviewedUser == null)
                return NotFound(_localizer["UserNotFound"]);

            if (dto.Rating < 1 || dto.Rating > 5)
                return BadRequest(_localizer["InvalidRating"]);

            // Check existing review
            var exists = await _unitOfWork.Reviews.HasReviewAsync(reviewerId, reviewedUserId);
            if (exists)
                return BadRequest(_localizer["ReviewAlreadyExists"]);

            var review = new Talaqi.Domain.Entities.Review
            {
                ReviewerId = reviewerId,
                ReviewedUserId = reviewedUserId,
                Rating = dto.Rating,
                Comment = dto.Comment
            };

            await _unitOfWork.Reviews.AddAsync(review);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new { message = _localizer["ReviewAdded"] });
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                              ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            return Guid.Parse(userIdClaim ?? throw new UnauthorizedAccessException());
        }
    }
}

