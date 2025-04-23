using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class UserCategory
{
    public int IdCategory { get; set; }

    public int IdUser { get; set; }

    public virtual Category IdCategoryNavigation { get; set; } = null!;
}
