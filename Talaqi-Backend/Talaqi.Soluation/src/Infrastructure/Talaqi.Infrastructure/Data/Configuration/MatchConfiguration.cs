using Microsoft.EntityFrameworkCore; // Using Entity Framework Core to work with the database
using Microsoft.EntityFrameworkCore.Metadata.Builders; // Provides API for configuring a model
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Domain.Entities; // Import entities from the domain layer

namespace Talaqi.Infrastructure.Data.Configuration // Define the namespace
{
    // Class to configure properties and relationships for the Match entity in the database
    public class MatchConfiguration : IEntityTypeConfiguration<Match>
    {
        // Method to configure the Match entity's properties and constraints
        public void Configure(EntityTypeBuilder<Match> builder)
        {
            // Define the table name in the database for the Match entity
            builder.ToTable("Matches");

            // Set the Id property as the primary key
            builder.HasKey(x => x.Id);

            // Configure the ConfidenceScore property: make it required and set precision
            builder.Property(x => x.ConfidenceScore)
                .IsRequired() // ConfidenceScore must have a value
                .HasPrecision(5, 2); // Maximum of 5 total digits with 2 decimal places

            // Configure the Status property as required
            builder.Property(x => x.Status).IsRequired();

            // Create indexes to improve query performance
            builder.HasIndex(x => x.LostItemId); // Index on LostItemId
            builder.HasIndex(x => x.FoundItemId); // Index on FoundItemId
            builder.HasIndex(x => x.Status); // Index on Status

            // Create a unique index for the combination of LostItemId and FoundItemId
            builder.HasIndex(x => new { x.LostItemId, x.FoundItemId }).IsUnique();
        }
    }
}
//This C# code is a configuration class for the `Match` entity in a database using Entity Framework Core (EF Core). It is part of the persistence layer of an application and defines how the `Match` entity should be represented in a relational database. Here's a detailed breakdown of the code:
//### Namespace and Usings
//- `namespace Talaqi.Infrastructure.Data.Configuration`: Defines a hierarchical structure indicating that this class is part of the infrastructure data configuration for Talaqi, presumably an application or system.
//- `using Microsoft.EntityFrameworkCore;` and `using Microsoft.EntityFrameworkCore.Metadata.Builders;`: These imports are necessary to use EF Core features for model configuration and building.
//- `using Talaqi.Domain.Entities;`: Imports the domain entities, suggesting the `Match` class is defined in the domain layer.
//### Class: `MatchConfiguration`
//- Implements `IEntityTypeConfiguration<Match>`: This interface requires the implementation of the `Configure` method, which lets you configure the `Match` entity's properties and relationships.
//### Method: `Configure`
//- `builder.ToTable("Matches");`: Sets the name of the database table for `Match` entities to "Matches".
//- `builder.HasKey(x => x.Id);`: Configures the `Id` property of `Match` as the primary key.
//- `builder.Property(x => x.ConfidenceScore).IsRequired().HasPrecision(5, 2);`: 
//  - Marks `ConfidenceScore` as a required field.
//  - Sets its precision to a maximum of 5 total digits with 2 decimal places, which is typical for capturing decimal values accurately without using excessive storage.
//- `builder.Property(x => x.Status).IsRequired();`: Makes the `Status` property required, ensuring that each `Match` entry has a status set.
//### Indexes
//Indexes are created to enhance query performance:
//- `builder.HasIndex(x => x.LostItemId);`: Creates an index on the `LostItemId` property.
//- `builder.HasIndex(x => x.FoundItemId);`: Creates an index on the `FoundItemId` property.
//- `builder.HasIndex(x => x.Status);`: Creates an index on the `Status` property.
//- `builder.HasIndex(x => new { x.LostItemId, x.FoundItemId }).IsUnique();`: Defines a unique composite index on the combination of `LostItemId` and `FoundItemId`. This ensures that the pair of IDs is unique across the database, which can be critical for functionality like matching lost and found items uniquely.
//### Purpose
//This configuration class is aimed at setting up the `Match` entity correctly in a relational database, ensuring data integrity, optimizing performance with indexes, and enforcing business rules such as required fields and unique constraints. Such configuration classes help provide a cleaner separation of concerns, keeping entity definitions separate from their database mappings.