using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class RecipeIngredient
{
    public int IdRecipeIngredient { get; set; }

    public decimal Quantity { get; set; }

    public int MeasurementUnit { get; set; }

    public int IdProduct { get; set; }

    public int IdRecipe { get; set; }

    public virtual Product IdProductNavigation { get; set; } = null!;

    public virtual Recipe IdRecipeNavigation { get; set; } = null!;

    public virtual MeasurementUnit MeasurementUnitNavigation { get; set; } = null!;
}
