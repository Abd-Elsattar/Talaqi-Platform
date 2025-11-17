using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Talaqi.Application.Interfaces.Repositories;

namespace Talaqi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public AdminController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20)
        {
            var users = await _unitOfWork.Users.GetAllUsersAsync();
            var totalCount = await _unitOfWork.Users.CountAsync();

            var paginatedUsers = users
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new
                {
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.PhoneNumber,
                    u.Role,
                    u.IsActive,
                    u.CreatedAt
                })
                .ToList();

            return Ok(new
            {
                items = paginatedUsers,
                pageNumber,
                pageSize,
                totalCount,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }

        [HttpGet("statistics")]
        public async Task<IActionResult> GetStatistics()
        {
            var totalUsers = await _unitOfWork.Users.CountAsync();
            var activeUsers = await _unitOfWork.Users.CountAsync(u => u.IsActive);
            var totalLostItems = await _unitOfWork.LostItems.CountAsync();
            var totalFoundItems = await _unitOfWork.FoundItems.CountAsync();
            var totalMatches = await _unitOfWork.Matches.CountAsync();
            var pendingMatches = await _unitOfWork.Matches
                .CountAsync(m => m.Status == Domain.Enums.MatchStatus.Pending);

            var stats = new
            {
                users = new
                {
                    total = totalUsers,
                    active = activeUsers
                },
                items = new
                {
                    lost = totalLostItems,
                    found = totalFoundItems
                },
                matches = new
                {
                    total = totalMatches,
                    pending = pendingMatches
                }
            };

            return Ok(stats);
        }

        [HttpGet("items")]
        public async Task<IActionResult> GetAllItems(
            [FromQuery] string type = "lost",
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20)
        {
            if (type.ToLower() == "lost")
            {
                var items = await _unitOfWork.LostItems.GetAllLostItemsAsync();
                var totalCount = await _unitOfWork.LostItems.CountAsync();

                var paginatedItems = items
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(i => new
                    {
                        i.Id,
                        i.Title,
                        i.Category,
                        i.Status,
                        userName = i.User.FullName,
                        i.CreatedAt
                    })
                    .ToList();

                return Ok(new
                {
                    items = paginatedItems,
                    pageNumber,
                    pageSize,
                    totalCount,
                    totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                });
            }
            else
            {
                var items = await _unitOfWork.FoundItems.GetAllFoundItemsAsync();
                var totalCount = await _unitOfWork.FoundItems.CountAsync();

                var paginatedItems = items
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(i => new
                    {
                        i.Id,
                        i.Title,
                        i.Category,
                        i.Status,
                        userName = i.User.FullName,
                        i.CreatedAt
                    })
                    .ToList();

                return Ok(new
                {
                    items = paginatedItems,
                    pageNumber,
                    pageSize,
                    totalCount,
                    totalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                });
            }
        }

        [HttpPut("users/{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(Guid id, [FromBody] UpdateUserStatusDto dto)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);

            if (user == null)
                return NotFound("User not found");

            user.IsActive = dto.IsActive;
            user.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();

            return Ok(new { message = "User status updated successfully" });
        }
    }

    public class UpdateUserStatusDto
    {
        public bool IsActive { get; set; }
    }
}

