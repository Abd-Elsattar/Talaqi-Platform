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
        public string PassWordHash { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }
        public string Role { get; set; } = "User"; // User, Admin
        public bool IsEmailVerified { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation Properties
        public virtual ICollection<LostItem> LostItems { get; set; } = new List<LostItem>();
        public virtual ICollection<FoundItem> FoundItems { get; set; } = new List<FoundItem>();

        public string FullName => $"{FirstName} {LastName}";
    }
}
/***************************************************************
 *  User Entity
 * 
 * هنا يا معلم عاملين الـ User Model الأساسي اللي بيمثل أي مستخدم في النظام.
 * الفكرة إن ده الـ Account اللي من خلاله الشخص يقدر يبلغ عن Lost أو Found Items.
 *
 * ليه موروث من BaseEntity؟
 * - علشان ناخد نفس الـ Metadata (Id, CreatedAt, UpdatedAt, IsDeleted)
 *
 *  ليه فصلناه عن Authentication System؟
 * - عشان الـ Domain Model يكون مستقل عن أي Identity Provider
 * - نقدر نستخدمه مع JWT, OAuth, IdentityServer أو حتى Custom Auth
 *
 *  ليه عندنا Navigation Properties؟
 * - User ممكن يبلّغ عن Lost Items أو Found Items
 * - فعملنا علاقات One-to-Many مع LostItem و FoundItem
 *
 * NOTE: Password هنا متخزّن كـ Hash مش Plain Text (security best practice)
 */