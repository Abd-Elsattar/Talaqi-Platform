using System.Text.RegularExpressions;

namespace Talaqi.API.Common.Helpers
{
    public static class ValidationHelper
    {
        public static bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            try
            {
                var regex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
                return regex.IsMatch(email);
            }
            catch
            {
                return false;
            }
        }

        public static bool IsValidPhoneNumber(string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber))
                return false;

            var regex = new Regex(@"^(?:\+?20)?1[0-2,5]\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        public static bool IsValidGuid(string guidString)
        {
            return Guid.TryParse(guidString, out _);
        }

        public static bool IsValidImageUrl(string url)
        {
            if (string.IsNullOrWhiteSpace(url))
                return false;

            if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
                return false;

            var validExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            return validExtensions.Any(ext => uri.AbsolutePath.EndsWith(ext, StringComparison.OrdinalIgnoreCase));
        }
    }
}
