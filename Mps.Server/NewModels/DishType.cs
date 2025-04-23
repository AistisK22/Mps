using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class DishType
{
    public int IdDishTypes { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<NutritionPlanDish> NutritionPlanDishes { get; set; } = new List<NutritionPlanDish>();
}
