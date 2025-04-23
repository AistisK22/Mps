using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class MeasurementUnit
{
    public int IdMeasurementUnits { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<DishProduct> DishProducts { get; set; } = new List<DishProduct>();

    public virtual ICollection<RecipeIngredient> RecipeIngredients { get; set; } = new List<RecipeIngredient>();

    public virtual ICollection<UserProduct> UserProducts { get; set; } = new List<UserProduct>();
}
