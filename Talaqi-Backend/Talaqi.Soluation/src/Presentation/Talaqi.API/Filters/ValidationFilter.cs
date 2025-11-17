using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Talaqi.API.Filters
{
    public class ValidationFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                var errors = context.ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .SelectMany(x => x.Value!.Errors.Select(e => e.ErrorMessage))
                    .ToList();

                var result = new
                {
                    isSuccess = false,
                    message = "Validation failed",
                    errors = errors
                };

                context.Result = new BadRequestObjectResult(result);
            }
        }

        public void OnActionExecuted(ActionExecutedContext context) { }
    }
}