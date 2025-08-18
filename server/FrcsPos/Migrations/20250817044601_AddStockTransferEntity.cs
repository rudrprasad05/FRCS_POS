using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FrcsPos.Migrations
{
    /// <inheritdoc />
    public partial class AddStockTransferEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "48ee14bd-aa41-4233-91a9-15c74c3b60e2");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5dd80754-11dc-4412-a49c-1b7b25705a70");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "820a4664-18ab-4068-bdad-8b88f8668027");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bd15321f-0906-4925-adb3-92f9360f7ef9");

            migrationBuilder.CreateTable(
                name: "StockTransfers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    SourceWarehouseId = table.Column<int>(type: "int", nullable: false),
                    DestinationWarehouseId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "longtext", nullable: true, collation: "utf8mb4_general_ci"),
                    TransferredByUserId = table.Column<string>(type: "varchar(255)", nullable: false, collation: "utf8mb4_general_ci"),
                    UUID = table.Column<string>(type: "varchar(255)", nullable: false, collation: "utf8mb4_general_ci"),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockTransfers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockTransfers_AspNetUsers_TransferredByUserId",
                        column: x => x.TransferredByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StockTransfers_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StockTransfers_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StockTransfers_Warehouses_DestinationWarehouseId",
                        column: x => x.DestinationWarehouseId,
                        principalTable: "Warehouses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StockTransfers_Warehouses_SourceWarehouseId",
                        column: x => x.SourceWarehouseId,
                        principalTable: "Warehouses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "3cb5761f-0dc0-4d2b-a92d-c3d05eb84626", null, "cashier", "CASHIER" },
                    { "52543cdf-e3c7-4eef-aa04-738f046b2fe6", null, "user", "USER" },
                    { "6fd91001-fc1c-4982-b885-84f7192bf164", null, "admin", "ADMIN" },
                    { "9d512431-19c3-44ab-8104-95eaae4d7a78", null, "superadmin", "SUPERADMIN" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_StockTransfers_CompanyId_CreatedOn",
                table: "StockTransfers",
                columns: new[] { "CompanyId", "CreatedOn" });

            migrationBuilder.CreateIndex(
                name: "IX_StockTransfers_DestinationWarehouseId",
                table: "StockTransfers",
                column: "DestinationWarehouseId");

            migrationBuilder.CreateIndex(
                name: "IX_StockTransfers_ProductId",
                table: "StockTransfers",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_StockTransfers_SourceWarehouseId",
                table: "StockTransfers",
                column: "SourceWarehouseId");

            migrationBuilder.CreateIndex(
                name: "IX_StockTransfers_TransferredByUserId",
                table: "StockTransfers",
                column: "TransferredByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_StockTransfers_UUID",
                table: "StockTransfers",
                column: "UUID",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StockTransfers");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3cb5761f-0dc0-4d2b-a92d-c3d05eb84626");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "52543cdf-e3c7-4eef-aa04-738f046b2fe6");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6fd91001-fc1c-4982-b885-84f7192bf164");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9d512431-19c3-44ab-8104-95eaae4d7a78");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "48ee14bd-aa41-4233-91a9-15c74c3b60e2", null, "superadmin", "SUPERADMIN" },
                    { "5dd80754-11dc-4412-a49c-1b7b25705a70", null, "cashier", "CASHIER" },
                    { "820a4664-18ab-4068-bdad-8b88f8668027", null, "user", "USER" },
                    { "bd15321f-0906-4925-adb3-92f9360f7ef9", null, "admin", "ADMIN" }
                });
        }
    }
}
