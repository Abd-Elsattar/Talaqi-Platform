using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using Talaqi.API.Hubs;
using Talaqi.Application.DTOs.Reports;
using Talaqi.Application.Interfaces.Services;
using Talaqi.Domain.Enums;

namespace Talaqi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;
        private readonly IHubContext<ChatHub> _hubContext;

        public ReportsController(IReportService reportService, IHubContext<ChatHub> hubContext)
        {
            _reportService = reportService;
            _hubContext = hubContext;
        }

        [HttpPost]
        public async Task<IActionResult> CreateReport([FromBody] CreateReportDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var result = await _reportService.CreateReportAsync(Guid.Parse(userId), dto);

            if (!result.IsSuccess)
                return BadRequest(result);

            // Notify Admins
            await _hubContext.Clients.Group("Admins").SendAsync("ReceiveNewReport", new 
            { 
                Id = result.Data, 
                Reason = dto.Reason, 
                TargetType = dto.TargetType,
                CreatedAt = DateTime.UtcNow
            });

            return Ok(result);
        }

        [HttpGet("my-reports")]
        public async Task<IActionResult> GetMyReports([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var filter = new ReportFilterDto
            {
                ReporterId = Guid.Parse(userId),
                Page = page,
                PageSize = pageSize
            };

            var result = await _reportService.GetReportsAsync(filter);
            return Ok(result);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetReports([FromQuery] ReportFilterDto filter)
        {
            var result = await _reportService.GetReportsAsync(filter);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetReport(Guid id)
        {
            var result = await _reportService.GetReportAsync(id);
            if (!result.IsSuccess) return NotFound(result);
            return Ok(result);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateReportStatusDto dto)
        {
            var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(adminId)) return Unauthorized();

            var result = await _reportService.UpdateReportStatusAsync(id, Guid.Parse(adminId), dto);

            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }
    }
}
