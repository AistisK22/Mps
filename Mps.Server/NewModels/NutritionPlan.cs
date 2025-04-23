using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class NutritionPlan
{
    public int IdNutritionPlan { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public int State { get; set; }

    public int IdUser { get; set; }

    public virtual User IdUserNavigation { get; set; } = null!;

    public virtual ICollection<NutritionPlanDay> NutritionPlanDays { get; set; } = new List<NutritionPlanDay>();
}
