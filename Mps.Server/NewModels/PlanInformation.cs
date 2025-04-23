namespace Mps.Server.NewModels
{
    public class PlanInformation
    {
        public int IdNutritionPlan { get; set; }

        public DateOnly StartDate { get; set; }

        public DateOnly EndDate { get; set; }
        public decimal Calories { get; set; }
        public decimal ConsumedCalories { get; set; }

        public decimal Fat { get; set; }
        public decimal ConsumedFat { get; set; }

        public decimal Protein { get; set; }
        public decimal ConsumedProtein { get; set; }

        public decimal Carbs { get; set; }
        public decimal ConsumedCarbs { get; set; }
    }
}
