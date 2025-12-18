namespace Talaqi.Domain.Common
{
    public class Result
    {
        public bool IsSuccess { get; }
        public string Error { get; }
        public bool IsFailure => !IsSuccess;

        protected Result(bool isSuccess, string error)
        {
            if (isSuccess && error != string.Empty)
                throw new InvalidOperationException();
            if (!isSuccess && error == string.Empty)
                throw new InvalidOperationException();

            IsSuccess = isSuccess;
            Error = error;
        }

        public static Result Success()
        {
            return new Result(true, string.Empty);
        }

        public static Result Failure(string error)
        {
            return new Result(false, error);
        }
    }

    public class Result<T> : Result
    {
        public T Data { get; }

        protected Result(T data, bool isSuccess, string error)
            : base(isSuccess, error)
        {
            Data = data;
        }

        public static Result<T> Success(T data)
        {
            return new Result<T>(data, true, string.Empty);
        }

        public new static Result<T> Failure(string error)
        {
            return new Result<T>(default(T), false, error);
        }
    }
}
