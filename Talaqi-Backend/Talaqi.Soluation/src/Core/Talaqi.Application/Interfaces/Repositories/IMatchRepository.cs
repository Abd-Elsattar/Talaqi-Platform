using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Domain.Entities;

namespace Talaqi.Application.Interfaces.Repositories
{
    public interface IMatchRepository : IBaseRepository<Match>
    {
        Task<IEnumerable<Match>> GetMatchesForUserAsync(Guid userId);
        Task<IEnumerable<Match>> GetMatchesByLostItemAsync(Guid lostItemID);
        Task<IEnumerable<Match>> GetMatchesByFoundItemAsync(Guid foundItemID);
        Task<IEnumerable<Match>> GetPendingMathcesAsync();
        Task<Match?> GetMatchByItemAsync(Guid lostItemId, Guid foundItemID);
    }
}
#region Exeplanation
//The provided code defines an interface called `IMatchRepository`,
//which is a part of the `Talaqi.Application.Interfaces.Repositories` namespace.
//This interface inherits from a base repository interface (`IBaseRepository<Match>`)
//and is specifically designed for handling operations related to "Match" entities.
//Here's a breakdown of what each method in this interface is intended to do:
//1. **`Task<IEnumerable<Match>> GetMatchesForUserAsync(Guid userId);`**:
//   - This method is asynchronous and returns a collection of matches (`IEnumerable<Match>`)
//   - that are associated with a specific user, identified by their unique `userId` (a `Guid`).
//2. **`Task<IEnumerable<Match>> GetMatchesByLostItemAsync(Guid lostItemID);`**:
//   - This asynchronous method is intended to return a collection of matches for a specific lost item,
//   - identified by the `lostItemID` (a `Guid`).
//3. **`Task<IEnumerable<Match>> GetMatchesByFoundItemAsync(Guid foundItemID);`**:
//   - Similar to the previous method, this one aims to retrieve matches related to a found item,
//   - specified by the `foundItemID` (a `Guid`).
//4. **`Task<IEnumerable<Match>> GetPendingMathcesAsync();`**:
//   - This method is designed to return a collection of pending matches.
//   - These matches could be awaiting some form of confirmation or finalization.
//5. **`Task<Match?> GetMatchByItemAsync(Guid lostItemId, Guid foundItemID);`**:
//   - This method retrieves a specific match based on a combination of a lost item
//   - (`lostItemId`) and a found item (`foundItemID`), both identified by their `Guid`.
//   - The method returns a single `Match` or `null` if no match is found.
//Overall, `IMatchRepository` provides a structured way to perform specific data retrieval operations related to "matches"
//in a system that likely involves pairing lost and found items through user interactions.
//The use of `Task` in the method signatures indicates that these operations are asynchronous,
//likely because they involve I/O operations such as database access. 
#endregion