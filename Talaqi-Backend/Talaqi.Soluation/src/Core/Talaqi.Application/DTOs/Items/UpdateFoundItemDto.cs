using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Application.DTOs.Items
{
    //The `UpdateFoundItemDto` class is a data transfer object (DTO) in C#. DTOs are used to encapsulate data and transfer it between different parts of a program, especially between the client and the server in web applications. This particular DTO is likely used to manage information related to updating a found item, probably within a lost-and-found system.
    //Here's a breakdown of the properties in the `UpdateFoundItemDto` class:
    //1. **Title (string):** This property holds the title or name of the found item. It is initialized to an empty string by default, meaning if no value is provided, it will contain an empty string.
    //2. **Description (string):** This is used to store a detailed description of the found item. Like the `Title`, it is also initialized with an empty string by default.
    //3. **ImageUrl (string?):** This nullable property is meant to store the URL of an image of the found item. By being nullable (indicated by the `?`), it allows the value to be set to `null`, indicating that an image URL is optional or may not be available.
    //4. **Location (LocationDto):** This property represents the location where the item was found. It uses another DTO, `LocationDto`, implying that location details are encapsulated in a separate class. The property is initialized with a new instance of `LocationDto`, ensuring it is not `null`.
    //5. **ContactInfo (string):** This property contains contact information for the person or entity who found the item, which could include a phone number, email, or other contact details. It defaults to an empty string.
    //6. **Status (string):** This property reflects the current status of the found item, which could represent whether the item has been returned, claimed, or still awaiting collection. It is initialized with an empty string by default.
    //Overall, this DTO is designed to facilitate the transfer of information when updating details about found items, helping to keep data organized and ensuring the client-side and server-side have a consistent structure for handling such updates.
    public class UpdateFoundItemDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public LocationDto Location { get; set; } = new();
        public string ContactInfo { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
