using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FrcsPos.Migrations
{
    /// <inheritdoc />
    public partial class UniqueUUID : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9c74cd5d-65b4-45b6-9441-a4127a30a624");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a2a0e9be-3225-477d-81b4-92ee8b478c0a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a4f191da-b7ed-4452-8167-4c08bc20bcb0");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d328df72-7794-4b6d-9544-8db72b5a9511");

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
                    { "44c98a0f-4297-4709-ab4b-72b91dfd9e12", null, "cashier", "CASHIER" },
                    { "6f70015a-7793-41bd-8d45-64b8c9fba114", null, "admin", "ADMIN" },
                    { "a902b6f6-fccb-4a54-ac0f-fd11e979c8a2", null, "superadmin", "SUPERADMIN" },
                    { "cb141282-0a3b-4cfc-b219-65d5e57dee61", null, "user", "USER" }
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
                keyValue: "44c98a0f-4297-4709-ab4b-72b91dfd9e12");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6f70015a-7793-41bd-8d45-64b8c9fba114");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a902b6f6-fccb-4a54-ac0f-fd11e979c8a2");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "cb141282-0a3b-4cfc-b219-65d5e57dee61");

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
                    { "9c74cd5d-65b4-45b6-9441-a4127a30a624", null, "cashier", "CASHIER" },
                    { "a2a0e9be-3225-477d-81b4-92ee8b478c0a", null, "user", "USER" },
                    { "a4f191da-b7ed-4452-8167-4c08bc20bcb0", null, "superadmin", "SUPERADMIN" },
                    { "d328df72-7794-4b6d-9544-8db72b5a9511", null, "admin", "ADMIN" }
                });
        }
    }
}
