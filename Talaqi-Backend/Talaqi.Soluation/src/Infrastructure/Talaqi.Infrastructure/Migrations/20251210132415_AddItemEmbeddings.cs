using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Talaqi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddItemEmbeddings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ItemEmbeddings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ItemId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ItemType = table.Column<string>(type: "nvarchar(16)", maxLength: 16, nullable: false),
                    Embedding = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    NormalizedText = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Governorate = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    LastUpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemEmbeddings", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ItemEmbeddings_Category",
                table: "ItemEmbeddings",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_ItemEmbeddings_City",
                table: "ItemEmbeddings",
                column: "City");

            migrationBuilder.CreateIndex(
                name: "IX_ItemEmbeddings_Governorate",
                table: "ItemEmbeddings",
                column: "Governorate");

            migrationBuilder.CreateIndex(
                name: "IX_ItemEmbeddings_ItemId_ItemType",
                table: "ItemEmbeddings",
                columns: new[] { "ItemId", "ItemType" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ItemEmbeddings_LastUpdatedAt",
                table: "ItemEmbeddings",
                column: "LastUpdatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItemEmbeddings");
        }
    }
}
