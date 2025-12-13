using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Talaqi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class TwoStageMatching : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "DateProximity",
                table: "Matches",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "ImageSimilarity",
                table: "Matches",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "LocationSimilarity",
                table: "Matches",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TextSimilarity",
                table: "Matches",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "MatchCandidates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LostItemId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FoundItemId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TextSimilarity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ImageSimilarity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LocationSimilarity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DateProximity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CandidateScore = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Category = table.Column<int>(type: "int", nullable: false),
                    CandidateDetails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchCandidates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MatchCandidates_FoundItems_FoundItemId",
                        column: x => x.FoundItemId,
                        principalTable: "FoundItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MatchCandidates_LostItems_LostItemId",
                        column: x => x.LostItemId,
                        principalTable: "LostItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MatchCandidates_FoundItemId",
                table: "MatchCandidates",
                column: "FoundItemId");

            migrationBuilder.CreateIndex(
                name: "IX_MatchCandidates_LostItemId",
                table: "MatchCandidates",
                column: "LostItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MatchCandidates");

            migrationBuilder.DropColumn(
                name: "DateProximity",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "ImageSimilarity",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "LocationSimilarity",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "TextSimilarity",
                table: "Matches");
        }
    }
}
