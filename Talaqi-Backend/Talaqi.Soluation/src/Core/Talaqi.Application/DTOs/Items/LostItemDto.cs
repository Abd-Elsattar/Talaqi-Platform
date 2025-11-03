using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Application.DTOs.Items
{
    //The `LostItemDto` class is a data transfer object (DTO) used to encapsulate information about a lost item. The purpose of a DTO is typically to transport data between different layers or processes in an application, without embedding complex business logic. Here is a breakdown of what each property in the `LostItemDto` class represents:
    //1. **Id (Guid)**: A unique identifier for the lost item. It is of type `Guid`, which provides a globally unique identifier.
    //2. **UserId (Guid)**: This is the unique identifier for the user who reported the lost item. It is also of type `Guid`.
    //3. **UserName (string)**: The name of the user who reported the lost item. It defaults to an empty string if not set.
    //4. **UserProfilePicture (string)**: A URL or path to the user's profile picture. This defaults to an empty string if not provided.
    //5. **Category (string)**: Category of the lost item, such as "electronics", "clothing", etc. Defaults to an empty string.
    //6. **Title (string)**: A brief title describing the lost item. It defaults to an empty string if not set.
    //7. **Description (string)**: A detailed description of the lost item. 
    //8. **ImageUrl (string?)**: An optional URL to an image of the lost item. This is nullable, indicated by the question mark (`?`).
    //9. **Location (LocationDto)**: This property represents the location where the item was lost. `LocationDto` is likely another class or structure that contains detailed information about location, such as latitude, longitude, or a particular address.
    //10. **DateLost (DateTime)**: The date and time when the item was lost.
    //11. **ContactInfo (string)**: Contact information for the user who reported the lost item, such as an email address or phone number.
    //12. **Status (string)**: The current status of the lost item, such as "lost", "found", "resolved", etc.
    //13. **CreateAt (DateTime)**: The date and time when the lost item record was created.
    //14. **MatchCount (int)**: A count of how many times this lost item might have been matched with found items by the system, suggesting possible connections/resolutions.
    //Overall, the `LostItemDto` class is well-suited for applications dealing with lost and found items, enabling easy exchange of relevant information about a lost item between different parts of an application or system.
    public class LostItemDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserProfilePicture { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public LocationDto Location { get; set; } = new();
        public DateTime DateLost { get; set; }
        public string ContactInfo { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreateAt { get; set; }
        public int MatchCount { get; set; }
    }
}
