using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Talaqi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class lastUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPhoneConfirmed",
                table: "Users");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPhoneConfirmed",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
