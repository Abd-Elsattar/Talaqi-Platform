using System.Net;
using System.Text.Json;

namespace Talaqi.API.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(
            RequestDelegate next,
            ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");

                context.Response.StatusCode = 500;
                context.Response.ContentType = "application/json; charset=utf-8";

                var payload = new
                {
                    isSuccess = false,
                    message = "حدث خطأ أثناء معالجة الطلب",
                    errors = new[] { ex.Message }
                };

                var json = JsonSerializer.Serialize(payload,
                    new JsonSerializerOptions
                    {
                        Encoder = System.Text.Encodings.Web
                            .JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                    });

                await context.Response.WriteAsync(json);
            }
        }
    }
}
