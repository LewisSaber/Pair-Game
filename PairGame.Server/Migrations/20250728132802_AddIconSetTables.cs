using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PairGame.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddIconSetTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "IconSets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IconSets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IconImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FilePath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IconSetId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IconImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IconImages_IconSets_IconSetId",
                        column: x => x.IconSetId,
                        principalTable: "IconSets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_IconImages_IconSetId",
                table: "IconImages",
                column: "IconSetId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IconImages");

            migrationBuilder.DropTable(
                name: "IconSets");
        }
    }
}
