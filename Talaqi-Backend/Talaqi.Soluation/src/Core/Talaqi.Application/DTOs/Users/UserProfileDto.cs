namespace Talaqi.Application.DTOs.Users
{
    public class UserProfileDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public int LostItemsCount { get; set; }
        public int FoundItemsCount { get; set; }
    }
}
