using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Application.DTOs.Items
{
    //The `CreateLostItemDto` is a Data Transfer Object (DTO) used in programming, specifically in C#. This DTO is likely part of an application dealing with lost items, allowing users to report items they have lost. Let's break down each component of the class:
    //1. **Category (string):**
    //   - This property is used to specify the category or type of the lost item. It is initialized with an empty string.
    //2. **Title (string):**
    //   - This property holds the title or name of the lost item. It is also initialized with an empty string.
    //3. **Description (string):**
    //   - This property provides a detailed description of the lost item. It is initialized with an empty string, suggesting that it is mandatory or frequently used.
    //4. **ImageUrl (string?):**
    //   - This property optionally holds a URL to an image of the lost item. The use of a nullable type (indicated by the question mark `?`) suggests that an image is not mandatory; it can either contain a string (URL) or be null.
    //5. **Location (LocationDto):**
    //   - This property holds a location object of type `LocationDto`, which presumably contains information about where the item was lost. It is initialized with a new instance of `LocationDto`, indicating its necessity.
    //6. **DateLost (DateTime):**
    //   - This property stores the date on which the item was lost. DateTime is a structure representing dates and times. This property is likely important for timing and searching functionality within the application's context.
    //7. **ContactInfo (string):**
    //   - This property is meant for contact information of the person who lost the item. Like other string properties, it is initialized with an empty string, implying its essential role in the application for communication purposes.
    //In the context of an application, this DTO would be used to collect and transfer data related to a lost item from one part of the application to another, such as from a user input form to a database or a backend service handling lost item reports. Its primary purpose is to encapsulate the details of a lost item comprehensively and efficiently.
    public class CreateLostItemDto
    {
        public string Category { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public LocationDto Location { get; set; } = new();
        public DateTime DateLost { get; set; }
        public string ContactInfo { get; set; } = string.Empty;
    }
}