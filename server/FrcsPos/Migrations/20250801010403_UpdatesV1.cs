using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FrcsPos.Migrations
{
    /// <inheritdoc />
    public partial class UpdatesV1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_POSTerminals_Companies_CompanyId",
                table: "POSTerminals");

            migrationBuilder.DropForeignKey(
                name: "FK_Sales_POSTerminals_POSTerminalId",
                table: "Sales");

            migrationBuilder.DropTable(
                name: "CashierTerminals");

            migrationBuilder.DropPrimaryKey(
                name: "PK_POSTerminals",
                table: "POSTerminals");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2190467b-de79-42a8-a6e8-d7a0d996a1b6");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5dd46b13-87bf-4ee2-b2ee-9b4184b995fb");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "73c6ab14-2e0a-4d83-b4c4-eb9aec119c1e");

            migrationBuilder.RenameTable(
                name: "POSTerminals",
                newName: "PosTerminals");

            migrationBuilder.RenameColumn(
                name: "POSTerminalId",
                table: "Sales",
                newName: "PosTerminalId");

            migrationBuilder.RenameIndex(
                name: "IX_Sales_POSTerminalId",
                table: "Sales",
                newName: "IX_Sales_PosTerminalId");

            migrationBuilder.RenameIndex(
                name: "IX_POSTerminals_SerialNumber",
                table: "PosTerminals",
                newName: "IX_PosTerminals_SerialNumber");

            migrationBuilder.RenameIndex(
                name: "IX_POSTerminals_CompanyId_Name",
                table: "PosTerminals",
                newName: "IX_PosTerminals_CompanyId_Name");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PosTerminals",
                table: "PosTerminals",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "PosSessions",
                columns: table => new
                {
                    PosTerminalId = table.Column<int>(type: "int", nullable: false),
                    PosUserId = table.Column<string>(type: "varchar(255)", nullable: false, collation: "utf8mb4_general_ci"),
                    UserId = table.Column<string>(type: "varchar(255)", nullable: true, collation: "utf8mb4_general_ci"),
                    Id = table.Column<int>(type: "int", nullable: false),
                    UUID = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_general_ci"),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PosSessions", x => new { x.PosTerminalId, x.PosUserId });
                    table.ForeignKey(
                        name: "FK_PosSessions_AspNetUsers_PosUserId",
                        column: x => x.PosUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PosSessions_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PosSessions_PosTerminals_PosTerminalId",
                        column: x => x.PosTerminalId,
                        principalTable: "PosTerminals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("Relational:Collation", "utf8mb4_general_ci");

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
                name: "IX_PosSessions_PosUserId",
                table: "PosSessions",
                column: "PosUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PosSessions_UserId",
                table: "PosSessions",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_PosTerminals_Companies_CompanyId",
                table: "PosTerminals",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Sales_PosTerminals_PosTerminalId",
                table: "Sales",
                column: "PosTerminalId",
                principalTable: "PosTerminals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PosTerminals_Companies_CompanyId",
                table: "PosTerminals");

            migrationBuilder.DropForeignKey(
                name: "FK_Sales_PosTerminals_PosTerminalId",
                table: "Sales");

            migrationBuilder.DropTable(
                name: "PosSessions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PosTerminals",
                table: "PosTerminals");

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

            migrationBuilder.RenameTable(
                name: "PosTerminals",
                newName: "POSTerminals");

            migrationBuilder.RenameColumn(
                name: "PosTerminalId",
                table: "Sales",
                newName: "POSTerminalId");

            migrationBuilder.RenameIndex(
                name: "IX_Sales_PosTerminalId",
                table: "Sales",
                newName: "IX_Sales_POSTerminalId");

            migrationBuilder.RenameIndex(
                name: "IX_PosTerminals_SerialNumber",
                table: "POSTerminals",
                newName: "IX_POSTerminals_SerialNumber");

            migrationBuilder.RenameIndex(
                name: "IX_PosTerminals_CompanyId_Name",
                table: "POSTerminals",
                newName: "IX_POSTerminals_CompanyId_Name");

            migrationBuilder.AddPrimaryKey(
                name: "PK_POSTerminals",
                table: "POSTerminals",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "CashierTerminals",
                columns: table => new
                {
                    PosTerminalId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "varchar(255)", nullable: false, collation: "utf8mb4_general_ci"),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    UUID = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_general_ci"),
                    UpdatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CashierTerminals", x => new { x.PosTerminalId, x.UserId });
                    table.ForeignKey(
                        name: "FK_CashierTerminals_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CashierTerminals_POSTerminals_PosTerminalId",
                        column: x => x.PosTerminalId,
                        principalTable: "POSTerminals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("Relational:Collation", "utf8mb4_general_ci");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "2190467b-de79-42a8-a6e8-d7a0d996a1b6", null, "admin", "ADMIN" },
                    { "5dd46b13-87bf-4ee2-b2ee-9b4184b995fb", null, "user", "USER" },
                    { "73c6ab14-2e0a-4d83-b4c4-eb9aec119c1e", null, "superadmin", "SUPERADMIN" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CashierTerminals_UserId",
                table: "CashierTerminals",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_POSTerminals_Companies_CompanyId",
                table: "POSTerminals",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Sales_POSTerminals_POSTerminalId",
                table: "Sales",
                column: "POSTerminalId",
                principalTable: "POSTerminals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
