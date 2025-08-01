using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FrcsPos.Migrations
{
    /// <inheritdoc />
    public partial class UpdatesV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sales_PosTerminals_PosTerminalId",
                table: "Sales");

            migrationBuilder.DropIndex(
                name: "IX_Sales_PosTerminalId",
                table: "Sales");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "619e2934-9962-4858-a77b-782c3fe60347");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e46aa7e6-8857-46c8-ab1b-3abf3fb0a70b");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e95b79f1-2cc6-4cd9-aafc-64194a16b72b");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e9b22220-4e6f-42f5-a2bd-cb767ae6e90d");

            migrationBuilder.AddColumn<string>(
                name: "PosUserId",
                table: "Sales",
                type: "varchar(255)",
                nullable: false,
                defaultValue: "",
                collation: "utf8mb4_general_ci");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "0dcdae92-6527-4c0e-8cfa-386527a2bc13", null, "superadmin", "SUPERADMIN" },
                    { "45464fad-5792-445c-be48-1f7f0614ded9", null, "cashier", "CASHIER" },
                    { "b179cc60-8434-4765-8dd5-478b497d33ef", null, "user", "USER" },
                    { "d7622ed9-d2b3-4a25-8c30-64fd2fe627a1", null, "admin", "ADMIN" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Sales_PosTerminalId_PosUserId",
                table: "Sales",
                columns: new[] { "PosTerminalId", "PosUserId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Sales_PosSessions_PosTerminalId_PosUserId",
                table: "Sales",
                columns: new[] { "PosTerminalId", "PosUserId" },
                principalTable: "PosSessions",
                principalColumns: new[] { "PosTerminalId", "PosUserId" },
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Sales_PosTerminals_PosTerminalId",
                table: "Sales",
                column: "PosTerminalId",
                principalTable: "PosTerminals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sales_PosSessions_PosTerminalId_PosUserId",
                table: "Sales");

            migrationBuilder.DropForeignKey(
                name: "FK_Sales_PosTerminals_PosTerminalId",
                table: "Sales");

            migrationBuilder.DropIndex(
                name: "IX_Sales_PosTerminalId_PosUserId",
                table: "Sales");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0dcdae92-6527-4c0e-8cfa-386527a2bc13");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "45464fad-5792-445c-be48-1f7f0614ded9");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b179cc60-8434-4765-8dd5-478b497d33ef");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d7622ed9-d2b3-4a25-8c30-64fd2fe627a1");

            migrationBuilder.DropColumn(
                name: "PosUserId",
                table: "Sales");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "619e2934-9962-4858-a77b-782c3fe60347", null, "superadmin", "SUPERADMIN" },
                    { "e46aa7e6-8857-46c8-ab1b-3abf3fb0a70b", null, "cashier", "CASHIER" },
                    { "e95b79f1-2cc6-4cd9-aafc-64194a16b72b", null, "admin", "ADMIN" },
                    { "e9b22220-4e6f-42f5-a2bd-cb767ae6e90d", null, "user", "USER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Sales_PosTerminalId",
                table: "Sales",
                column: "PosTerminalId");

            migrationBuilder.AddForeignKey(
                name: "FK_Sales_PosTerminals_PosTerminalId",
                table: "Sales",
                column: "PosTerminalId",
                principalTable: "PosTerminals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
