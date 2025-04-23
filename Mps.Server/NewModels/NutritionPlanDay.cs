using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class NutritionPlanDay
{
    public int IdNutritionPlanDay { get; set; }

    public DateOnly Date { get; set; }

    public int IdNutritionPlan { get; set; }

    public virtual NutritionPlan IdNutritionPlanNavigation { get; set; } = null!;

    public virtual ICollection<NutritionPlanDish> NutritionPlanDishes { get; set; } = new List<NutritionPlanDish>();
}
