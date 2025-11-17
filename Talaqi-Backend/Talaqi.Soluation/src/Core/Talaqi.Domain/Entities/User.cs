using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;
namespace Talaqi.Domain.Entities
{
    public class User : BaseEntity
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }
        public string Role { get; set; } = "User"; // User, Admin
        public bool IsEmailVerified { get; set; }
        public bool IsActive { get; set; } = true;

        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }

        // Navigation Properties
        public virtual ICollection<LostItem> LostItems { get; set; } = new List<LostItem>();
        public virtual ICollection<FoundItem> FoundItems { get; set; } = new List<FoundItem>();

        public string FullName => $"{FirstName} {LastName}";
    }
}