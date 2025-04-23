using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class Allergen
{
    public int IdAllergen { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<UserAllergen> UserAllergens { get; set; } = new List<UserAllergen>();
}
