using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Domain.Entities;

namespace Talaqi.Application.Interfaces.Repositories
{
    // Interface definition for a generic repository that operates on entities of type T
    public interface IBaseRepository<T> where T : BaseEntity
    {
        // Asynchronously retrieves an entity by its unique identifier (Guid)
        Task<T> GetByIdAsync(Guid id);

        // Asynchronously retrieves all entities of type T
        Task<IEnumerable<T>> GetAllAsync();

        // Asynchronously finds entities based on a specified predicate (condition)
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);

        // Asynchronously retrieves the first entity that matches the specified predicate, or returns null if no match
        Task<T?> FirstOrDefultAsync(Expression<Func<T, bool>> predicate);

        // Asynchronously adds a new entity to the repository and returns the added entity
        Task<T> AddAsync(T entity);

        // Asynchronously adds a collection of new entities to the repository and returns the added entities
        Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities);

        // Asynchronously updates an existing entity in the repository
        Task UpdateAsync(T entity);

        // Asynchronously deletes an entity from the repository using its identifier (int)
        Task DeleteAsync(int id);

        // Asynchronously counts the number of entities that satisfy a given predicate, with optional predicate
        Task<int> CountAsync(Expression<Func<T, bool>> predicate = null);

        // Asynchronously checks if any entities satisfy the given predicate
        Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);
    }
}