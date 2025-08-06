using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FrcsPos.Migrations
{
    /// <inheritdoc />
    public partial class AddQuickConnectUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuickConnect_QuickConnectMobile_QuickConnectMobileId",
                table: "QuickConnect");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0e63ec66-4566-42c7-80b5-cf4f7be187d9");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5dc98e0f-a47c-448d-a6a5-d858dc85c75b");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "72045100-4ff9-4caf-9c3c-698017332e82");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e55735e8-7a63-4697-a2ac-3447134eda4a");

            migrationBuilder.AlterColumn<int>(
                name: "QuickConnectMobileId",
                table: "QuickConnect",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

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

            migrationBuilder.AddForeignKey(
                name: "FK_QuickConnect_QuickConnectMobile_QuickConnectMobileId",
                table: "QuickConnect",
                column: "QuickConnectMobileId",
                principalTable: "QuickConnectMobile",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuickConnect_QuickConnectMobile_QuickConnectMobileId",
                table: "QuickConnect");

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

            migrationBuilder.AlterColumn<int>(
                name: "QuickConnectMobileId",
                table: "QuickConnect",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "0e63ec66-4566-42c7-80b5-cf4f7be187d9", null, "user", "USER" },
                    { "5dc98e0f-a47c-448d-a6a5-d858dc85c75b", null, "cashier", "CASHIER" },
                    { "72045100-4ff9-4caf-9c3c-698017332e82", null, "superadmin", "SUPERADMIN" },
                    { "e55735e8-7a63-4697-a2ac-3447134eda4a", null, "admin", "ADMIN" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_QuickConnect_QuickConnectMobile_QuickConnectMobileId",
                table: "QuickConnect",
                column: "QuickConnectMobileId",
                principalTable: "QuickConnectMobile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
