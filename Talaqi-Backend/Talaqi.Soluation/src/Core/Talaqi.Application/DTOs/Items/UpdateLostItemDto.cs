using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Application.DTOs.Items
{
    //The `UpdateLostItemDto` class is a Data Transfer Object (DTO) typically used in applications to encapsulate and transfer data between processes or layers, such as between the user interface and a backend service. This specific class is designed to handle the updating of lost item information. Here's a breakdown of its properties:
    //1. **Title (string):** This property holds the title or name of the lost item. It is initialized with an empty string, ensuring it is not null and has a default value if not set explicitly.
    //2. **Description (string):** This property contains a description of the lost item, providing more details about it. Like the title, it defaults to an empty string.
    //3. **ImageUrl (string?):** This nullable property stores the URL to an image associated with the lost item. The question mark `?` denotes that this property is nullable, meaning it can hold a string or be null, indicating that an image may not be provided for every lost item.
    //4. **Location (LocationDto):** This property references another data transfer object, `LocationDto`, which presumably contains information about the location related to the lost item. It is instantiated with a new object, ensuring it is always initialized.
    //5. **ContactInfo (string):** This property is meant to store the contact information of the person who can be reached regarding the lost item. It can include details like a phone number, email address, or other relevant contact methods. It defaults to an empty string.
    //6. **Status (string):** This property holds the current status of the lost item, such as "lost," "found," "returned," or any other status relevant to the tracking of the item. It is also initialized with an empty string.
    //These properties combined allow the `UpdateLostItemDto` class to easily convey the necessary information needed to update the status and details of a lost item in an application. It provides a structured and consistent way to manage such updates within a system.
    public class UpdateLostItemDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public LocationDto Location { get; set; } = new();
        public string ContactInfo { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
