using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FrcsPos.Migrations
{
    /// <inheritdoc />
    public partial class AddMediaToPV : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MediaId",
                table: "ProductVariants",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductVariants_MediaId",
                table: "ProductVariants",
                column: "MediaId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductVariants_Medias_MediaId",
                table: "ProductVariants",
                column: "MediaId",
                principalTable: "Medias",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductVariants_Medias_MediaId",
                table: "ProductVariants");

            migrationBuilder.DropIndex(
                name: "IX_ProductVariants_MediaId",
                table: "ProductVariants");

            migrationBuilder.DropColumn(
                name: "MediaId",
                table: "ProductVariants");
        }
    }
}
