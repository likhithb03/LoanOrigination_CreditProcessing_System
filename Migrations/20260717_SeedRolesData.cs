using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LOCPS.Migrations
{
    /// <inheritdoc />
    public partial class SeedRolesData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)

        {
            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "RoleId", "Roles", "RoleDescription", "IsActive", "CreatedDate" },
                values: new object[,]
                {
                    { 1, 0, "Customer role for loan applicants", true, new DateTime(2025, 7, 17, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, 1, "Admin role for system administration", true, new DateTime(2025, 7, 17, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, 2, "Loan Officer role for processing loans", true, new DateTime(2025, 7, 17, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, 3, "UnderWriter role for loan underwriting", true, new DateTime(2025, 7, 17, 0, 0, 0, DateTimeKind.Utc) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "RoleId",
                keyValues: new object[] { 1, 2, 3, 4 });
        }
    }
}
