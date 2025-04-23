using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class Category
{
    public int IdCategory { get; set; }

    public string Title { get; set; } = null!;

    public virtual ICollection<CategoryProduct> CategoryProducts { get; set; } = new List<CategoryProduct>();

    public virtual ICollection<UserCategory> UserCategories { get; set; } = new List<UserCategory>();
}
