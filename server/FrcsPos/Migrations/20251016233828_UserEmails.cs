using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FrcsPos.Migrations
{
    /// <inheritdoc />
    public partial class UserEmails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EmailVerificationCode",
                table: "AspNetUsers",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_general_ci");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailVerificationCode",
                table: "AspNetUsers");
        }
    }
}
