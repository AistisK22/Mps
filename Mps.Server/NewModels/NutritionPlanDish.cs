using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class NutritionPlanDish
{
    public int IdNutritionPlanDish { get; set; }

    public decimal Servings { get; set; }

    public decimal ServingsConsumed { get; set; }

    public int DishType { get; set; }

    public int? IdRecipe { get; set; }

    public int IdNutritionPlanDay { get; set; }

    public int IdNutritionPlan { get; set; }

    public int IdDish { get; set; }

    public virtual DishType DishTypeNavigation { get; set; } = null!;

    public virtual Dish IdDishNavigation { get; set; } = null!;

    public virtual Recipe? IdRecipeNavigation { get; set; }

    public virtual NutritionPlanDay NutritionPlanDay { get; set; } = null!;
}
