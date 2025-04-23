using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class DishProduct
{
    public int IdDishProduct { get; set; }

    public decimal Quantity { get; set; }

    public int MeasurementUnit { get; set; }

    public int IdDish { get; set; }

    public int IdProduct { get; set; }

    public virtual Dish IdDishNavigation { get; set; } = null!;

    public virtual Product IdProductNavigation { get; set; } = null!;

    public virtual MeasurementUnit MeasurementUnitNavigation { get; set; } = null!;
}
