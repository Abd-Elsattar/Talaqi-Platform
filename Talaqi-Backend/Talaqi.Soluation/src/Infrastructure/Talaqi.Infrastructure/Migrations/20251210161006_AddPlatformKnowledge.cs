using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Talaqi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPlatformKnowledge : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PlatformKnowledge",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlatformKnowledge", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PlatformKnowledgeEmbeddings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    KnowledgeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NormalizedText = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    Embedding = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    LastUpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlatformKnowledgeEmbeddings", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlatformKnowledgeEmbeddings_Category",
                table: "PlatformKnowledgeEmbeddings",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_PlatformKnowledgeEmbeddings_KnowledgeId",
                table: "PlatformKnowledgeEmbeddings",
                column: "KnowledgeId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlatformKnowledgeEmbeddings_LastUpdatedAt",
                table: "PlatformKnowledgeEmbeddings",
                column: "LastUpdatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlatformKnowledge");

            migrationBuilder.DropTable(
                name: "PlatformKnowledgeEmbeddings");
        }
    }
}
