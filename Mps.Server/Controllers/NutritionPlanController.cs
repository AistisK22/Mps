using Mps.Server.Data;
using Mps.Server.NewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;

namespace Mps.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NutritionPlanController : ControllerBase
    {
        private readonly MpsContext _context;
        private readonly IConfiguration _config;
        public NutritionPlanController(IConfiguration config, MpsContext context) 
        {
            _config = config;
            _context = context;
        }

        [HttpGet("{id}")]
        public ActionResult<NutritionPlan> Get(int id, DateTime startDate)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = _context.Users.FirstOrDefault(u => u.Email == userEmail);

            if (user == null)
            {
                return BadRequest("User not found");
            }

            if (id == 0)
            {
                return _context.NutritionPlans
                .Include(np => np.NutritionPlanDays)
                .ThenInclude(npd => npd.NutritionPlanDishes)
                .ThenInclude(npd => npd.IdRecipeNavigation)
                .ThenInclude(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.IdProductNavigation)
                .FirstOrDefault(npd => npd.StartDate == DateOnly.FromDateTime(startDate) && npd.IdUser == user.IdUser);
            }
            else
            {
                return _context.NutritionPlans
                .Include(np => np.NutritionPlanDays)
                .ThenInclude(npd => npd.NutritionPlanDishes)
                .ThenInclude(npd => npd.IdRecipeNavigation)
                .ThenInclude(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.IdProductNavigation)
                .FirstOrDefault(npd => npd.IdNutritionPlan == id && npd.IdUser == user.IdUser);
            }
        }

        [HttpGet("GetPlanNutrition/{id}")]
        public ActionResult<PlanNutrition> GetPlanNutrition(int id)
        {
            var plan = _context.NutritionPlans
                            .Include(np => np.NutritionPlanDays)
                            .ThenInclude(npd => npd.NutritionPlanDishes)
                            .ThenInclude(npd => npd.IdRecipeNavigation)
                            .ThenInclude(r => r.RecipeIngredients)
                            .ThenInclude(ri => ri.IdProductNavigation)
                            .FirstOrDefault(npd => npd.IdNutritionPlan == id);

            if (plan == null)
            {
                return StatusCode(500, "Plan was not found");
            }
            else
            {
                return new PlanNutrition
                {
                    Calories = plan.NutritionPlanDays
                                            .Sum(npd => npd.NutritionPlanDishes
                                            .Sum(npd => npd.IdRecipeNavigation.RecipeIngredients
                                            .Sum(ri => ri.IdProductNavigation.Calories))),
                    ConsumedCalories = plan.NutritionPlanDays
                                            .Sum(npd => npd.NutritionPlanDishes
                                            .Sum(npd => npd.IdRecipeNavigation.RecipeIngredients
                                            .Sum(ri => ri.IdProductNavigation.Calories * npd.ServingsConsumed / npd.Servings))),
                    Protein = plan.NutritionPlanDays
                                            .Sum(npd => npd.NutritionPlanDishes
                                            .Sum(npd => npd.IdRecipeNavigation.RecipeIngredients
                                            .Sum(ri => ri.IdProductNavigation.Protein))),
                    ConsumedProtein = plan.NutritionPlanDays
                                            .Sum(npd => npd.NutritionPlanDishes
                                            .Sum(npd => npd.IdRecipeNavigation.RecipeIngredients
                                            .Sum(ri => ri.IdProductNavigation.Protein * npd.ServingsConsumed / npd.Servings))),
                    Fat = plan.NutritionPlanDays
                                            .Sum(npd => npd.NutritionPlanDishes
                                            .Sum(npd => npd.IdRecipeNavigation.RecipeIngredients
                                            .Sum(ri => ri.IdProductNavigation.Fat))),
                    ConsumedFat = plan.NutritionPlanDays
                                            .Sum(npd => npd.NutritionPlanDishes
                                            .Sum(npd => npd.IdRecipeNavigation.RecipeIngredients
                                            .Sum(ri => ri.IdProductNavigation.Fat * npd.ServingsConsumed / npd.Servings))),
                    Carbs = plan.NutritionPlanDays
                                            .Sum(npd => npd.NutritionPlanDishes
                                            .Sum(npd => npd.IdRecipeNavigation.RecipeIngredients
                                            .Sum(ri => ri.IdProductNavigation.Carbs))),
                    ConsumedCarbs = plan.NutritionPlanDays
                                            .Sum(npd => npd.NutritionPlanDishes
                                            .Sum(npd => npd.IdRecipeNavigation.RecipeIngredients
                                            .Sum(ri => ri.IdProductNavigation.Carbs * npd.ServingsConsumed / npd.Servings)))
                };
            }
        }

        [HttpGet("GetPlanNutritionForBarCharts/{id}")]
        public ActionResult GetPlanNutritionForBarCharts(int id)
        {
            var plan = _context.NutritionPlans
                            .Include(np => np.NutritionPlanDays)
                            .ThenInclude(npd => npd.NutritionPlanDishes)
                            .ThenInclude(npd => npd.IdRecipeNavigation)
                            .ThenInclude(r => r.RecipeIngredients)
                            .ThenInclude(ri => ri.IdProductNavigation)
                            .FirstOrDefault(npd => npd.IdNutritionPlan == id);

            if (plan == null)
            {
                return StatusCode(500, "Plan was not found");
            }
            else
            {
                var data = plan.NutritionPlanDays
                    .Select(npd => new
                    {
                        Day = npd.Date,
                        TotalCalories = npd.NutritionPlanDishes
                            .SelectMany(dish => dish.IdRecipeNavigation.RecipeIngredients)
                            .Sum(ingredient => ingredient.IdProductNavigation.Calories),
                        ConsumedCalories = npd.NutritionPlanDishes
                            .Select(dish =>
                                dish.IdRecipeNavigation.RecipeIngredients
                                    .Sum(ingredient =>
                                        ingredient.IdProductNavigation.Calories * dish.ServingsConsumed / dish.Servings
                                    )
                            )
                            .Sum(),
                        TotalFat = npd.NutritionPlanDishes
                            .SelectMany(dish => dish.IdRecipeNavigation.RecipeIngredients)
                            .Sum(ingredient => ingredient.IdProductNavigation.Fat),
                        ConsumedFat = npd.NutritionPlanDishes
                            .Select(dish =>
                                dish.IdRecipeNavigation.RecipeIngredients
                                    .Sum(ingredient =>
                                        ingredient.IdProductNavigation.Fat * dish.ServingsConsumed / dish.Servings
                                    )
                            )
                            .Sum(),
                        TotalProtein = npd.NutritionPlanDishes
                            .SelectMany(dish => dish.IdRecipeNavigation.RecipeIngredients)
                            .Sum(ingredient => ingredient.IdProductNavigation.Protein),
                        ConsumedProtein = npd.NutritionPlanDishes
                            .Select(dish =>
                                dish.IdRecipeNavigation.RecipeIngredients
                                    .Sum(ingredient =>
                                        ingredient.IdProductNavigation.Protein * dish.ServingsConsumed / dish.Servings
                                    )
                            )
                            .Sum(),
                        TotalCarbs = npd.NutritionPlanDishes
                            .SelectMany(dish => dish.IdRecipeNavigation.RecipeIngredients)
                            .Sum(ingredient => ingredient.IdProductNavigation.Carbs),
                        ConsumedCarbs = npd.NutritionPlanDishes
                            .Select(dish =>
                                dish.IdRecipeNavigation.RecipeIngredients
                                    .Sum(ingredient =>
                                        ingredient.IdProductNavigation.Carbs * dish.ServingsConsumed / dish.Servings
                                    )
                            )
                            .Sum(),
                    });
                return Ok(data);
            }
        }

        [HttpGet("GetAll")]
        public ActionResult<List<PlanInformation>> GetAll()
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = _context.Users.FirstOrDefault(u => u.Email == userEmail);

            if (user == null)
            {
                return BadRequest("User not found");
            }

            var plans = _context.NutritionPlans
                            .Include(np => np.NutritionPlanDays)
                            .ThenInclude(npd => npd.NutritionPlanDishes)
                            .ThenInclude(npdish => npdish.IdRecipeNavigation)
                            .ThenInclude(recipe => recipe.RecipeIngredients)
                            .ThenInclude(ri => ri.IdProductNavigation)
                            .Where(np => np.IdUser == user.IdUser)
                            .ToList();
            var plansInfos = new List<PlanInformation>();

            foreach (var plan in plans)
            {
                var planInfo = new PlanInformation
                {
                    IdNutritionPlan = plan.IdNutritionPlan,
                    StartDate = plan.StartDate,
                    EndDate = plan.EndDate,
                    Calories = plan.NutritionPlanDays
                                            .Sum(npd => npd.NutritionPlanDishes
                                            .Sum(npd => npd.IdRecipeNavigation.RecipeIngredients
                                            .Sum(ri => ri.IdProductNavigation.Calories))),
                    ConsumedCalories = plan.NutritionPlanDays
                                            .Sum(npd => npd.NutritionPlanDishes
                                            .Sum(npd => npd.IdRecipeNavigation.RecipeIngredients
                                            .Sum(ri => ri.IdProductNavigation.Calories * npd.ServingsConsumed / npd.Servings))),
                    Protein = plan.NutritionPlanDays
                                            .Sum(npd => npd.NutritionPlanDishes
                                            .Sum(npd => npd.IdRecipeNavigation.RecipeIngredients
                                            .Sum(ri => ri.IdProductNavigation.Protein))),
                    ConsumedProtein = plan.NutritionPlanDays
                                            .Sum(npd => npd.NutritionPlanDishes
                                            .Sum(npd => npd.IdRecipeNavigation.RecipeIngredients
                                            .Sum(ri => ri.IdProductNavigation.Protein * npd.ServingsConsumed / npd.Servings))),
                    Fat = plan.NutritionPlanDays
                                            .Sum(npd => npd.NutritionPlanDishes
                                            .Sum(npd => npd.IdRecipeNavigation.RecipeIngredients
                                            .Sum(ri => ri.IdProductNavigation.Fat))),
                    ConsumedFat = plan.NutritionPlanDays
                                            .Sum(npd => npd.NutritionPlanDishes
                                            .Sum(npd => npd.IdRecipeNavigation.RecipeIngredients
                                            .Sum(ri => ri.IdProductNavigation.Fat * npd.ServingsConsumed / npd.Servings))),
                    Carbs = plan.NutritionPlanDays
                                            .Sum(npd => npd.NutritionPlanDishes
                                            .Sum(npd => npd.IdRecipeNavigation.RecipeIngredients
                                            .Sum(ri => ri.IdProductNavigation.Carbs))),
                    ConsumedCarbs = plan.NutritionPlanDays
                                            .Sum(npd => npd.NutritionPlanDishes
                                            .Sum(npd => npd.IdRecipeNavigation.RecipeIngredients
                                            .Sum(ri => ri.IdProductNavigation.Carbs * npd.ServingsConsumed / npd.Servings)))
                };

                plansInfos.Add(planInfo);
            }

            return plansInfos.OrderByDescending(pi => pi.StartDate).ToList();
        }

        [HttpPost("CreatePlan")]
        public ActionResult CreatePlan([FromQuery] DateTime startDate, [FromQuery] DateTime endDate, [FromBody] RecipeInformation recipe)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = _context.Users.FirstOrDefault(u => u.Email == userEmail);

            if (user == null)
            {
                return BadRequest("User not found");
            }

            NutritionPlan nutritionPlan = new()
            {
                StartDate = DateOnly.FromDateTime(startDate),
                EndDate = DateOnly.FromDateTime(endDate),
                Description = "",
                Title = "Test",
                IdUser = user.IdUser,
                NutritionPlanDays = new List<NutritionPlanDay>()
            };

            for (DateTime i = startDate; i <= endDate; i = i.AddDays(1))
            {
                var nutritionPlanDay = new NutritionPlanDay()
                {
                    Date = DateOnly.FromDateTime(i),
                    NutritionPlanDishes = new List<NutritionPlanDish>()
                };

                if (i == recipe.PlanDate)
                {
                    var dish = new NutritionPlanDish
                    {
                        Servings = recipe.Servings,
                        ServingsConsumed = 0,
                        DishType = recipe.DishType,
                        IdDish = 1
                    };

                    var recipeToAdd = new Recipe
                    {
                        Image = recipe.Image,
                        ReadyInMinutes = recipe.ReadyInMinutes,
                        Summary = recipe.Summary,
                        SpoonacularId = recipe.Id,
                        Title = recipe.Title,
                        WeightPerServing = recipe.Nutrition.WeightPerServing.Amount + " " + recipe.Nutrition.WeightPerServing.Unit,
                        Instructions = string.Join(Environment.NewLine, recipe.AnalyzedInstructions.SelectMany(step => step.Steps.Select(step => step.Step))),
                        RecipeIngredients = []
                    };

                    foreach (var ingredient in recipe.Nutrition.Ingredients)
                    {
                        var product = new Product
                        {
                            Title = ingredient.Name,
                            Calories = ingredient.Nutrients.FirstOrDefault(n => n.Name == "Calories") != null ? ingredient.Nutrients.First(n => n.Name == "Calories").Amount : 0,
                            Protein = ingredient.Nutrients.FirstOrDefault(n => n.Name == "Protein") != null ? ingredient.Nutrients.First(n => n.Name == "Protein").Amount : 0,
                            Carbs = ingredient.Nutrients.FirstOrDefault(n => n.Name == "Carbohydrates") != null ? ingredient.Nutrients.First(n => n.Name == "Carbohydrates").Amount : 0,
                            Fat = ingredient.Nutrients.FirstOrDefault(n => n.Name == "Fat") != null ? ingredient.Nutrients.First(n => n.Name == "Fat").Amount : 0,
                            RecipeIngredients = new List<RecipeIngredient>()
                        };

                        var recipeIngredient = new RecipeIngredient
                        {
                            Quantity = ingredient.Amount,
                            MeasurementUnit = GetMeasurementUnit(ingredient.Unit)
                        };

                        product.RecipeIngredients.Add(recipeIngredient);
                        recipeToAdd.RecipeIngredients.Add(recipeIngredient);
                        _context.Add(product);
                    }

                    recipeToAdd.NutritionPlanDishes.Add(dish);
                    nutritionPlanDay.NutritionPlanDishes.Add(dish);
                    _context.Add(recipeToAdd);
                }
                nutritionPlan.NutritionPlanDays.Add(nutritionPlanDay);
            }

            _context.Add(nutritionPlan);
            try
            {
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest("Error while adding dish to plan. Error: " + ex.Message);
            }
        }

        [HttpDelete("RemoveDish/{id}")]
        public ActionResult RemoveDish(int id)
        {
            var dishToRemove = _context.NutritionPlanDishes.FirstOrDefault(npd => npd.IdNutritionPlanDish == id);
            if (dishToRemove == null)
            {
                return NotFound("Dish was not found");
            }
            else
            {
                _context.Remove(dishToRemove);
                try
                {
                    _context.SaveChanges();
                    return Ok();
                }
                catch (Exception ex)
                {
                    return BadRequest("Error while removing dish. Error: " + ex.Message);
                }
            }
        }

        [HttpPut("AddRecipeToPlan/{id}")]
        public ActionResult AddRecipeToPlan(int id, [FromBody] RecipeInformation recipe)
        {
            var planDay = _context.NutritionPlanDays.FirstOrDefault(npd => npd.IdNutritionPlanDay == id);
            if (planDay == null)
            {
                return NotFound("Plan's day was not found");
            }
            else
            {
                var dish = new NutritionPlanDish
                {
                    Servings = recipe.Servings,
                    ServingsConsumed = 0,
                    DishType = recipe.DishType,
                    IdDish = 1
                };

                var recipeToAdd = new Recipe
                {
                    Image = recipe.Image,
                    ReadyInMinutes = recipe.ReadyInMinutes,
                    Summary = recipe.Summary,
                    SpoonacularId = recipe.Id,
                    Title = recipe.Title,
                    WeightPerServing = recipe.Nutrition.WeightPerServing.Amount + " " + recipe.Nutrition.WeightPerServing.Unit,
                    Instructions = string.Join(Environment.NewLine, recipe.AnalyzedInstructions.SelectMany(step => step.Steps.Select(step => step.Step))),
                    RecipeIngredients = []
                };

                foreach (var ingredient in recipe.Nutrition.Ingredients)
                {
                    var product = new Product
                    {
                        Title = ingredient.Name,
                        Calories = ingredient.Nutrients.FirstOrDefault(n => n.Name == "Calories") != null ? ingredient.Nutrients.First(n => n.Name == "Calories").Amount : 0,
                        Protein = ingredient.Nutrients.FirstOrDefault(n => n.Name == "Protein") != null ? ingredient.Nutrients.First(n => n.Name == "Protein").Amount : 0,
                        Carbs = ingredient.Nutrients.FirstOrDefault(n => n.Name == "Carbohydrates") != null ? ingredient.Nutrients.First(n => n.Name == "Carbohydrates").Amount : 0,
                        Fat = ingredient.Nutrients.FirstOrDefault(n => n.Name == "Fat") != null ? ingredient.Nutrients.First(n => n.Name == "Fat").Amount : 0,
                        RecipeIngredients = new List<RecipeIngredient>()
                    };

                    var recipeIngredient = new RecipeIngredient
                    {
                        Quantity = ingredient.Amount,
                        MeasurementUnit = GetMeasurementUnit(ingredient.Unit)
                    };

                    product.RecipeIngredients.Add(recipeIngredient);
                    recipeToAdd.RecipeIngredients.Add(recipeIngredient);
                    _context.Add(product);
                }

                recipeToAdd.NutritionPlanDishes.Add(dish);
                planDay.NutritionPlanDishes.Add(dish);
                _context.Add(recipeToAdd);

                try
                {
                    _context.SaveChanges();
                    return Ok();
                }
                catch (Exception ex)
                {
                    return BadRequest("Error while assigning a dish to nutrition plan. Error: " + ex.Message);
                }
            }
        }

        [HttpPut("UpdateDishConsumption/{id}")]
        [Authorize]
        public ActionResult UpdateDishConsumption(int id, [FromQuery] decimal servingsConsumed)
        {
            var planDish = _context.NutritionPlanDishes.FirstOrDefault(npd => npd.IdNutritionPlanDish == id);
            if (planDish == null)
            {
                return NotFound("Plan's dish was not found");
            }

            if (servingsConsumed > planDish.Servings || servingsConsumed < 0)
            {
                return BadRequest("Consumed servings value is incorrect");
            }

            planDish.ServingsConsumed = servingsConsumed;
            _context.Update(planDish);
            try
            {
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest("Error while updating consumed amount of a dish. Error: " + ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var planToDelete = _context.NutritionPlans
                                        .Include(np => np.NutritionPlanDays)
                                        .ThenInclude(npd => npd.NutritionPlanDishes)
                                        .ThenInclude(npd => npd.IdRecipeNavigation)
                                        .FirstOrDefault(npd => npd.IdNutritionPlan == id);
            if (planToDelete != null) 
            {
                _context.Remove(planToDelete);
                try
                {
                    _context.SaveChanges();
                    return Ok();
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
            else
            {
                return NotFound("Plan was not found");
            }
        }

        [HttpPost("Generate")]
        public async Task<IActionResult> GenerateAsync([FromQuery] DateTime startDate, DateTime endDate)
        {
            HttpClient client = new();
            var apiKey = _config.GetSection("SpoonacularAPIKey").Value;
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = _context.Users.Include(g => g.IdGoalNavigation).FirstOrDefault(u => u.Email == userEmail);

            if (user == null)
            {
                return NotFound("User not found");
            }

            if (apiKey == null)
            {
                return StatusCode(500, "Internal server error: Spoonacular key not found");
            }

            int calories = CalculateNeededCalories(user);
            double distributedCalories = calories / 3;
            var intolerances = string.Join(',', _context.UserAllergens.Include(ua => ua.IdAllergenNavigation).Where(ua => ua.IdUser == user.IdUser).Select(a => a.IdAllergenNavigation.Name));
            var foodCategories = string.Join(',', _context.UserCategories.Include(uc => uc.IdCategoryNavigation).Where(c => c.IdUser == user.IdUser).Select(c => c.IdCategoryNavigation.IdCategory));

            NutritionPlan nutritionPlan = new()
            {
                StartDate = DateOnly.FromDateTime(startDate),
                EndDate = DateOnly.FromDateTime(endDate.AddDays(-1)),
                Description = "",
                Title = "Test",
                IdUser = user.IdUser,
                NutritionPlanDays = new List<NutritionPlanDay>()
            };

            for (DateTime i = startDate; i < endDate; i = i.AddDays(1))
            {
                var breakfastRecipes = await GetRecipesAsync(client, apiKey, intolerances, "breakfast, appetizer, bread, snack, salad", (distributedCalories / 2 - 40) * (double)user.IdGoalNavigation.Coef, (distributedCalories / 2 + 40) * (double)user.IdGoalNavigation.Coef, 2, foodCategories);
                var lunchRecipes = await GetRecipesAsync(client, apiKey, intolerances, "main course", (distributedCalories - 40) * (double)user.IdGoalNavigation.Coef, (distributedCalories + 40) * (double)user.IdGoalNavigation.Coef, 1, foodCategories);
                var dinnerRecipes = await GetRecipesAsync(client, apiKey, intolerances, "side dish, snack, marinade, salad, soup", (distributedCalories / 2 - 40) * (double)user.IdGoalNavigation.Coef, (distributedCalories / 2 + 40) * (double)user.IdGoalNavigation.Coef, 2, foodCategories);

                if (breakfastRecipes == null || lunchRecipes == null || dinnerRecipes == null)
                {
                    return StatusCode(500, "Internal server error: failed to retrieve recipes");
                }

                breakfastRecipes.Type = "breakfast";
                lunchRecipes.Type = "main course";
                dinnerRecipes.Type = "dessert";

                var nutritionPlanDay = new NutritionPlanDay
                {
                    Date = DateOnly.FromDateTime(i),
                    NutritionPlanDishes = new List<NutritionPlanDish>()
                };

                foreach (var recipeResponse in new[] { breakfastRecipes, lunchRecipes, dinnerRecipes })
                {
                    if (recipeResponse.Results.Count > 0)
                    {
                        foreach (var result in recipeResponse.Results)
                        {
                            var dish = new NutritionPlanDish
                            {
                                Servings = result.Servings,
                                ServingsConsumed = 0,
                                DishType = GetDishType(recipeResponse.Type),
                                IdDish = 1
                            };

                            var recipe = new Recipe
                            {
                                Image = result.Image,
                                ReadyInMinutes = result.ReadyInMinutes,
                                Summary = result.Summary,
                                SpoonacularId = result.Id,
                                Title = result.Title,
                                Instructions = string.Join(Environment.NewLine, result.AnalyzedInstructions.SelectMany(step => step.Steps.Select(step => step.Step))),
                                WeightPerServing = result.Nutrition.WeightPerServing.Amount + " " + result.Nutrition.WeightPerServing.Unit,
                                RecipeIngredients = new List<RecipeIngredient>()
                            };

                            foreach (var ingredient in result.Nutrition.Ingredients)
                            {
                                var product = new Product 
                                { 
                                    Title = ingredient.Name,
                                    Calories = ingredient.Nutrients.FirstOrDefault(n => n.Name == "Calories") != null ? ingredient.Nutrients.First(n => n.Name == "Calories").Amount : 0,
                                    Protein = ingredient.Nutrients.FirstOrDefault(n => n.Name == "Protein") != null ? ingredient.Nutrients.First(n => n.Name == "Protein").Amount : 0,
                                    Carbs = ingredient.Nutrients.FirstOrDefault(n => n.Name == "Carbohydrates") != null ? ingredient.Nutrients.First(n => n.Name == "Carbohydrates").Amount : 0,
                                    Fat = ingredient.Nutrients.FirstOrDefault(n => n.Name == "Fat") != null ? ingredient.Nutrients.First(n => n.Name == "Fat").Amount : 0,
                                    RecipeIngredients = new List<RecipeIngredient>()
                                };

                                var recipeIngredient = new RecipeIngredient
                                {
                                    Quantity = ingredient.Amount,
                                    MeasurementUnit = GetMeasurementUnit(ingredient.Unit)
                                };

                                product.RecipeIngredients.Add(recipeIngredient);
                                recipe.RecipeIngredients.Add(recipeIngredient);
                                _context.Add(product);
                            }

                            recipe.NutritionPlanDishes.Add(dish);
                            nutritionPlanDay.NutritionPlanDishes.Add(dish);
                            try
                            {
                                _context.Add(recipe);
                            }
                            catch (Exception ex)
                            {
                                var a = ex;
                            }
                        }
                    }
                }

                nutritionPlan.NutritionPlanDays.Add(nutritionPlanDay);
            }

            _context.Add(nutritionPlan);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);

            }

            return Ok(nutritionPlan);
        }

        private static async Task<RecipeResponse> GetRecipesAsync(HttpClient client, string apiKey, string intolerances, string type, double minCalories, double maxCalories, int number, string categories)
        {
            var _options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            Random random = new ();
            string alphabet = "cglimpsvwa";
            int randomNumber = random.Next(0, alphabet.Length); 
            char randomLetter = alphabet[randomNumber];
            var ingredientsToInclude = new List<string>();

            if (!string.IsNullOrEmpty(categories))
            {
                if (categories.Contains("1"))
                {
                    ingredientsToInclude.Add("apple");
                }
                if (categories.Contains("2"))
                {
                    ingredientsToInclude.Add("wheat");
                }
                if (categories.Contains("3"))
                {
                    ingredientsToInclude.Add("milk");
                }
                if (categories.Contains("4"))
                {
                    ingredientsToInclude.Add("beef");
                }
                if (categories.Contains("5"))
                {
                    ingredientsToInclude.Add("almonds");
                }
            }

            var response = await client.GetAsync($"https://api.spoonacular.com/recipes/complexSearch" +
                                                 $"?apiKey={apiKey}" +
                                                 $"&intolerances={intolerances}" +
                                                 $"&type={type}" +
                                                 $"&query={randomLetter}" +
                                                 $"&minCalories={(int)minCalories}" +
                                                 $"&maxCalories={(int)maxCalories}" +
                                                 "&addRecipeNutrition=true" +
                                                 "&addRecipeInstructions=true" +
                                                 "&excludeIngredients=scallion,asafoetida" +
                                                 (ingredientsToInclude.Count > 0 
                                                                            ? "&includeIngredients=" + string.Join(",", ingredientsToInclude) 
                                                                            : "") +
                                                 "&maxServings=2" +
                                                 $"&number={number}");

            if (response.IsSuccessStatusCode)
            {
                var recipesContent = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<RecipeResponse>(recipesContent, _options);
            }

            return null;
        }

        [HttpGet("GetDishTypes")]
        public ActionResult<List<DishType>> GetDishTypes()
        {
            return _context.DishTypes.ToList();
        }

        private static int GetMeasurementUnit(string unit)
        {
            return unit.ToLower() switch
            {
                "l" => 1,
                "liter" => 1,
                "liters" => 1,
                "kg" => 2,
                "kilogram" => 2,
                "kilograms" => 2,
                "g" => 3,
                "gram" => 3,
                "grams" => 3,
                "ml" => 4,
                "piece" => 5,
                "cups" => 6,
                "cup" => 6,
                "servings" => 7,
                "large" => 8,
                "teaspoon" => 9,
                "tsp" => 9,
                "teaspoons" => 9,
                "clove" => 10,
                "cloves" => 10,
                "slice" => 11,
                "fruit" => 12,
                "oz" => 13,
                "ounces" => 13,
                "ounce" => 13,
                "ozs" => 13,
                "small" => 14,
                "tablespoon" => 15,
                "tablespoons" => 15,
                "tbsp" => 15,
                "pinch" => 16,
                "pint" => 17,
                "quart" => 18,
                "pound" => 19,
                "pounds" => 19,
                "scoop" => 20,
                "scoops" => 20,
                "medium" => 21,
                "handful" => 22,
                "handfuls" => 22,
                "stalk" => 23,
                "stalks" => 23,
                _ => 5,
            };
        }

        private static int GetDishType(string type)
        {
            return type switch
            {
                "breakfast" => 1,
                "main course" => 2,
                "dessert" => 3,
                _ => 0,
            };
        }

        private static int CalculateNeededCalories(User user)
        {
            var userAge = CalculateAge(user.Birthdate);
            var activityLevelCoef = GetActivityLevelCoef(user.PhysicalActivityLevel);

            int calories;
            if (user.Gender == (int) Gender.Male)
            {
                if (userAge <= 30)
                {
                    calories = (int)(Math.Round((0.064M * user.Weight + 2.84M) * 240M) * activityLevelCoef);
                }
                else
                {
                    calories = (int)(Math.Round((0.0485M * user.Weight + 3.67M) * 240M) * activityLevelCoef);
                }
            }
            else
            {
                if (userAge <= 30)
                {
                    calories = (int)(Math.Round((0.0615M * user.Weight + 2.08M) * 240M) * activityLevelCoef);
                }
                else
                {
                    calories = (int)(Math.Round((0.0364M * user.Weight + 3.47M) * 240m) * activityLevelCoef);
                }
            }

            return calories;
        }

        private static int CalculateAge(DateOnly birthdate)
        {
            DateOnly today = DateOnly.FromDateTime(DateTime.Today);
            int age = today.Year - birthdate.Year;

            if (birthdate.DayOfYear > today.DayOfYear)
                age--;

            return age;
        }

        private static decimal GetActivityLevelCoef(int physicalActivityLevel)
        {
            return physicalActivityLevel == (int) PAL.Sedentary ? 1.2M
                   : physicalActivityLevel == (int) PAL.LightlyActive ? 1.55M
                   : physicalActivityLevel == (int) PAL.ModeratelyActive ? 1.75M
                   : physicalActivityLevel == (int) PAL.VeryActive ? 2.0M
                   : 2.3M;
        }

        public enum PAL
        {
            Sedentary = 1,
            LightlyActive = 2,
            ModeratelyActive = 3,
            VeryActive = 4,
            ExtremelyActive = 5
        }

        public enum Gender
        {
            Female = 1,
            Male = 2,
            Other = 3,
        }
    }
}
