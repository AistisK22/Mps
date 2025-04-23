namespace Mps.Server.NewModels
{
    public class CustomRecipeDto
    {
        public int IdRecipe { get; set; }

        public string Title { get; set; } = null!;

        public string Summary { get; set; } = null!;

        public int ReadyInMinutes { get; set; }

        public string Image { get; set; } = null!;
        public IFormFile? ImageFile { get; set; } = null;

        public int SpoonacularId { get; set; }
        public string? Instructions { get; set; }
        public string WeightPerServing { get; set; } = "";
        public int IdUser { get; set; }

        public virtual User? IdUserNavigation { get; set; } = null;

        public virtual ICollection<RecipeIngredient> RecipeIngredients { get; set; } = new List<RecipeIngredient>();
    }
}
