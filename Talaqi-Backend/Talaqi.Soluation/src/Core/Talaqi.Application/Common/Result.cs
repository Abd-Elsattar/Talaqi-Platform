
namespace Talaqi.Application.Common
{
    public class Result<T>
    {
        public bool IsSuccess { get; set; }
        public T? Data { get; set; }
        public string? Message { get; set; }
        public int StatusCode { get; set; }
        public List<string> Errors { get; set; } = new();

        public static Result<T> Success(T data, string? message = null)
        {
            return new Result<T>
            {
                IsSuccess = true,
                Data = data,
                Message = message
            };
        }

        public static Result<T> Failure(string message, List<string>? errors = null)
        {
            return new Result<T>
            {
                IsSuccess = false,
                Message = message,
                Errors = errors ?? new List<string>()
            };
        }
        public static Result<T> FromCondition(bool condition, T data, string successMsg, string failureMsg)
            => condition ? Success(data, successMsg) : Failure(failureMsg);

    }


    public class Result
    {
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
        public List<string> Errors { get; set; } = new();

        public static Result Success(string? message = null)
        {
            return new Result
            {
                IsSuccess = true,
                Message = message
            };
        }

        public static Result Failure(string message, List<string>? errors = null)
        {
            return new Result
            {
                IsSuccess = false,
                Message = message,
                Errors = errors ?? new List<string>()
            };
        }
    }
}