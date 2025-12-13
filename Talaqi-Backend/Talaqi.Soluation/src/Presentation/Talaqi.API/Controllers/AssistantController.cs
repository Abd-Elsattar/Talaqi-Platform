using Microsoft.AspNetCore.Mvc;
using Talaqi.Application.Common;
using Talaqi.Application.Rag.Assistant;

namespace Talaqi.API.Controllers
{
    [ApiController]
    [Route("api/assistant")]
    [Consumes("application/json")]
    [Produces("application/json")]
    public class AssistantController : ControllerBase
    {
        private readonly IAssistantService _assistant;
        public AssistantController(IAssistantService assistant) { _assistant = assistant; }

        [HttpPost("ask")]
        public async Task<ActionResult> Ask([FromBody] AskAssistantRequestDto dto, CancellationToken ct)
        {
            Response.ContentType = "application/json; charset=utf-8";
            var resp = await _assistant.AskAsync(dto, ct);
            var payload = Result<AskAssistantResponseDto>.Success(resp);
            var json = System.Text.Json.JsonSerializer.Serialize(payload, new System.Text.Json.JsonSerializerOptions
            {
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase
            });
            var bytes = System.Text.Encoding.UTF8.GetBytes(json);
            await Response.Body.WriteAsync(bytes, 0, bytes.Length, ct);
            return new EmptyResult();
        }
    }
}
