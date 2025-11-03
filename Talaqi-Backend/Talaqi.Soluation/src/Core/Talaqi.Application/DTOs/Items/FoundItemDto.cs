using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Application.DTOs.Items
{
    //The given code defines a class in C# named `FoundItemDto`. This class appears to be a Data Transfer Object (DTO), which is commonly used in software development to transfer data between different parts of a program, often across network boundaries or between layers in an application. Here's a breakdown of what each property represents:
    //1. **Id (Guid):** This is a unique identifier for the found item. GUIDs are commonly used for entities to ensure uniqueness across different systems.
    //2. **UserId (Guid):** This represents the unique identifier of the user who found the item. Like the `Id`, it's a GUID.
    //3. **UserName (string):** The name of the user who found the item. This property uses a string and is initialized to an empty string by default.
    //4. **Category (string):** The category of the found item, which helps in classifying what kind of item it is. Initialized to an empty string by default.
    //5. **Title (string):** A title for the found item. This gives a quick summary or name to the found item. Also initialized to an empty string by default.
    //6. **Description (string):** A more detailed description of the found item. As with the others, it's initialized to an empty string by default.
    //7. **ImageUrl (string?):** A URL to an image of the found item. The question mark (?) indicates that this property is nullable, meaning it can contain a null value if there's no image available.
    //8. **Location (LocationDto):** This property represents where the item was found and is of type `LocationDto`, implying there's another class or struct named `LocationDto` that contains location-related data. It is initialized with a new instance of `LocationDto`.
    //9. **DateFound (DateTime):** A `DateTime` property representing the date when the item was found.
    //10. **ContactInfo (string):** Information on how to contact the person who found the item, and it's initialized as an empty string.
    //11. **Status (string):** Represents the current status of the found item, possibly indicating if it's been returned to its owner, still held by the finder, etc. This is also initialized as an empty string.
    //12. **CreatedAt (DateTime):** Stores the date and time when the found item record was created. This helps in tracking when the entry was first made.
    //Overall, the `FoundItemDto` class is designed to encapsulate all necessary information about a found item, most likely as part of a lost and found application or similar service. The use of initialized empty strings and nullable types helps in preventing null reference exceptions and provides a standard default state for new instances of this class.
    public class FoundItemDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public LocationDto Location { get; set; } = new();
        public DateTime DateFound { get; set; }
        public string ContactInfo { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
