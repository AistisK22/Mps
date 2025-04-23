using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mps.Server.Migrations
{
    /// <inheritdoc />
    public partial class CascadeDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "marks",
                table: "Goals");

            migrationBuilder.DropForeignKey(
                name: "are1",
                table: "LikedCategories");

            migrationBuilder.DropForeignKey(
                name: "marks1",
                table: "LikedCategories");

            migrationBuilder.DropForeignKey(
                name: "creates2",
                table: "NutritionPlans");

            migrationBuilder.DropForeignKey(
                name: "creates",
                table: "ShoppingLists");

            migrationBuilder.DropForeignKey(
                name: "FK__UserAller__fk_Al__19AACF41",
                table: "UserAllergens");

            migrationBuilder.DropForeignKey(
                name: "FK__UserAller__fk_Us__1A9EF37A",
                table: "UserAllergens");

            migrationBuilder.AddForeignKey(
                name: "marks",
                table: "Goals",
                column: "fk_Userid_User",
                principalTable: "Users",
                principalColumn: "id_User",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "are1",
                table: "LikedCategories",
                column: "fk_Categoryid_Category",
                principalTable: "Categories",
                principalColumn: "id_Category",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "marks1",
                table: "LikedCategories",
                column: "fk_Userid_User",
                principalTable: "Users",
                principalColumn: "id_User",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "creates2",
                table: "NutritionPlans",
                column: "fk_Userid_User",
                principalTable: "Users",
                principalColumn: "id_User",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "creates",
                table: "ShoppingLists",
                column: "fk_Userid_User",
                principalTable: "Users",
                principalColumn: "id_User",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK__UserAller__fk_Al__19AACF41",
                table: "UserAllergens",
                column: "fk_Allergenid_Allergen",
                principalTable: "Allergens",
                principalColumn: "id_Allergen",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK__UserAller__fk_Us__1A9EF37A",
                table: "UserAllergens",
                column: "fk_Userid_User",
                principalTable: "Users",
                principalColumn: "id_User",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "marks",
                table: "Goals");

            migrationBuilder.DropForeignKey(
                name: "are1",
                table: "LikedCategories");

            migrationBuilder.DropForeignKey(
                name: "marks1",
                table: "LikedCategories");

            migrationBuilder.DropForeignKey(
                name: "creates2",
                table: "NutritionPlans");

            migrationBuilder.DropForeignKey(
                name: "creates",
                table: "ShoppingLists");

            migrationBuilder.DropForeignKey(
                name: "FK__UserAller__fk_Al__19AACF41",
                table: "UserAllergens");

            migrationBuilder.DropForeignKey(
                name: "FK__UserAller__fk_Us__1A9EF37A",
                table: "UserAllergens");

            migrationBuilder.AddForeignKey(
                name: "marks",
                table: "Goals",
                column: "fk_Userid_User",
                principalTable: "Users",
                principalColumn: "id_User");

            migrationBuilder.AddForeignKey(
                name: "are1",
                table: "LikedCategories",
                column: "fk_Categoryid_Category",
                principalTable: "Categories",
                principalColumn: "id_Category");

            migrationBuilder.AddForeignKey(
                name: "marks1",
                table: "LikedCategories",
                column: "fk_Userid_User",
                principalTable: "Users",
                principalColumn: "id_User");

            migrationBuilder.AddForeignKey(
                name: "creates2",
                table: "NutritionPlans",
                column: "fk_Userid_User",
                principalTable: "Users",
                principalColumn: "id_User");

            migrationBuilder.AddForeignKey(
                name: "creates",
                table: "ShoppingLists",
                column: "fk_Userid_User",
                principalTable: "Users",
                principalColumn: "id_User");

            migrationBuilder.AddForeignKey(
                name: "FK__UserAller__fk_Al__19AACF41",
                table: "UserAllergens",
                column: "fk_Allergenid_Allergen",
                principalTable: "Allergens",
                principalColumn: "id_Allergen");

            migrationBuilder.AddForeignKey(
                name: "FK__UserAller__fk_Us__1A9EF37A",
                table: "UserAllergens",
                column: "fk_Userid_User",
                principalTable: "Users",
                principalColumn: "id_User");
        }
    }
}
