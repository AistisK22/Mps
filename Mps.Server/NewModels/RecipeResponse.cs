namespace Mps.Server.NewModels
{
    public class RecipeResponse
    {
        public List<RecipeInformation> Results { get; set; } = [];
        public string Type { get; set; } = "";
    }

    public class RecipeInformation
    {
        public int Id { get; set; } = 0;
        public string Title { get; set; } = "";
        public int ReadyInMinutes { get; set; } = 0;
        public string Image { get; set; } = "";
        public string Summary { get; set; } = "";
        public int Servings { get; set; } = 0;
        public Nutrition Nutrition { get; set; } = new();
        public DateTime PlanDate { get; set; }
        public int DishType { get; set; }
        public List<Instruction> AnalyzedInstructions { get; set; } = [];
    }

    public class Nutrition
    {
        public List<Nutrient> Nutrients { get; set; } = [];
        public List<Ingredient> Ingredients { get; set; } = [];
        public WeightPerServing WeightPerServing { get; set; } = new();
    }

    public class Nutrient 
    {
        public string Name { get; set; } = "";
        public decimal Amount { get; set; } = 0;
        public string Unit { get; set; } = "";
    }

    public class Ingredient
    {
        public string Name { get; set; } = "";
        public decimal Amount { get; set; } = 0;
        public string Unit { get; set; } = "";
        public List<Nutrient> Nutrients { get; set; } = [];
    }

    public class Instruction
    {
        public List<Steps> Steps { get; set; } = [];
    }

    public class Steps
    {
        public string Step { get; set; } = "";
    }

    public class WeightPerServing
    {
        public string Unit { get; set; } = "";
        public int Amount { get; set; }
    }
}
