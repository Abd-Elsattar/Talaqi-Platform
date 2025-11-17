using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Talaqi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    PassWordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProfilePictureUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Role = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IsEmailVerified = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VerificationCodes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsUsed = table.Column<bool>(type: "bit", nullable: false),
                    Purpose = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VerificationCodes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FoundItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Category = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Location_Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Location_Latitude = table.Column<double>(type: "float", nullable: true),
                    Location_Longitude = table.Column<double>(type: "float", nullable: true),
                    Location_City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Location_Governorate = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    DateFound = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ContactInfo = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    AIAnalysisData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FoundItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FoundItems_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LostItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Category = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Location_Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Location_Latitude = table.Column<double>(type: "float", nullable: true),
                    Location_Longitude = table.Column<double>(type: "float", nullable: true),
                    Location_City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Location_Governorate = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    DateLost = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ContactInfo = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    AIAnalysisData = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LostItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LostItems_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Matches",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LostItemId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FoundItemId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ConfidenceScore = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    NotificationSent = table.Column<bool>(type: "bit", nullable: false),
                    NotificationSentAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MatchDetails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Matches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Matches_FoundItems_FoundItemId",
                        column: x => x.FoundItemId,
                        principalTable: "FoundItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Matches_LostItems_LostItemId",
                        column: x => x.LostItemId,
                        principalTable: "LostItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FoundItems_Category",
                table: "FoundItems",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_FoundItems_CreatedAt",
                table: "FoundItems",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_FoundItems_Status",
                table: "FoundItems",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_FoundItems_UserId",
                table: "FoundItems",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_LostItems_Category",
                table: "LostItems",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_LostItems_CreatedAt",
                table: "LostItems",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_LostItems_Status",
                table: "LostItems",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_LostItems_UserId",
                table: "LostItems",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_FoundItemId",
                table: "Matches",
                column: "FoundItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_LostItemId",
                table: "Matches",
                column: "LostItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_LostItemId_FoundItemId",
                table: "Matches",
                columns: new[] { "LostItemId", "FoundItemId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Matches_Status",
                table: "Matches",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VerificationCodes_Email_Code_Purpose",
                table: "VerificationCodes",
                columns: new[] { "Email", "Code", "Purpose" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Matches");

            migrationBuilder.DropTable(
                name: "VerificationCodes");

            migrationBuilder.DropTable(
                name: "FoundItems");

            migrationBuilder.DropTable(
                name: "LostItems");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
