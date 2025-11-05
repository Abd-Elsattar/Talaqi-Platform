using Microsoft.Data.SqlClient;
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
    // Configuration class for the User entity
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        // Method to configure the User entity
        public void Configure(EntityTypeBuilder<User> builder)
        {
            // Map the User entity to the "Users" table in the database
            builder.ToTable("Users");

            // Set the Id property as the primary key
            builder.HasKey(x => x.Id);

            // Set the FirstName property as required and limit its length to 100 characters
            builder.Property(x => x.FirstName)
                .IsRequired()
                .HasMaxLength(100);

            // Set the LastName property as required and limit its length to 100 characters
            builder.Property(x => x.LastName)
                .IsRequired()
                .HasMaxLength(100);

            // Set the Email property as required, limit its length to 255 characters, and create a unique index
            builder.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(255);

            // Create a unique index on the Email property
            builder.HasIndex(x => x.Email).IsUnique();

            // Set the PhoneNumber property as required and limit its length to 20 characters
            builder.Property(x => x.PhoneNumber)
                .IsRequired()
                .HasMaxLength(20);

            // Set the PassWordHash property as required (used for storing password hashes)
            builder.Property(x => x.PassWordHash)
                .IsRequired();

            // Set the Role property as required and limit its length to 50 characters
            builder.Property(x => x.Role)
                .IsRequired()
                .HasMaxLength(50);

            // Configure a one-to-many relationship between User and LostItems
            builder.HasMany(x => x.LostItems)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure a one-to-many relationship between User and FoundItems
            builder.HasMany(x => x.FoundItems)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
//This code is part of an Entity Framework Core configuration that specifies how the `User` entity should be mapped to the database schema. Specifically, it uses Fluent API to establish the database schema for a table named "Users," sets up primary keys, and configures the properties of the `User` entity, such as data types, constraints, and relationships.
//Here's a detailed explanation of the key parts:
//1. **Table Mapping**:
//   - `builder.ToTable("Users");`: Maps the `User` entity to a database table called "Users."
//2. **Primary Key**:
//   - `builder.HasKey(x => x.Id);`: Sets the `Id` property as the primary key for the User table.
//3. **Property Configurations**:
//   - Each property of the `User` entity is configured with specific characteristics:
//     - `FirstName`, `LastName`: Required fields with a maximum length of 100 characters.
//     - `Email`: Required with a max length of 255 characters and a unique index. This ensures email addresses must be unique across the table.
//     - `PhoneNumber`: Required with a max length of 20 characters.
//     - `PassWordHash`: Required field for storing hashed passwords.
//     - `Role`: Required field with a maximum length of 50 characters.
//4. **Indexes**:
//   - `builder.HasIndex(x => x.Email).IsUnique();`: Ensures that the `Email` field values are unique across all records, meaning no two users can have the same email address.
//5. **Relationships**:
//   - The class configures one-to-many relationships with two other entities, `LostItems` and `FoundItems`. This assumes that a user can have multiple lost and found items associated with them:
//     - `builder.HasMany(x => x.LostItems)`: Sets up a one-to-many relationship from `User` to `LostItems`.
//     - `builder.HasMany(x => x.FoundItems)`: Sets up a similar relationship to `FoundItems`.
//   - `WithOne(x => x.User).HasForeignKey(x => x.UserId)`: Specifies that each `LostItem` and `FoundItem` is associated with a `User`, identified by the `UserId` foreign key.
//   - `.OnDelete(DeleteBehavior.Restrict)`: Configures the foreign key constraints such that if a `User` is deleted, any associated `LostItems` or `FoundItems` will not be automatically deleted. This prevents potential data loss and helps maintain referential integrity.
//Overall, this code is an essential part of setting up Entity Framework Core to handle interactions with the database for `User` entities in a structured and efficient manner. It controls how data is stored, retrieved, and ensured to follow defined restraints and behaviors.