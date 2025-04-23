using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class Gender
{
    public int IdGenders { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
