using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LOCPS.Migrations
{
    /// <inheritdoc />
    public partial class seedingData : Migration
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
                name: "Oldvalue",
                table: "Auditlogs",
                newName: "OldValue");

            migrationBuilder.RenameColumn(
                name: "Newvalue",
                table: "Auditlogs",
                newName: "NewValue");

            migrationBuilder.RenameColumn(
                name: "Auditid",
                table: "Auditlogs",
                newName: "AuditId");

            migrationBuilder.RenameColumn(
                name: "ApprovalStatusApprovalId",
                table: "Approval",
                newName: "ApprovalStatus");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "OldValue",
                table: "Auditlogs",
                newName: "Oldvalue");

            migrationBuilder.RenameColumn(
                name: "NewValue",
                table: "Auditlogs",
                newName: "Newvalue");

            migrationBuilder.RenameColumn(
                name: "AuditId",
                table: "Auditlogs",
                newName: "Auditid");

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
