namespace Talaqi.Shared;

public class ErrorResponse
{
	public bool IsSuccess => false;
	public string Message { get; set; } = string.Empty;
	public List<string> Errors { get; set; } = new();
	public int StatusCode { get; set; }
	public string? TraceId { get; set; }

	public ErrorResponse(string message, int statusCode = 400)
	{
		Message = message;
		StatusCode = statusCode;
	}

	public ErrorResponse(string message, List<string> errors, int statusCode = 400)
	{
		Message = message;
		Errors = errors;
		StatusCode = statusCode;
	}
}