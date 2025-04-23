using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class CategoryProduct
{
    public int IdCategory { get; set; }

    public int IdProduct { get; set; }

    public virtual Category IdCategoryNavigation { get; set; } = null!;
}
