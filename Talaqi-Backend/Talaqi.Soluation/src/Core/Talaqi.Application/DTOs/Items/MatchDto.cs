using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Application.DTOs.Items
{
    //The `MatchDto` class is a Data Transfer Object (DTO) used to represent data for a match between a lost item and a found item. This class is typically used in applications that deal with matching lost and found items, allowing for easy movement of match-related data between different parts of the application, such as from a database to a client-side application.
    //Here's a breakdown of the components of the `MatchDto` class:
    //1. **Id**: This is a unique identifier for each match. It uses a `Guid` (Globally Unique Identifier), ensuring that each match has a unique identity within the system.
    //2. **LostItemId**: This is a `Guid` that serves as a reference to the lost item involved in the match. It links to an item reported lost.
    //3. **FoundItemId**: Similarly, this is a `Guid` that refers to the found item in the match, linking to an item reported found.
    //4. **ConfidenceScore**: A `decimal` value that indicates how likely it is that the lost and found items are a true match. Higher scores suggest greater confidence in the match accuracy.
    //5. **Status**: A `string` that denotes the current state of the match. It could represent various states, such as "Pending", "Confirmed", or "Rejected". By default, this is initialized as an empty string.
    //6. **CreatedAt**: This `DateTime` field records when the match was created, which helps in tracking the history and timing of matches.
    //7. **LostItem**: This is a nullable reference to a `LostItemDto` object that holds detailed information about the lost item. The use of nullable (`?`) suggests that this property might not always have a value, possibly because it hasn't been retrieved or is optional in certain contexts.
    //8. **FoundItem**: Similarly, this is a nullable reference to a `FoundItemDto` object containing detailed data about the found item.
    //Overall, the `MatchDto` class encapsulates all the necessary information to describe a potential match between a lost and found item, facilitating operations like creating, updating, and displaying match details in a structured and efficient manner.
    public class MatchDto
    {
        public Guid Id { get; set; }
        public Guid LostItemId { get; set; }
        public Guid FoundItemId { get; set; }
        public decimal ConfidenceScore { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public LostItemDto? LostItem { get; set; }
        public FoundItemDto? FoundItem { get; set; }
    }
}
