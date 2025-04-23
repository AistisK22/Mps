using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class ShoppingList
{
    public int IdShoppingList { get; set; }

    public string Title { get; set; } = null!;

    public string? Image { get; set; }

    public int IdUser { get; set; }

    public virtual User IdUserNavigation { get; set; } = null!;

    public virtual ICollection<ShoppingListProduct> ShoppingListProducts { get; set; } = new List<ShoppingListProduct>();
}
