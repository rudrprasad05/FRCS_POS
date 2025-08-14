using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FrcsPos.Migrations
{
    /// <inheritdoc />
    public partial class UserCreatedOn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "35bc88b2-949d-463b-9eda-bd8e771b4b4f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e9a08097-400b-419a-8b11-49d8d4678620");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "f18dec58-d11c-406f-8ed0-2d8c24c06f87");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "fbe401bf-3def-41de-bf0c-69995b562073");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "AspNetUsers",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "AspNetUsers",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedOn",
                table: "AspNetUsers",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "Medias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Url = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_general_ci"),
                    ObjectKey = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_general_ci"),
                    AltText = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_general_ci"),
                    FileName = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_general_ci"),
                    ContentType = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_general_ci"),
                    SizeInBytes = table.Column<long>(type: "bigint", nullable: false),
                    ShowInGallery = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    UUID = table.Column<string>(type: "varchar(255)", nullable: false, collation: "utf8mb4_general_ci"),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medias", x => x.Id);
                })
                .Annotation("Relational:Collation", "utf8mb4_general_ci");

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

            migrationBuilder.CreateIndex(
                name: "IX_Medias_UUID",
                table: "Medias",
                column: "UUID",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Medias");

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

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "UpdatedOn",
                table: "AspNetUsers");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "35bc88b2-949d-463b-9eda-bd8e771b4b4f", null, "cashier", "CASHIER" },
                    { "e9a08097-400b-419a-8b11-49d8d4678620", null, "user", "USER" },
                    { "f18dec58-d11c-406f-8ed0-2d8c24c06f87", null, "admin", "ADMIN" },
                    { "fbe401bf-3def-41de-bf0c-69995b562073", null, "superadmin", "SUPERADMIN" }
                });
        }
    }
}
