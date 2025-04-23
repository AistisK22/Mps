using System;
using System.Collections.Generic;

namespace Mps.Server.NewModels;

public partial class User
{
    public int IdUser { get; set; }

    public string Name { get; set; } = null!;

    public string Surname { get; set; } = null!;

    public string Password { get; set; } = null!;

    public DateOnly Birthdate { get; set; }

    public string Email { get; set; } = null!;

    public string Role { get; set; } = null!;

    public bool Active { get; set; }

    public decimal Weight { get; set; }

    public decimal Height { get; set; }

    public int Gender { get; set; }

    public int PhysicalActivityLevel { get; set; }

    public int IdGoal { get; set; }

    public virtual Gender GenderNavigation { get; set; } = null!;

    public virtual Goal IdGoalNavigation { get; set; } = null!;

    public virtual ICollection<NutritionPlan> NutritionPlans { get; set; } = new List<NutritionPlan>();
    public virtual ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();

    public virtual PhysicalActivityLevel PhysicalActivityLevelNavigation { get; set; } = null!;

    public virtual ICollection<ShoppingList> ShoppingLists { get; set; } = new List<ShoppingList>();

    public virtual ICollection<UserProduct> UserProducts { get; set; } = new List<UserProduct>();

    public decimal BMI
    {
        get
        {
            if (Height <= 0 || Weight <= 0)
            {
                return 0;
            }
            else
            {
                return decimal.Round(Weight / (decimal)Math.Pow((double)(Height / 100), 2), 2);
            }
        }
    }
}
