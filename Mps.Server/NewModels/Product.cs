using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class Product
{
    public int IdProduct { get; set; }

    public string Title { get; set; } = null!;

    public decimal Calories { get; set; }

    public decimal Fat { get; set; }

    public decimal Protein { get; set; }

    public decimal Carbs { get; set; }

    public string? Image { get; set; }

    public virtual DishProduct? DishProduct { get; set; }

    public virtual ICollection<RecipeIngredient> RecipeIngredients { get; set; } = new List<RecipeIngredient>();

    public virtual ICollection<UserProduct> UserProducts { get; set; } = new List<UserProduct>();
}
