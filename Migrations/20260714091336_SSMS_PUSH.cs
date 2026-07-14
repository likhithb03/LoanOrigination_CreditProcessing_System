using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LOCPS.Migrations
{
    /// <inheritdoc />
    public partial class SSMS_PUSH : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Approval_Approval_ApprovalStatusApprovalId",
                table: "Approval");

            migrationBuilder.DropIndex(
                name: "IX_Approval_ApprovalStatusApprovalId",
                table: "Approval");

            migrationBuilder.RenameColumn(
                name: "ApprovalStatusApprovalId",
                table: "Approval",
                newName: "ApprovalStatus");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ApprovalStatus",
                table: "Approval",
                newName: "ApprovalStatusApprovalId");

            migrationBuilder.CreateIndex(
                name: "IX_Approval_ApprovalStatusApprovalId",
                table: "Approval",
                column: "ApprovalStatusApprovalId");

            migrationBuilder.AddForeignKey(
                name: "FK_Approval_Approval_ApprovalStatusApprovalId",
                table: "Approval",
                column: "ApprovalStatusApprovalId",
                principalTable: "Approval",
                principalColumn: "ApprovalId");
        }
    }
}
