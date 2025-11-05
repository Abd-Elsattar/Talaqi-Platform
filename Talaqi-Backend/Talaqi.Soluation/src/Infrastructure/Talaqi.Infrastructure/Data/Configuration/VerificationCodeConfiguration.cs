using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Talaqi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Talaqi.Infrastructure.Data.Configuration
{
    // Define the configuration for the VerificationCode entity
    public class VerificationCodeConfiguration : IEntityTypeConfiguration<VerificationCode>
    {
        // Configure the properties and constraints for the VerificationCode entity
        public void Configure(EntityTypeBuilder<VerificationCode> builder)
        {
            // Set the table name for the VerificationCode entity
            builder.ToTable("VerificationCodes");

            // Set the primary key for the VerificationCode entity
            builder.HasKey(x => x.Id);

            // Define a required Email property with a maximum length of 255 characters
            builder.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(255);

            // Define a required Code property with a maximum length of 10 characters
            builder.Property(x => x.Code)
                .IsRequired()
                .HasMaxLength(10);

            // Define a required Purpose property with a maximum length of 50 characters
            builder.Property(x => x.Purpose)
                .IsRequired()
                .HasMaxLength(50);

            // Create an index on the Email, Code, and Purpose properties for performance optimization
            builder.HasIndex(x => new { x.Email, x.Code, x.Purpose });
        }
    }
}
//This C# code is part of a configuration class for an Entity Framework Core model setup, specifically for configuring an entity representing verification codes in a database. The code is part of the `Talaqi.Infrastructure.Data.Configuration` namespace and likely plays a role in defining how the `VerificationCode` entity is mapped to a database table using EF Core's fluent API.
//### Key Components:
//1. **Namespace and Usings**:
//   - The file begins by importing necessary namespaces such as `Microsoft.EntityFrameworkCore` for EF Core functionality and `Talaqi.Domain.Entities` indicating the project's domain entity layer.
//2. **EntityTypeConfiguration Interface**:
//   - The class `VerificationCodeConfiguration` implements `IEntityTypeConfiguration<VerificationCode>`. This interface is provided by EF Core to allow the specification of how an entity type should be configured.
//3. **Configure Method**:
//   - This method is called to configure the entity of type `VerificationCode`. It uses the `EntityTypeBuilder<VerificationCode>` to define the table schema, key, properties, and indexing.
//4. **Table Mapping**:
//   - `builder.ToTable("VerificationCodes")`: Specifies that this entity maps to a database table named `VerificationCodes`.
//5. **Primary Key**:
//   - `builder.HasKey(x => x.Id)`: Declares the primary key of the table to be the `Id` property of the `VerificationCode` entity.
//6. **Property Configurations**:
//   - The properties Email, Code, and Purpose are defined with constraints:
//     - `Email`: Required, max length of 255 characters.
//     - `Code`: Required, max length of 10 characters.
//     - `Purpose`: Required, max length of 50 characters.
//   - These constraints are enforced by the database.
//7. **Index Creation**:
//   - `builder.HasIndex(x => new { x.Email, x.Code, x.Purpose })`: Specifies an index on a composite of the `Email`, `Code`, and `Purpose` properties to optimize query performance concerning these fields.
//### Purpose and Usage:
//- **Database Mapping**: This class ensures that the `VerificationCode` entity is properly mapped to its corresponding table in the database with the correct schema, constraints, and indexes.
//- **Maintainability and Performance**: The clear definition of each field's requirements helps maintain data integrity and optimizes database performance with indexed fields.
//- **Separation of Concerns**: By externalizing the entity configuration to this class, the domain entity itself does not have to concern itself with implementation details related to persistence, adhering to good separation of concerns and clean architecture principles.
//This setup facilitates Entity Framework Core to auto-generate database tables and their structure, defined as per the configurations, simplifying the process of managing database schema evolution over time.