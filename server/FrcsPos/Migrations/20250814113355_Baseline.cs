using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FrcsPos.Migrations
{
    /// <inheritdoc />
    public partial class Baseline : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "9dc4cb79-ae75-48fb-af1d-a318e53d4364", null, "cashier", "CASHIER" },
                    { "c0470664-ac71-45da-a97f-92d7d3bde4c2", null, "superadmin", "SUPERADMIN" },
                    { "e3f1f724-cd8b-4370-a40f-a82d3ebdff01", null, "user", "USER" },
                    { "f37bcdeb-02a5-4523-af63-063db424aaf3", null, "admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9dc4cb79-ae75-48fb-af1d-a318e53d4364");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c0470664-ac71-45da-a97f-92d7d3bde4c2");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e3f1f724-cd8b-4370-a40f-a82d3ebdff01");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f37bcdeb-02a5-4523-af63-063db424aaf3");
        }
    }
}
