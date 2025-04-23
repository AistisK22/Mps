using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class PhysicalActivityLevel
{
    public int IdPhysicalActivityLevels { get; set; }

    public string Name { get; set; } = null!;
    public decimal Value { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
