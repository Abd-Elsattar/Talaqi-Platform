using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Talaqi.Domain.Entities;
using Talaqi.Infrastructure.Data;
using Talaqi.Infrastructure.Data.Configuration;

namespace Talaqi.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        // Constructor that accepts DbContextOptions and passes it to the base class constructor
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // DbSet properties for each entity
        public DbSet<User> Users { get; set; }
        public DbSet<LostItem> LostItems { get; set; }
        public DbSet<FoundItem> FoundItems { get; set; }
        public DbSet<Match> Matches { get; set; }

        // Property to access VerificationCode DbSet using method syntax
        public DbSet<VerificationCode> verificationCodes => Set<VerificationCode>();

        // Method to configure the model with custom configurations
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Call the base implementation of OnModelCreating
            base.OnModelCreating(modelBuilder);

            // Apply custom configurations for each entity
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new LostItemConfiguration());
            modelBuilder.ApplyConfiguration(new FoundItemConfiguration());
            modelBuilder.ApplyConfiguration(new MatchConfiguration());
            modelBuilder.ApplyConfiguration(new VerificationCodeConfiguration());

            // Global query filters for soft deletion, excluding entities marked as deleted
            modelBuilder.Entity<User>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<LostItem>().HasQueryFilter(e => !e.IsDeleted);
            modelBuilder.Entity<FoundItem>().HasQueryFilter(e => !e.IsDeleted);
        }

        // Override SaveChangesAsync to handle additional logic during save operations
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // Retrieve tracked entities that derive from BaseEntity
            var entries = ChangeTracker.Entries<BaseEntity>();

            // Iterate through each entity entry to perform custom logic based on entity state
            foreach (var entry in entries)
            {
                // If the entity is being added, set creation date and generate a new GUID for Id
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreateAt = DateTime.UtcNow;
                    entry.Entity.Id = Guid.NewGuid();
                }
                // If the entity is being modified, update the modification date
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                }
            }

            // Call the base implementation of SaveChangesAsync
            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
// The code you provided is an implementation of a class named `ApplicationDbContext` which extends `DbContext` from the Entity Framework Core library. This class is specifically designed to interact with a database in the context of an application named Talaqi. Here’s a detailed breakdown of its components and functionality:
//1. **Constructor**:
//   - The constructor takes `DbContextOptions<ApplicationDbContext>` as a parameter and passes it to the base class `DbContext` constructor. This setup allows for configuring the database connection and other options externally (e.g., in a startup class or configuration file).
//2. **DbSet Properties**:
//   - `DbSet<T>` properties represent tables in the database. Here, `Users`, `LostItems`, `FoundItems`, `Matches`, and `VerificationCodes` correspond to tables in the database. 
//   - For each entity (e.g., `User`, `LostItem`), there is a `DbSet` which acts like a collection, providing LINQ queries capability and tracking changes for CRUD operations.
//3. **OnModelCreating Method**:
//   - This method is overridden to configure detailed model settings and relationships using the `ModelBuilder` instance.
//   - `OnModelCreating` is used to apply custom configurations defined in separate classes (e.g., `UserConfiguration`, `LostItemConfiguration`). These configuration classes are likely implementations of `IEntityTypeConfiguration<T>`, which are used to encapsulate configuration logic for entities.
//   - Global query filters are applied using `HasQueryFilter` to implement soft deletion; entities marked as deleted (presumably having an `IsDeleted` property set to `true`) are excluded from queries.
//4. **SaveChangesAsync Override**:
//   - This asynchronous method is overridden to include custom logic during the save operations.
//   - It utilizes `ChangeTracker` to iterate over entities that derive from `BaseEntity`. These entities presumably have common properties such as `CreateAt`, `UpdatedAt`, and `Id`.
//   - When adding new entities (`EntityState.Added`), it initializes the `CreateAt` timestamp with the current UTC time and generates a new `GUID` for the `Id`.
//   - For modified entities (`EntityState.Modified`), it updates the `UpdatedAt` property to the current UTC time.
//   - Finally, the method calls the base class’s implementation to commit changes to the database.
//Overall, this `ApplicationDbContext` class is a typical structure used in a .NET application leveraging Entity Framework Core for data access, where models are mapped to a database, configurations are specified, and additional behaviors such as timestamps and soft deletes are managed.