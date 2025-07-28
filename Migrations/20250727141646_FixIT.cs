using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InterntManagementSystem.Migrations
{
    /// <inheritdoc />
    public partial class FixIT : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InternTasks_Interns_InternId",
                table: "InternTasks");

            migrationBuilder.DropIndex(
                name: "IX_InternTasks_InternId",
                table: "InternTasks");

            migrationBuilder.DropColumn(
                name: "InternId",
                table: "InternTasks");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InternId",
                table: "InternTasks",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_InternTasks_InternId",
                table: "InternTasks",
                column: "InternId");

            migrationBuilder.AddForeignKey(
                name: "FK_InternTasks_Interns_InternId",
                table: "InternTasks",
                column: "InternId",
                principalTable: "Interns",
                principalColumn: "Id");
        }
    }
}
