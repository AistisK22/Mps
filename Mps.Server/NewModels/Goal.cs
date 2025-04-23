using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class Goal
{
    public int IdGoal { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }
    public decimal Coef { get; set; } = 0;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
