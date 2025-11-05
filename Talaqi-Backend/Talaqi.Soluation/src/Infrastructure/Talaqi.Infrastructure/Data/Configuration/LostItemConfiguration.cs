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
    // This class defines the configuration for the LostItem entity.
    public class LostItemConfiguration : IEntityTypeConfiguration<LostItem>
    {
        // Configures the entity model for LostItem.
        public void Configure(EntityTypeBuilder<LostItem> builder)
        {
            // Specifies the table name in the database for the LostItem entity.
            builder.ToTable("LostItems");

            // Sets the primary key for the LostItem entity.
            builder.HasKey(x => x.Id);

            // Configures the Category property as required.
            builder.Property(x => x.Category).IsRequired();

            // Configures the Title property as required with a maximum length of 200 characters.
            builder.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(200);

            // Configures the Description property as required with a maximum length of 2000 characters.
            builder.Property(x => x.Description)
                .IsRequired()
                .HasMaxLength(2000);

            // Configures the ContactInfo property as required with a maximum length of 500 characters.
            builder.Property(x => x.ContactInfo)
                .IsRequired()
                .HasMaxLength(500);

            // Configures the Location property as a complex type with its own properties.
            builder.OwnsOne(x => x.Location, location =>
            {
                // Configures the Address property of the Location as a maximum length of 500 characters.
                location.Property(l => l.Address).HasMaxLength(500);

                // Configures the City property of the Location with a maximum length of 100 characters.
                location.Property(l => l.City).HasMaxLength(100);

                // Configures the Governorate property of the Location with a maximum length of 100 characters.
                location.Property(l => l.Governorate).HasMaxLength(100);
            });

            // Configures a one-to-many relationship between LostItem and Matches.
            builder.HasMany(x => x.Matches)
                .WithOne(x => x.LostItem)
                .HasForeignKey(x => x.LostItemId)
                .OnDelete(DeleteBehavior.Cascade);

            // Creates an index on the UserId property to optimize queries.
            builder.HasIndex(x => x.UserId);

            // Creates an index on the Category property to optimize queries.
            builder.HasIndex(x => x.Category);

            // Creates an index on the Status property to optimize queries.
            builder.HasIndex(x => x.Status);

            // Creates an index on the CreatedAt property to optimize queries.
            builder.HasIndex(x => x.CreateAt);
        }
    }
}
//This code is an entity configuration class for the `LostItem` entity using Entity Framework Core, a popular ORM (Object-Relational Mapping) framework by Microsoft. The class is part of a configuration setup that defines how the `LostItem` entity maps to a table in the database, including constraints, relationships, and indexes.
//Here's a breakdown of what each part of the code is doing:
//1. **Namespace and Usings**: 
//   - The code starts by importing necessary namespaces to make use of Entity Framework Core features and the Domain Entities where `LostItem` is defined.
//2. **Class Definition**:
//   - The `LostItemConfiguration` class implements the `IEntityTypeConfiguration<LostItem>` interface which requires implementing the `Configure` method. This method is used to customize the entity to table mapping.
//3. **Configuration Method**:
//   - `Configure(EntityTypeBuilder<LostItem> builder)`: 
//     - This method uses the `EntityTypeBuilder` to configure the `LostItem` entity.
//4. **Table Configuration**:
//   - `builder.ToTable("LostItems")`: Sets the name of the table in the database to "LostItems".
//5. **Primary Key**:
//   - `builder.HasKey(x => x.Id)`: Sets the primary key of the `LostItem` entity to be the `Id` property.
//6. **Property Configurations**:
//   - Several properties are configured with requirements:
//     - `Category`, `Title`, `Description`, `ContactInfo` are marked as required with specific maximum lengths using `IsRequired()` and `HasMaxLength()`.
//7. **Complex Type Configuration**:
//   - `builder.OwnsOne(x => x.Location, location => { ... })`: 
//     - Indicates that `Location` is a complex type which is a value object owned by `LostItem`.
//     - Properties of `Location` (`Address`, `City`, `Governorate`) are configured with specific maximum lengths.
//8. **Relationships**:
//   - Configures a one-to-many relationship between `LostItem` and `Matches` entities.
//   - Each `LostItem` can have many `Matches`, with a foreign key on `Matches` pointing back to `LostItem`.
//   - `OnDelete(DeleteBehavior.Cascade)`: Specifies that if a `LostItem` is deleted, all related `Matches` should also be deleted.
//9. **Indexes**:
//   - Creates indexes on `UserId`, `Category`, `Status`, and `CreatedAt` properties to optimize query performance on these commonly queried fields.
//Overall, this configuration class is tailored to ensure that the database schema effectively represents the `LostItem` entity, while also enhancing query performance and maintaining referential integrity through its relationships and indexes.