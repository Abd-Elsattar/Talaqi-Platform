using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Talaqi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MatchingEnhancements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.DropColumn(
                name: "Category",
                table: "MatchCandidates");

            migrationBuilder.RenameColumn(
                name: "TextSimilarity",
                table: "MatchCandidates",
                newName: "ScoreText");

            migrationBuilder.RenameColumn(
                name: "LocationSimilarity",
                table: "MatchCandidates",
                newName: "ScoreLocation");

            migrationBuilder.RenameColumn(
                name: "ImageSimilarity",
                table: "MatchCandidates",
                newName: "ScoreImage");

            migrationBuilder.RenameColumn(
                name: "DateProximity",
                table: "MatchCandidates",
                newName: "ScoreDate");

            migrationBuilder.RenameColumn(
                name: "CandidateScore",
                table: "MatchCandidates",
                newName: "AggregateScore");

            migrationBuilder.RenameColumn(
                name: "CandidateDetails",
                table: "MatchCandidates",
                newName: "ReasonsJson");

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Matches",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MatchExplanation",
                table: "Matches",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "MatchCandidates",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Promoted",
                table: "MatchCandidates",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "LostItems",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "FoundItems",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "MatchExplanation",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "MatchCandidates");

            migrationBuilder.DropColumn(
                name: "Promoted",
                table: "MatchCandidates");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "LostItems");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "FoundItems");

            migrationBuilder.RenameColumn(
                name: "ScoreText",
                table: "MatchCandidates",
                newName: "TextSimilarity");

            migrationBuilder.RenameColumn(
                name: "ScoreLocation",
                table: "MatchCandidates",
                newName: "LocationSimilarity");

            migrationBuilder.RenameColumn(
                name: "ScoreImage",
                table: "MatchCandidates",
                newName: "ImageSimilarity");

            migrationBuilder.RenameColumn(
                name: "ScoreDate",
                table: "MatchCandidates",
                newName: "DateProximity");

            migrationBuilder.RenameColumn(
                name: "ReasonsJson",
                table: "MatchCandidates",
                newName: "CandidateDetails");

            migrationBuilder.RenameColumn(
                name: "AggregateScore",
                table: "MatchCandidates",
                newName: "CandidateScore");

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

            migrationBuilder.AddColumn<int>(
                name: "Category",
                table: "MatchCandidates",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
