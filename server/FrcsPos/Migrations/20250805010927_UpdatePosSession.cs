using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FrcsPos.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePosSession : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "Warehouses",
                type: "varchar(255)",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "TaxCategories",
                type: "varchar(255)",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "Sales",
                type: "varchar(255)",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "SaleItems",
                type: "varchar(255)",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "RefundRequests",
                type: "varchar(255)",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "RefundItems",
                type: "varchar(255)",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "Products",
                type: "varchar(255)",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "ProductBatches",
                type: "varchar(255)",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "PosTerminals",
                type: "varchar(255)",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "PosSessions",
                type: "varchar(255)",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AddColumn<DateTime>(
                name: "ConnectionTimeOut",
                table: "PosSessions",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "ConnectionUUID",
                table: "PosSessions",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_general_ci");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "PosSessions",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "Notifications",
                type: "varchar(255)",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "CompanyUsers",
                type: "varchar(255)",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "Companies",
                type: "varchar(255)",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

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

            migrationBuilder.CreateIndex(
                name: "IX_Warehouses_UUID",
                table: "Warehouses",
                column: "UUID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TaxCategories_UUID",
                table: "TaxCategories",
                column: "UUID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Sales_UUID",
                table: "Sales",
                column: "UUID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SaleItems_UUID",
                table: "SaleItems",
                column: "UUID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RefundRequests_UUID",
                table: "RefundRequests",
                column: "UUID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RefundItems_UUID",
                table: "RefundItems",
                column: "UUID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_UUID",
                table: "Products",
                column: "UUID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductBatches_UUID",
                table: "ProductBatches",
                column: "UUID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PosTerminals_UUID",
                table: "PosTerminals",
                column: "UUID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PosSessions_UUID",
                table: "PosSessions",
                column: "UUID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UUID",
                table: "Notifications",
                column: "UUID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CompanyUsers_UUID",
                table: "CompanyUsers",
                column: "UUID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Companies_UUID",
                table: "Companies",
                column: "UUID",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Warehouses_UUID",
                table: "Warehouses");

            migrationBuilder.DropIndex(
                name: "IX_TaxCategories_UUID",
                table: "TaxCategories");

            migrationBuilder.DropIndex(
                name: "IX_Sales_UUID",
                table: "Sales");

            migrationBuilder.DropIndex(
                name: "IX_SaleItems_UUID",
                table: "SaleItems");

            migrationBuilder.DropIndex(
                name: "IX_RefundRequests_UUID",
                table: "RefundRequests");

            migrationBuilder.DropIndex(
                name: "IX_RefundItems_UUID",
                table: "RefundItems");

            migrationBuilder.DropIndex(
                name: "IX_Products_UUID",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_ProductBatches_UUID",
                table: "ProductBatches");

            migrationBuilder.DropIndex(
                name: "IX_PosTerminals_UUID",
                table: "PosTerminals");

            migrationBuilder.DropIndex(
                name: "IX_PosSessions_UUID",
                table: "PosSessions");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_UUID",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_CompanyUsers_UUID",
                table: "CompanyUsers");

            migrationBuilder.DropIndex(
                name: "IX_Companies_UUID",
                table: "Companies");

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

            migrationBuilder.DropColumn(
                name: "ConnectionTimeOut",
                table: "PosSessions");

            migrationBuilder.DropColumn(
                name: "ConnectionUUID",
                table: "PosSessions");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "PosSessions");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "Warehouses",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "TaxCategories",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "Sales",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "SaleItems",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "RefundRequests",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "RefundItems",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "Products",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "ProductBatches",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "PosTerminals",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "PosSessions",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "Notifications",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "CompanyUsers",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "UUID",
                table: "Companies",
                type: "longtext",
                nullable: false,
                collation: "utf8mb4_general_ci",
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .OldAnnotation("Relational:Collation", "utf8mb4_general_ci");

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
        }
    }
}
