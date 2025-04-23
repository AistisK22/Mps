namespace Mps.Server.NewModels
{
    public class RecipeDto
    {
        public string Title { get; set; } = null!;

        public string Summary { get; set; } = null!;

        public int ReadyInMinutes { get; set; }

        public string Image { get; set; } = null!;

        public int Id { get; set; }
        public int Servings { get; set; }
        public int DishType { get; set; }
        public DateTime PlanDate { get; set; }
    }
}
