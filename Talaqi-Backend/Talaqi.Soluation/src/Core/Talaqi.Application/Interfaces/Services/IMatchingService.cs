using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Application.Common;
using Talaqi.Application.DTOs.Items;

namespace Talaqi.Application.Interfaces.Services
{
    //The `IMatchingService` interface defines a contract for a matching service in a C# application, likely dealing with a system for managing found items and trying to match them with potential owners or reporters of lost items. Let's break down what each method does: 
    //1. **FindMatchesForFoundItemAsync(Guid foundItemId):**
    //   - This is an asynchronous method that takes in a `Guid` representing the unique identifier of a found item.
    //   - It returns a `Task` encapsulating a `Result` object, which contains a list of `MatchDto` objects. 
    //   - The purpose of this method is to find all potential matches for a specific found item based on its ID.
    //2. **GetUserMatchesAsync(Guid userId):**
    //   - This asynchronous method takes a `Guid` which identifies a user.
    //   - It returns a `Task` that results in a `Result` object containing a list of `MatchDto` objects.
    //   - The method is meant to retrieve all matches associated with a particular user. This could include matches for items they have reported lost or possibly items they have found.
    //3. **GetMatchByIdAsync(Guid matchId):**
    //   - This method takes a `Guid` representing the unique identifier of a match.
    //   - It returns a `Task` that resolves to a `Result` containing a single `MatchDto`.
    //   - It is intended to fetch detailed information about a specific match based on its ID.
    //4. **UpdateMatchStatusAsync(Guid matchId, string status, Guid userId):**
    //   - This method takes three parameters: a `Guid` for the match ID, a `string` representing the new status of the match, and a `Guid` for the user ID performing the update.
    //   - It returns a `Task` with a `Result`, but not necessarily a specific data object (it could just be a status of the update operation itself).
    //   - The purpose is to update the status of a particular match, possibly confirming, rejecting, or marking it as resolved, based on actions taken by the user.
    //Overall, this interface seems to be part of a broader service dealing with lost and found protocols, managing how items are matched and ensuring users can interact with these records efficiently. Using `Task` indicates that operations are asynchronous, which is typical in applications that might involve database queries or other IO-bound operations. The use of `Result<T>` suggests that the operations also account for failure/success outcomes in their execution.
    public interface IMatchingService
    {
        Task<Result<List<MatchDto>>> FindMatchesForFoundItemAsync(Guid foundItemId);
        Task<Result<List<MatchDto>>> GetUserMatchesAsync(Guid userId);
        Task<Result<MatchDto>> GetMatchByIdAsync(Guid matchId);
        Task<Result> UpdateMatchStatusAsync(Guid matchId, string status, Guid userId);
    }
}
