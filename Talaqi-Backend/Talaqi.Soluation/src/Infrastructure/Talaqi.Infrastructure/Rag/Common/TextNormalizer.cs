using System.Text;
using System.Text.RegularExpressions;

namespace Talaqi.Infrastructure.Rag.Common
{
    /// <summary>
    /// Utility for normalizing text before embedding generation.
    /// </summary>
    public static class TextNormalizer
    {
        public static string Normalize(string? input)
        {
            if (string.IsNullOrWhiteSpace(input)) return string.Empty;
            var text = input.Trim();
            text = text.ToLowerInvariant();
            text = Regex.Replace(text, "\\s+", " ");
            return text;
        }

        public static string BuildItemText(
            string title,
            string description,
            string? category,
            string? city,
            string? governorate)
        {
            var sb = new StringBuilder();
            if (!string.IsNullOrWhiteSpace(title)) sb.AppendLine(title);
            if (!string.IsNullOrWhiteSpace(description)) sb.AppendLine(description);
            if (!string.IsNullOrWhiteSpace(category)) sb.AppendLine($"?????: {category}");
            if (!string.IsNullOrWhiteSpace(city)) sb.AppendLine($"???????: {city}");
            if (!string.IsNullOrWhiteSpace(governorate)) sb.AppendLine($"????????: {governorate}");
            return Normalize(sb.ToString());
        }
    }
}
