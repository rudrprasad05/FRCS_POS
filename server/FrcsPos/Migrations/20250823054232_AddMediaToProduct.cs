using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FrcsPos.Migrations
{
    /// <inheritdoc />
    public partial class AddMediaToProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MediaId",
                table: "Products",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_MediaId",
                table: "Products",
                column: "MediaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Medias_MediaId",
                table: "Products",
                column: "MediaId",
                principalTable: "Medias",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Medias_MediaId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_MediaId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MediaId",
                table: "Products");
        }
    }
}
