using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Domain.Entities;

namespace Talaqi.Application.Interfaces.Repositories
{
    public interface IVerificationCodeRepository : IBaseRepository<VerificationCode>
    {
        Task<VerificationCode> GetValidCodeAsync(string email, string code, string purpose);
        Task InvalidateCodesForEmailAsync(string email, string purpose);
    }
}
//The `IVerificationCodeRepository` is an interface in C# that extends a base repository interface,
//`IBaseRepository`, tailored specifically to handle operations regarding `VerificationCode` entities.
//This indicates that `IVerificationCodeRepository`
//is designed to manage data access operations related to verification codes in an application.
//Here’s a breakdown of what each part of the interface does:
//1. **IBaseRepository<VerificationCode>**:
//   - This is the base repository interface that `IVerificationCodeRepository` extends.
//   It implies that the base operations (such as add, update, delete, and possibly get by ID)
//   are defined in `IBaseRepository`, and `IVerificationCodeRepository` inherits these operations.
//   The base repository is generic, with `VerificationCode` being the specific type it operates upon in this case.
//2. **Task<VerificationCode> GetValidCodeAsync(string email, string code, string purpose)**:
//   - This method is intended to asynchronously retrieve a valid verification code record
//   based on the given `email`, `code`, and `purpose`. 
//   - `Task<VerificationCode>` indicates that this method is asynchronous and will return a `VerificationCode`
//   object once the operation is complete.
//   - The method's purpose is to fetch a verification code that matches the provided parameters while also
//   checking that the code is still valid (e.g., not expired).
//3. **Task InvalidateCodesForEmailAsync(string email, string purpose)**:
//   - This method is intended to asynchronously
//   mark all verification codes associated with a given `email` and `purpose` as invalid.
//   - It returns a `Task`, indicating that it is an asynchronous operation that does not return a result upon completion. This is useful for situations where all previous verification codes for a specific email and purpose should be rendered unusable, potentially after a successful code validation or user action, to ensure a single-use or security policy.
//These method signatures suggest typical operations needed to handle verification codes,
//commonly used in user authentication and confirmation processes,
//such as email verification or password resets.
//The asynchronous nature of these methods (`async`) suggests that calls to these methods may involve I/O operations
//like database queries, which benefit from non-blocking execution to improve performance and responsiveness,
//particularly in web applications.