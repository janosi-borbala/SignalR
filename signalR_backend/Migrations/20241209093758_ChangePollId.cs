using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace signalR_backend.Migrations
{
    /// <inheritdoc />
    public partial class ChangePollId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Key",
                table: "Polls",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            // Generate unique values for the new Key column for existing rows
            migrationBuilder.Sql(@"
        UPDATE Polls
        SET Key = substr('abcdefghijklmnopqrstuvwxyz0123456789', abs(random() % 36) + 1, 8) || abs(random() % 10000)
        WHERE Key = '' OR Key IS NULL;
    ");

            migrationBuilder.CreateIndex(
                name: "IX_Polls_Key",
                table: "Polls",
                column: "Key",
                unique: true);
        }


        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Polls_Key",
                table: "Polls");

            migrationBuilder.DropColumn(
                name: "Key",
                table: "Polls");
        }
    }
}
