using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FrcsPos.Migrations
{
    /// <inheritdoc />
    public partial class AddIsNotificationAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "057f57da-7e41-4177-ae47-8ab85e70e8ec");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5684b3c6-799c-4091-bf3a-8311b7f5f2b3");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e6839638-4363-4df0-b4ff-501a3caa7cee");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f03ffa60-b17f-4843-88d6-5299f294895d");

            migrationBuilder.AddColumn<bool>(
                name: "IsSuperAdmin",
                table: "Notifications",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "068b3ace-7d73-48bb-9f3e-c549cc3b6d3f", null, "user", "USER" },
                    { "2504c9c1-8996-4993-816f-0f44ff9ba89a", null, "superadmin", "SUPERADMIN" },
                    { "7f841c1b-6076-463a-8990-ec3b10ebc811", null, "cashier", "CASHIER" },
                    { "a5cbd9f9-f865-4062-a388-7d7d43fc3999", null, "admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "068b3ace-7d73-48bb-9f3e-c549cc3b6d3f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2504c9c1-8996-4993-816f-0f44ff9ba89a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7f841c1b-6076-463a-8990-ec3b10ebc811");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a5cbd9f9-f865-4062-a388-7d7d43fc3999");

            migrationBuilder.DropColumn(
                name: "IsSuperAdmin",
                table: "Notifications");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "057f57da-7e41-4177-ae47-8ab85e70e8ec", null, "superadmin", "SUPERADMIN" },
                    { "5684b3c6-799c-4091-bf3a-8311b7f5f2b3", null, "user", "USER" },
                    { "e6839638-4363-4df0-b4ff-501a3caa7cee", null, "admin", "ADMIN" },
                    { "f03ffa60-b17f-4843-88d6-5299f294895d", null, "cashier", "CASHIER" }
                });
        }
    }
}
