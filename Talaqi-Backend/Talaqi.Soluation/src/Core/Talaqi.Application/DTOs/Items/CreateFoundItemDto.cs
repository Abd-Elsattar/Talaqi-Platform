using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Application.DTOs.Items
{
    //The `CreateFoundItemDto` class is a Data Transfer Object (DTO) used in software development to encapsulate data that is required to create a record of a found item. This model is typically utilized in applications where users report found items, such as a lost and found system.
    //Here's a breakdown of each component:
    //1. **Category (string)**: 
    //   - Represents the category or type of the found item, such as "Electronics", "Clothing", "Jewelry", etc.
    //   - Initialized to an empty string to ensure it's not null when the object is instantiated.
    //2. **Title (string)**: 
    //   - A short, descriptive title for the item.
    //   - Example: "Black Wallet with Silver Trim".
    //   - Also initialized to an empty string.
    //3. **Description (string)**: 
    //   - Provides detailed information about the found item, such as unique features, markings, or inscriptions.
    //4. **ImageUrl (string?)**: 
    //   - An optional property that can hold a URL link to an image of the item.
    //   - Marked as nullable (indicated by the `?`), meaning it can be null if no image is available.
    //5. **Location (LocationDto)**: 
    //   - An instance of `LocationDto`, a separate DTO likely containing properties to describe where the item was found. 
    //   - Automatically instantiated to avoid null references and ensure the property is always accessible.
    //6. **DateFound (DateTime)**: 
    //   - Captures the date (and possibly the time) the item was found. 
    //   - This allows tracking of when the item was picked up and may help in the retrieval process by matching it with reports of lost items.
    //7. **ContactInfo (string)**: 
    //   - Provides contact details of the person or organization that found the item, so the rightful owner can get in touch.
    //   - This might include a phone number, email address, or other relevant contact method.
    //In context, the `CreateFoundItemDto` is designed to safely and efficiently transfer the necessary data required to register a found item, ensuring all critical fields are handled appropriately during creation. The use of default values for strings and initializing the `Location` object helps prevent common coding errors related to null references. Overall, DTOs like this one facilitate clean and organized data flow in software systems, specifically within API requests and responses.
    public class CreateFoundItemDto
    {
        public string Category { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public LocationDto Location { get; set; } = new();
        public DateTime DateFound { get; set; }
        public string ContactInfo { get; set; } = string.Empty;
    }
}
