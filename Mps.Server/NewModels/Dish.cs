using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class Dish
{
    public int IdDish { get; set; }

    public string Title { get; set; } = null!;

    public string? Image { get; set; }

    public virtual ICollection<DishProduct> DishProducts { get; set; } = new List<DishProduct>();

    public virtual ICollection<NutritionPlanDish> NutritionPlanDishes { get; set; } = new List<NutritionPlanDish>();
}
