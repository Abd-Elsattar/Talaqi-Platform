namespace Talaqi.API.Common.Helpers
{
    public static class DateTimeHelper
    {
        public static DateTime ToEgyptTime(this DateTime utcDateTime)
        {
            var egyptTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Egypt Standard Time");
            return TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, egyptTimeZone);
        }

        public static string GetRelativeTime(this DateTime dateTime)
        {
            var timeSpan = DateTime.UtcNow - dateTime;

            if (timeSpan.TotalSeconds < 60)
                return "Just now";
            if (timeSpan.TotalMinutes < 60)
                return $"{(int)timeSpan.TotalMinutes} minute{(timeSpan.TotalMinutes > 1 ? "s" : "")} ago";
            if (timeSpan.TotalHours < 24)
                return $"{(int)timeSpan.TotalHours} hour{(timeSpan.TotalHours > 1 ? "s" : "")} ago";
            if (timeSpan.TotalDays < 7)
                return $"{(int)timeSpan.TotalDays} day{(timeSpan.TotalDays > 1 ? "s" : "")} ago";
            if (timeSpan.TotalDays < 30)
                return $"{(int)(timeSpan.TotalDays / 7)} week{(timeSpan.TotalDays / 7 > 1 ? "s" : "")} ago";
            if (timeSpan.TotalDays < 365)
                return $"{(int)(timeSpan.TotalDays / 30)} month{(timeSpan.TotalDays / 30 > 1 ? "s" : "")} ago";

            return $"{(int)(timeSpan.TotalDays / 365)} year{(timeSpan.TotalDays / 365 > 1 ? "s" : "")} ago";
        }
    }
}
