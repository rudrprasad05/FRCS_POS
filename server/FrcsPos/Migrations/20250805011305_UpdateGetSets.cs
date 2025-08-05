using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FrcsPos.Migrations
{
    /// <inheritdoc />
    public partial class UpdateGetSets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8e9bc472-4bd2-4643-a476-6cef95c20d99");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9ee39f33-b8a9-4f5a-9eb6-a80f3ba13034");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b49e2aa7-3d96-45b4-8274-88437508ef4b");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cd68e55c-4040-4ee3-8198-ea27cbe18c50");

            migrationBuilder.AddColumn<int>(
                name: "CompanyUserCompanyId",
                table: "PosSessions",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompanyUserUserId",
                table: "PosSessions",
                type: "varchar(255)",
                nullable: true,
                collation: "utf8mb4_general_ci");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "04f6fa1f-8570-4630-ad18-a4418f4f1d69", null, "cashier", "CASHIER" },
                    { "5fe1277a-9dc5-405b-9506-026178560fe0", null, "admin", "ADMIN" },
                    { "bba3cf09-decf-462c-9609-8019edb61adc", null, "superadmin", "SUPERADMIN" },
                    { "ea67c12b-8238-454c-b80a-eebdec0ad9de", null, "user", "USER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_PosSessions_CompanyUserCompanyId_CompanyUserUserId",
                table: "PosSessions",
                columns: new[] { "CompanyUserCompanyId", "CompanyUserUserId" });

            migrationBuilder.AddForeignKey(
                name: "FK_PosSessions_CompanyUsers_CompanyUserCompanyId_CompanyUserUse~",
                table: "PosSessions",
                columns: new[] { "CompanyUserCompanyId", "CompanyUserUserId" },
                principalTable: "CompanyUsers",
                principalColumns: new[] { "CompanyId", "UserId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PosSessions_CompanyUsers_CompanyUserCompanyId_CompanyUserUse~",
                table: "PosSessions");

            migrationBuilder.DropIndex(
                name: "IX_PosSessions_CompanyUserCompanyId_CompanyUserUserId",
                table: "PosSessions");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "04f6fa1f-8570-4630-ad18-a4418f4f1d69");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5fe1277a-9dc5-405b-9506-026178560fe0");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bba3cf09-decf-462c-9609-8019edb61adc");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ea67c12b-8238-454c-b80a-eebdec0ad9de");

            migrationBuilder.DropColumn(
                name: "CompanyUserCompanyId",
                table: "PosSessions");

            migrationBuilder.DropColumn(
                name: "CompanyUserUserId",
                table: "PosSessions");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "8e9bc472-4bd2-4643-a476-6cef95c20d99", null, "user", "USER" },
                    { "9ee39f33-b8a9-4f5a-9eb6-a80f3ba13034", null, "cashier", "CASHIER" },
                    { "b49e2aa7-3d96-45b4-8274-88437508ef4b", null, "superadmin", "SUPERADMIN" },
                    { "cd68e55c-4040-4ee3-8198-ea27cbe18c50", null, "admin", "ADMIN" }
                });
        }
    }
}
