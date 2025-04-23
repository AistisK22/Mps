using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class ShoppingListProduct
{
    public int IdShoppingList { get; set; }

    public int IdProduct { get; set; }

    public virtual ShoppingList IdShoppingListNavigation { get; set; } = null!;
}
