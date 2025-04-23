using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class UserProduct
{
    public int IdUserProduct { get; set; }

    public DateOnly ExpirationDate { get; set; }

    public string Note { get; set; } = null!;

    public decimal Quantity { get; set; }

    public int MeasurementUnit { get; set; }

    public int IdProduct { get; set; }

    public int IdUser { get; set; }

    public virtual Product IdProductNavigation { get; set; } = null!;

    public virtual User IdUserNavigation { get; set; } = null!;

    public virtual MeasurementUnit MeasurementUnitNavigation { get; set; } = null!;
}
