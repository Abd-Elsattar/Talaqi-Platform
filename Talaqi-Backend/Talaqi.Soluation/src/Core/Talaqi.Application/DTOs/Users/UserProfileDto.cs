using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Application.DTOs.Users
{
    //The `UserProfileDto` class is a Data Transfer Object (DTO) in C#. This type of object is typically used to transfer data between processes or systems, usually to simplify or structure data that needs to be sent across networks, services, or components in an application, especially when dealing with large quantities of data or complex structures.
    //Here's a breakdown of the properties within the `UserProfileDto` class:
    //1. **Id (Guid):** This is a unique identifier for each user profile, using the Guid (Globally Unique Identifier) data type. It's likely set by the system or application to ensure uniqueness across profiles.
    //2. **FirstName (string):** Stores the user's first name. It's initialized with an empty string to ensure it's never null.
    //3. **LastName (string):** Stores the user's last name, also initialized with an empty string for the same reason as the first name.
    //4. **Email (string):** Represents the user's email address, initialized to an empty string. Email is typically a crucial part of a user profile, often used for login or communication purposes.
    //5. **PhoneNumber (string):** Contains the user's phone number, also beginning as an empty string to prevent null reference errors.
    //6. **ProfilePictureUrl (string?):** This nullable string property can store the URL to the user's profile picture. The `?` denotes that this property can be null, recognizing that a user may not have uploaded a profile picture.
    //7. **CreatedAt (DateTime):** Captures the date and time when the user profile was created. This is useful for tracking when the profile was made or for auditing purposes.
    //8. **LostItemsCount (int):** An integer that likely tracks the number of items a user has lost. It's initialized to 0 by default.
    //9. **FoundItemsCount (int):** Another integer that probably stores the number of items a user has found. Like `LostItemsCount`, it also starts at 0.
    //This DTO structure makes it easy to handle and manipulate user profile data in a consistent and manageable way within an application, particularly in contexts like APIs, where such structured data objects are often used between the client and server.
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
