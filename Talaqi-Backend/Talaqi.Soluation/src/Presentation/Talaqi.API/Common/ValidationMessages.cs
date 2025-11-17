namespace Talaqi.API.Common
{
    public static class ValidationMessages
    {
        public const string Required = "{PropertyName} is required";
        public const string MaxLength = "{PropertyName} must not exceed {MaxLength} characters";
        public const string MinLength = "{PropertyName} must be at least {MinLength} characters";
        public const string EmailFormat = "Invalid email format";
        public const string PhoneFormat = "Invalid phone number format";
    }
}
