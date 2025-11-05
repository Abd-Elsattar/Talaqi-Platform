
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Domain.Entities;

namespace Talaqi.Infrastructure.Data.Configuration
{
    // Defines the configuration for the FoundItem entity
    public class FoundItemConfiguration : IEntityTypeConfiguration<FoundItem>
    {
        // Configures the properties and relationships of the FoundItem entity
        public void Configure(EntityTypeBuilder<FoundItem> builder)
        {
            // Maps the FoundItem entity to the "FoundItems" table in the database
            builder.ToTable("FoundItems");

            // Configures the Id property as the primary key
            builder.HasKey(x => x.Id);

            // Configures the Category property as required
            builder.Property(x => x.Category).IsRequired();

            // Configures the Title property as required with a maximum length of 200 characters
            builder.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(200);

            // Configures the Description property as required with a maximum length of 2000 characters
            builder.Property(x => x.Description)
                .IsRequired()
                .HasMaxLength(2000);

            // Configures the ContactInfo property as required with a maximum length of 500 characters
            builder.Property(x => x.ContactInfo)
                .IsRequired()
                .HasMaxLength(500);

            // Configures the Location property as an owned entity type
            builder.OwnsOne(x => x.Location, location =>
            {
                // Configures properties of the owned Location entity
                location.Property(l => l.Address).HasMaxLength(500);
                location.Property(l => l.City).HasMaxLength(100);
                location.Property(l => l.Governorate).HasMaxLength(100);
            });

            // Configures a one-to-many relationship with the Matches entity
            builder.HasMany(x => x.Matches)
                .WithOne(x => x.FoundItem)
                .HasForeignKey(x => x.FoundItemId)
                .OnDelete(DeleteBehavior.Cascade);

            // Creates indices on UserId, Category, Status, and CreateAt properties for better query performance
            builder.HasIndex(x => x.UserId);
            builder.HasIndex(x => x.Category);
            builder.HasIndex(x => x.Status);
            builder.HasIndex(x => x.CreateAt);
        }
    }
}
//The provided code snippet is a configuration class for the `FoundItem` entity within an Entity Framework Core context, specifically built to work with a database in a .NET application. This code is using the Fluent API to configure entity mappings, properties, relationships, and settings to dictate how this entity should be rendered in the corresponding database table.
//Here's a breakdown of what each part of the class does:
//### Namespace and Imports
//- The code is part of the `Talaqi.Infrastructure.Data.Configuration` namespace.
//- It uses several essential namespaces, including `Microsoft.EntityFrameworkCore` for database interactions and `Microsoft.EntityFrameworkCore.Metadata.Builders` for entity configuration.
//### Class Definition
//- `FoundItemConfiguration` implements `IEntityTypeConfiguration<FoundItem>`, indicating that it is responsible for configuring the properties and relationships of the `FoundItem` entity.
//### Method: `Configure`
//- **Table Mapping**: Maps the `FoundItem` entity to the "FoundItems" table in the database.
//- **Primary Key Configuration**: Specifies `Id` as the primary key for the table.
//- **Property Configurations**:
//  - **Category**: Must be present (required).
//  - **Title**: Required with a maximum length of 200 characters.
//  - **Description**: Required with a maximum length of 2000 characters.
//  - **ContactInfo**: Required with a maximum length of 500 characters.
//- **Owned Entity Type - Location**: 
//  - Configures `Location` as an owned entity, which means its properties don't have a separate table but are part of the `FoundItem` table.
//  - Properties within `Location` like `Address`, `City`, and `Governorate` have specific maximum lengths.
//- **Relationship Configuration**:
//  - **Matches**: Configures a one-to-many relationship with `Matches`, indicating a `FoundItem` can be associated with many `Matches`.
//  - Defines foreign key `FoundItemId` and specifies delete behavior as cascading, meaning deletions of `FoundItem` will delete related `Matches` records.
//- **Index Configurations**:
//  - Creates indices on `UserId`, `Category`, `Status`, and `CreateAt` properties. Indexing these fields can significantly improve query performance related to search and retrieval operations involving these columns. 
//This configuration enhances the application's ability to interact efficiently with the database by defining the structure and relationships of the `FoundItem` entity comprehensively, ensuring data integrity and facilitating performant queries.