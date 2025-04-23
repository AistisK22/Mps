using System;
using System.Collections.Generic;
using Mps.Server.NewModels;
using Microsoft.EntityFrameworkCore;

namespace Mps.Server.Data;

public partial class MpsContext : DbContext
{
    public MpsContext()
    {
    }

    public MpsContext(DbContextOptions<MpsContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Allergen> Allergens { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<CategoryProduct> CategoryProducts { get; set; }

    public virtual DbSet<Dish> Dishes { get; set; }

    public virtual DbSet<DishProduct> DishProducts { get; set; }

    public virtual DbSet<DishType> DishTypes { get; set; }

    public virtual DbSet<Gender> Genders { get; set; }

    public virtual DbSet<Goal> Goals { get; set; }

    public virtual DbSet<MeasurementUnit> MeasurementUnits { get; set; }

    public virtual DbSet<NutritionPlan> NutritionPlans { get; set; }

    public virtual DbSet<NutritionPlanDay> NutritionPlanDays { get; set; }

    public virtual DbSet<NutritionPlanDish> NutritionPlanDishes { get; set; }

    public virtual DbSet<PhysicalActivityLevel> PhysicalActivityLevels { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Recipe> Recipes { get; set; }

    public virtual DbSet<RecipeIngredient> RecipeIngredients { get; set; }

    public virtual DbSet<ShoppingList> ShoppingLists { get; set; }

    public virtual DbSet<ShoppingListProduct> ShoppingListProducts { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserAllergen> UserAllergens { get; set; }

    public virtual DbSet<UserCategory> UserCategories { get; set; }

    public virtual DbSet<UserProduct> UserProducts { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=MPS_Back");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Allergen>(entity =>
        {
            entity.HasKey(e => e.IdAllergen).HasName("PK__Allergen__DD02E7A972E03625");

            entity.Property(e => e.IdAllergen).HasColumnName("id_Allergen");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.IdCategory).HasName("PK__Categori__5C2BE2591C54249D");

            entity.Property(e => e.IdCategory).HasColumnName("id_Category");
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("title");
        });

        modelBuilder.Entity<CategoryProduct>(entity =>
        {
            entity.HasKey(e => new { e.IdCategory, e.IdProduct }).HasName("PK__Category__96A96A7C800500CD");

            entity.Property(e => e.IdCategory).HasColumnName("id_Category");
            entity.Property(e => e.IdProduct).HasColumnName("id_Product");

            entity.HasOne(d => d.IdCategoryNavigation).WithMany(p => p.CategoryProducts)
                .HasForeignKey(d => d.IdCategory)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("belongs1");
        });

        modelBuilder.Entity<Dish>(entity =>
        {
            entity.HasKey(e => e.IdDish).HasName("PK__Dishes__5A70303AB43B50C1");

            entity.Property(e => e.IdDish).HasColumnName("id_Dish");
            entity.Property(e => e.Image)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("image");
            entity.Property(e => e.Title)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("title");
        });

        modelBuilder.Entity<DishProduct>(entity =>
        {
            entity.HasKey(e => e.IdDishProduct).HasName("PK__DishProd__6E3B3E5910C966C5");

            entity.HasIndex(e => e.IdProduct, "UQ__DishProd__A828825C77D6E49E").IsUnique();

            entity.Property(e => e.IdDishProduct)
                .ValueGeneratedNever()
                .HasColumnName("id_DishProduct");
            entity.Property(e => e.IdDish).HasColumnName("id_Dish");
            entity.Property(e => e.IdProduct).HasColumnName("id_Product");
            entity.Property(e => e.MeasurementUnit).HasColumnName("measurementUnit");
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("quantity");

            entity.HasOne(d => d.IdDishNavigation).WithMany(p => p.DishProducts)
                .HasForeignKey(d => d.IdDish)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__DishProdu__id_Di__3C69FB99");

            entity.HasOne(d => d.IdProductNavigation).WithOne(p => p.DishProduct)
                .HasForeignKey<DishProduct>(d => d.IdProduct)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__DishProdu__id_Pr__3D5E1FD2");

            entity.HasOne(d => d.MeasurementUnitNavigation).WithMany(p => p.DishProducts)
                .HasForeignKey(d => d.MeasurementUnit)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__DishProdu__measu__3B75D760");
        });

        modelBuilder.Entity<DishType>(entity =>
        {
            entity.HasKey(e => e.IdDishTypes).HasName("PK__DishType__F65BC3F3437FD409");

            entity.Property(e => e.IdDishTypes)
                .ValueGeneratedNever()
                .HasColumnName("id_DishTypes");
            entity.Property(e => e.Name)
                .HasMaxLength(9)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("name");
        });

        modelBuilder.Entity<Gender>(entity =>
        {
            entity.HasKey(e => e.IdGenders).HasName("PK__Genders__45E3FB90310DA1F8");

            entity.Property(e => e.IdGenders)
                .ValueGeneratedNever()
                .HasColumnName("id_Genders");
            entity.Property(e => e.Name)
                .HasMaxLength(6)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("name");
        });

        modelBuilder.Entity<Goal>(entity =>
        {
            entity.HasKey(e => e.IdGoal).HasName("PK__Goals__F196ED82FEBAABF5");

            entity.Property(e => e.IdGoal).HasColumnName("id_Goal");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("name");
        });

        modelBuilder.Entity<MeasurementUnit>(entity =>
        {
            entity.HasKey(e => e.IdMeasurementUnits).HasName("PK__Measurem__61830549FD5F5353");

            entity.Property(e => e.IdMeasurementUnits)
                .ValueGeneratedNever()
                .HasColumnName("id_MeasurementUnits");
            entity.Property(e => e.Name)
                .HasMaxLength(9)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("name");
        });

        modelBuilder.Entity<NutritionPlan>(entity =>
        {
            entity.HasKey(e => e.IdNutritionPlan).HasName("PK__Nutritio__7A2AD4AAE33C8D6D");

            entity.Property(e => e.IdNutritionPlan).HasColumnName("id_NutritionPlan");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.EndDate).HasColumnName("endDate");
            entity.Property(e => e.IdUser).HasColumnName("id_User");
            entity.Property(e => e.StartDate).HasColumnName("startDate");
            entity.Property(e => e.State).HasColumnName("state");
            entity.Property(e => e.Title)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("title");

            entity.HasOne(d => d.IdUserNavigation).WithMany(p => p.NutritionPlans)
                .HasForeignKey(d => d.IdUser)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("sudaro");
        });

        modelBuilder.Entity<NutritionPlanDay>(entity =>
        {
            entity.HasKey(e => new { e.IdNutritionPlanDay, e.IdNutritionPlan }).HasName("PK__Nutritio__6EAFF82CD9AF1C32");

            entity.Property(e => e.IdNutritionPlanDay)
                .ValueGeneratedOnAdd()
                .HasColumnName("id_NutritionPlanDay");
            entity.Property(e => e.IdNutritionPlan).HasColumnName("id_NutritionPlan");
            entity.Property(e => e.Date).HasColumnName("date");

            entity.HasOne(d => d.IdNutritionPlanNavigation).WithMany(p => p.NutritionPlanDays)
                .HasForeignKey(d => d.IdNutritionPlan)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Nutrition__id_Nu__5AEE82B9");
        });

        modelBuilder.Entity<NutritionPlanDish>(entity =>
        {
            entity.HasKey(e => e.IdNutritionPlanDish).HasName("PK__Nutritio__0998AA1A0D5B1800");

            entity.Property(e => e.IdNutritionPlanDish).HasColumnName("id_NutritionPlanDish");
            entity.Property(e => e.DishType).HasColumnName("dishType");
            entity.Property(e => e.IdDish).HasColumnName("id_Dish");
            entity.Property(e => e.IdNutritionPlan).HasColumnName("id_NutritionPlan");
            entity.Property(e => e.IdNutritionPlanDay).HasColumnName("id_NutritionPlanDay");
            entity.Property(e => e.IdRecipe).HasColumnName("id_Recipe");
            entity.Property(e => e.Servings)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("servings");
            entity.Property(e => e.ServingsConsumed)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("servingsConsumed");

            entity.HasOne(d => d.DishTypeNavigation).WithMany(p => p.NutritionPlanDishes)
                .HasForeignKey(d => d.DishType)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Nutrition__dishT__60A75C0F");

            entity.HasOne(d => d.IdDishNavigation).WithMany(p => p.NutritionPlanDishes)
                .HasForeignKey(d => d.IdDish)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("has1");

            entity.HasOne(d => d.IdRecipeNavigation).WithMany(p => p.NutritionPlanDishes)
                .HasForeignKey(d => d.IdRecipe)
                .HasConstraintName("has");

            entity.HasOne(d => d.NutritionPlanDay).WithMany(p => p.NutritionPlanDishes)
                .HasForeignKey(d => new { d.IdNutritionPlanDay, d.IdNutritionPlan })
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("belongs");
        });

        modelBuilder.Entity<PhysicalActivityLevel>(entity =>
        {
            entity.HasKey(e => e.IdPhysicalActivityLevels).HasName("PK__Physical__FBBD1B30E25E1AA1");

            entity.Property(e => e.IdPhysicalActivityLevels)
                .ValueGeneratedNever()
                .HasColumnName("id_PhysicalActivityLevels");
            entity.Property(e => e.Name)
                .HasMaxLength(17)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("name");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.IdProduct).HasName("PK__Products__A828825D803BBB42");

            entity.Property(e => e.IdProduct).HasColumnName("id_Product");
            entity.Property(e => e.Calories).HasColumnName("calories");
            entity.Property(e => e.Carbs).HasColumnName("carbs");
            entity.Property(e => e.Fat).HasColumnName("fat");
            entity.Property(e => e.Image)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("image");
            entity.Property(e => e.Protein).HasColumnName("protein");
            entity.Property(e => e.Title)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("title");
        });

        modelBuilder.Entity<Recipe>(entity =>
        {
            entity.HasKey(e => e.IdRecipe).HasName("PK__Recipes__CD60D0336C6522C2");

            entity.Property(e => e.IdRecipe).HasColumnName("id_Recipe");
            entity.Property(e => e.IdUser).HasColumnName("id_User");
            entity.Property(e => e.Image)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("image");
            entity.Property(e => e.ReadyInMinutes).HasColumnName("readyInMinutes");
            entity.Property(e => e.SpoonacularId).HasColumnName("spoonacularID");
            entity.Property(e => e.Summary)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("summary");
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("title");
            entity.HasOne(d => d.IdUserNavigation).WithMany(p => p.Recipes)
                .HasForeignKey(d => d.IdUser)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("sudaro1");
        });

        modelBuilder.Entity<RecipeIngredient>(entity =>
        {
            entity.HasKey(e => new { e.IdRecipeIngredient }).HasName("PK__RecipeIn__C3067879E6D8C5F7");

            entity.Property(e => e.IdRecipeIngredient).HasColumnName("id_RecipeIngredient");
            entity.Property(e => e.IdRecipe).HasColumnName("id_Recipe");
            entity.Property(e => e.IdProduct).HasColumnName("id_Product");
            entity.Property(e => e.MeasurementUnit).HasColumnName("measurementUnit");
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("quantity");

            entity.HasOne(d => d.IdProductNavigation).WithMany(p => p.RecipeIngredients)
                .HasForeignKey(d => d.IdProduct)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("has2");

            entity.HasOne(d => d.IdRecipeNavigation).WithMany(p => p.RecipeIngredients)
                .HasForeignKey(d => d.IdRecipe)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__RecipeIng__id_Re__4222D4EF");

            entity.HasOne(d => d.MeasurementUnitNavigation).WithMany(p => p.RecipeIngredients)
                .HasForeignKey(d => d.MeasurementUnit)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__RecipeIng__measu__403A8C7D");
        });

        modelBuilder.Entity<ShoppingList>(entity =>
        {
            entity.HasKey(e => e.IdShoppingList).HasName("PK__Shopping__4E79835A72B975BD");

            entity.Property(e => e.IdShoppingList).HasColumnName("id_ShoppingList");
            entity.Property(e => e.IdUser).HasColumnName("id_User");
            entity.Property(e => e.Image)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("image");
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("title");

            entity.HasOne(d => d.IdUserNavigation).WithMany(p => p.ShoppingLists)
                .HasForeignKey(d => d.IdUser)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("makes1");
        });

        modelBuilder.Entity<ShoppingListProduct>(entity =>
        {
            entity.HasKey(e => new { e.IdShoppingList, e.IdProduct }).HasName("PK__Shopping__84FB0B7F1CC4F550");

            entity.Property(e => e.IdShoppingList).HasColumnName("id_ShoppingList");
            entity.Property(e => e.IdProduct).HasColumnName("id_Product");

            entity.HasOne(d => d.IdShoppingListNavigation).WithMany(p => p.ShoppingListProducts)
                .HasForeignKey(d => d.IdShoppingList)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("sudarytas");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.IdUser).HasName("PK__Users__55649556B64890E1");

            entity.Property(e => e.IdUser).HasColumnName("id_User");
            entity.Property(e => e.Active).HasColumnName("active");
            entity.Property(e => e.Birthdate).HasColumnName("birthdate");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.Gender).HasColumnName("gender");
            entity.Property(e => e.Height)
                .HasColumnType("decimal(4, 1)")
                .HasColumnName("height");
            entity.Property(e => e.IdGoal).HasColumnName("id_Goal");
            entity.Property(e => e.Name)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password");
            entity.Property(e => e.PhysicalActivityLevel).HasColumnName("physicalActivityLevel");
            entity.Property(e => e.Role)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("role");
            entity.Property(e => e.Surname)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("surname");
            entity.Property(e => e.Weight)
                .HasColumnType("decimal(4, 1)")
                .HasColumnName("weight");

            entity.HasOne(d => d.GenderNavigation).WithMany(p => p.Users)
                .HasForeignKey(d => d.Gender)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Users__gender__45F365D3");

            entity.HasOne(d => d.IdGoalNavigation).WithMany(p => p.Users)
                .HasForeignKey(d => d.IdGoal)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("marks");

            entity.HasOne(d => d.PhysicalActivityLevelNavigation).WithMany(p => p.Users)
                .HasForeignKey(d => d.PhysicalActivityLevel)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Users__physicalA__46E78A0C");
        });

        modelBuilder.Entity<UserAllergen>(entity =>
        {
            entity.HasKey(e => new { e.IdAllergen, e.IdUser }).HasName("PK__UserAlle__A854AEFC87A7BC6A");

            entity.Property(e => e.IdAllergen).HasColumnName("id_Allergen");
            entity.Property(e => e.IdUser).HasColumnName("id_User");

            entity.HasOne(d => d.IdAllergenNavigation).WithMany(p => p.UserAllergens)
                .HasForeignKey(d => d.IdAllergen)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("marks1");
        });

        modelBuilder.Entity<UserCategory>(entity =>
        {
            entity.HasKey(e => new { e.IdCategory, e.IdUser }).HasName("PK__UserCate__297DAB0CF1EF8BF8");

            entity.Property(e => e.IdCategory).HasColumnName("id_Category");
            entity.Property(e => e.IdUser).HasColumnName("id_User");

            entity.HasOne(d => d.IdCategoryNavigation).WithMany(p => p.UserCategories)
                .HasForeignKey(d => d.IdCategory)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("likes");
        });

        modelBuilder.Entity<UserProduct>(entity =>
        {
            entity.HasKey(e => e.IdUserProduct).HasName("PK__UserProd__6C07E28C0719097F");

            entity.Property(e => e.IdUserProduct)
                .HasColumnName("id_UserProduct");
            entity.Property(e => e.ExpirationDate).HasColumnName("expirationDate");
            entity.Property(e => e.IdProduct).HasColumnName("id_Product");
            entity.Property(e => e.IdUser).HasColumnName("id_User");
            entity.Property(e => e.MeasurementUnit).HasColumnName("measurementUnit");
            entity.Property(e => e.Note)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("note");
            entity.Property(e => e.Quantity)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("quantity");

            entity.HasOne(d => d.IdProductNavigation).WithMany(p => p.UserProducts)
                .HasForeignKey(d => d.IdProduct)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__UserProdu__id_Pr__571DF1D5");

            entity.HasOne(d => d.IdUserNavigation).WithMany(p => p.UserProducts)
                .HasForeignKey(d => d.IdUser)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__UserProdu__id_Us__5812160E");

            entity.HasOne(d => d.MeasurementUnitNavigation).WithMany(p => p.UserProducts)
                .HasForeignKey(d => d.MeasurementUnit)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__UserProdu__measu__5629CD9C");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
