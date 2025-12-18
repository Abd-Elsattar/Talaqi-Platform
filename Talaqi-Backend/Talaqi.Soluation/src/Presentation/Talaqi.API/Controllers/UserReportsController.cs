using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Talaqi.Application.Interfaces.Services;
using Talaqi.Application.DTOs.Reports;
using Talaqi.API.Common.Extensions;

namespace Talaqi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserReportsController : ControllerBase
    {
        private readonly IUserReportService _reportService;

        public UserReportsController(IUserReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateReport([FromBody] CreateUserReportDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var reporterId = User.GetUserId();
            var result = await _reportService.CreateReportAsync(dto, reporterId);

            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("for-user/{reportedUserId}")]
        public async Task<IActionResult> GetReportsForUser(Guid reportedUserId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            var userId = User.GetUserId();
            // Only the reported user or admins can view these reports
            if (userId != reportedUserId && !User.IsAdmin())
                return Forbid();

            var result = await _reportService.GetReportsForUserAsync(reportedUserId, page, pageSize);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("admin/list")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminList([FromQuery] int page = 1, [FromQuery] int pageSize = 50, [FromQuery] Guid? reportedUserId = null, [FromQuery] Guid? reporterId = null, [FromQuery] int? reason = null)
        {
            var result = await _reportService.AdminListReportsAsync(page, pageSize, reportedUserId, reporterId, reason);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }
    }
}
