using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FrcsPos.Migrations
{
    /// <inheritdoc />
    public partial class WithManyBatches : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductBatches_Products_ProductId1",
                table: "ProductBatches");

            migrationBuilder.DropIndex(
                name: "IX_ProductBatches_ProductId1",
                table: "ProductBatches");

            migrationBuilder.DropColumn(
                name: "ProductId1",
                table: "ProductBatches");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProductId1",
                table: "ProductBatches",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductBatches_ProductId1",
                table: "ProductBatches",
                column: "ProductId1");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductBatches_Products_ProductId1",
                table: "ProductBatches",
                column: "ProductId1",
                principalTable: "Products",
                principalColumn: "Id");
        }
    }
}
