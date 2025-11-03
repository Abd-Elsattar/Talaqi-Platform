using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Application.Interfaces.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }
        ILostItemRepository LostItems { get; }
        IFoundItemRepository FoundItems { get; }
        IMatchRepository Matches { get; }
        IVerificationCodeRepository VerificationCodes { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
//The `IUnitOfWork` interface represents a design pattern used in the context of database
//interactions to ensure that a series of operations either all succeed or fail together.
//This is particularly useful when multiple repositories are used,
//and changes must be committed in a transactionally-consistent manner.
//Here's a breakdown of what each part of this interface does:
//1. **Inherits from IDisposable**: The interface inherits from `IDisposable`,
//which means any implementation of this interface must provide a mechanism to release unmanaged resources
//or dispose of the unit of work properly. This is crucial for freeing up database connections or other resources.
//2. **Repositories**:
//   - `IUserRepository Users`: A repository for managing user-related data operations.
//   - `ILostItemRepository LostItems`: A repository for managing operations related to lost items.
//   - `IFoundItemRepository FoundItems`: A repository for managing operations related to found items
//   - `IMatchRepository Matches`: A repository for managing operations related to matches
//   (perhaps matching lost and found items).
//   - `IVerificationCodeRepository VerificationCodes`: A repository for managing operations related to verification codes.
//   Each repository is presumably an interface itself,
//   encapsulating CRUD operations for a specific type of data or entity.
//3. **Transactional Methods**:
//   - `Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)`:
//   This asynchronous method saves all changes made in the unit of work to the database,
//   returning the number of state entries written,
//   or could be modified to suit actual needs like returning success/failure status.
//   The `CancellationToken` allows the operation to be canceled midway.
//   - `Task BeginTransactionAsync()`: Asynchronously begins a database transaction.
//   This is necessary before making a series of database operations that need to be committed or rolled back as a single unit.
//   - `Task CommitTransactionAsync()`: Asynchronously commits all operations in the current transaction.
//   Once this method is called, all changes made during the transaction are saved permanently to the database.
//   - `Task RollbackTransactionAsync()`: Asynchronously rolls back all operations in the current transaction.
//   This effectively undoes all changes made during the transaction since the last commit.
//   This is critical for maintaining data integrity when an error occurs during a sequence of operations.
//In conclusion, the `IUnitOfWork` interface provides a blueprint for implementing a unit of work pattern,
//which helps ensure data consistency and integrity in applications that perform complex data
//manipulations across multiple repositories or data stores.
//It achieves this by coordinating saving changes, handling transactions,
//and managing lifecycle through encapsulating all interactions within a single unit of work entity.