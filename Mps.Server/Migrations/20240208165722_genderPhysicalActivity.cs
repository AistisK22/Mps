using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mps.Server.Migrations
{
    /// <inheritdoc />
    public partial class genderPhysicalActivity : Migration
    {

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");
        }
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {        
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    id_User = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    surname = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    password = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    birth = table.Column<DateOnly>(type: "date", nullable: false),
                    email = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    role = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    active = table.Column<bool>(type: "bit", nullable: false),
                    weight = table.Column<decimal>(type: "decimal(7,3)", nullable: false),
                    height = table.Column<decimal>(type: "decimal(4,1)", nullable: false),
                    Gender = table.Column<int>(type: "int", nullable: false),
                    PhysicalActivityLevel = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Users__556495566E6D9DF6", x => x.id_User);
                });
        
        }

    }
}
