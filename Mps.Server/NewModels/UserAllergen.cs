using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class UserAllergen
{
    public int IdAllergen { get; set; }

    public int IdUser { get; set; }

    public virtual Allergen IdAllergenNavigation { get; set; } = null!;
}
