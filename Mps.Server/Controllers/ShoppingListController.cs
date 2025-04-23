using Mps.Server.Data;
using Mps.Server.NewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Mps.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ShoppingListController : ControllerBase
    {
        private readonly MpsContext _context;
        public ShoppingListController(MpsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<List<ShoppingList>> Get()
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = _context.Users.FirstOrDefault(u => u.Email == userEmail);

            if (user == null)
            {
                return NotFound("User not found");
            }

            return _context.ShoppingLists
                            .Include(sl => sl.ShoppingListProducts)
                            .Where(sl => sl.IdUser == user.IdUser)
                            .ToList();
        }

        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            return Ok(_context.ShoppingListProducts
                                .Include(slp => slp.IdShoppingListNavigation)
                                .Where(slp => slp.IdShoppingList == id)
                                .Join(_context.Products,
                    slp => slp.IdProduct,
                    p => p.IdProduct,
                    (slp, p) => new
                    {
                        ShoppingListTitle = slp.IdShoppingListNavigation.Title,
                        ProductTitle = p.Title,
                        p.IdProduct
                    }));
        }

        [HttpPost("{id}")]
        public async Task<ActionResult> Post([FromQuery] string title, int id)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = _context.Users.FirstOrDefault(u => u.Email == userEmail);

            if (user == null)
            {
                return BadRequest("User not found");
            }

            var nutritionPlan = _context.NutritionPlans
                                        .Include(np => np.NutritionPlanDays)
                                            .ThenInclude(npd => npd.NutritionPlanDishes)
                                            .ThenInclude(npd => npd.IdRecipeNavigation)
                                            .ThenInclude(r => r.RecipeIngredients)
                                            .ThenInclude(ri => ri.IdProductNavigation)
                                        .Include(np => np.NutritionPlanDays)
                                            .ThenInclude(npd => npd.NutritionPlanDishes)
                                            .ThenInclude(npd => npd.IdRecipeNavigation)
                                            .ThenInclude(r => r.RecipeIngredients)
                                            .ThenInclude(ri => ri.MeasurementUnitNavigation)
                                        .FirstOrDefault(np => np.IdNutritionPlan == id);

            if (nutritionPlan == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Nutrition plan was not found");
            }

            var products = nutritionPlan.NutritionPlanDays
                .SelectMany(npd => npd.NutritionPlanDishes
                    .SelectMany(npd => npd.IdRecipeNavigation.RecipeIngredients
                        .Select(ri => new
                        {
                            ri.IdProductNavigation.Title,
                            Quantity = ri.Quantity * npd.Servings,
                            ri.MeasurementUnit,
                            ri.MeasurementUnitNavigation
                        })))
                        .GroupBy(p => (p.Title, p.MeasurementUnit))
                        .Select(g => new
                        {
                            g.First().Title,
                            TotalQuantity = g.Sum(p => p.Quantity),
                            MeasurementUnitName = g.First().MeasurementUnitNavigation.Name
                        })
                        .ToList();

            var shoppingList = new ShoppingList
            {
                Title = title,
                IdUser = user.IdUser
            };
            await _context.AddAsync(shoppingList);
            await _context.SaveChangesAsync();

            var promptProducts = "";

            foreach (var product in products)
            {
                var productToAdd = new Product
                {
                    Title = product.Title + " - " + product.TotalQuantity.ToString("0.##") + " " + product.MeasurementUnitName,
                    Calories = 0,
                    Fat = 0,
                    Protein = 0
                };

                promptProducts += " " + product.Title + " - " + product.TotalQuantity.ToString("0.##") + " " + product.MeasurementUnitName;

                await _context.AddAsync(productToAdd);
                await _context.SaveChangesAsync();

                shoppingList.ShoppingListProducts.Add(
                    new ShoppingListProduct
                    {
                        IdProduct = productToAdd.IdProduct,
                        IdShoppingList = shoppingList.IdShoppingList
                    }
                    );
            }

            try
            {
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Exception: " + ex.Message);
            }

            return Ok(shoppingList.IdShoppingList);
        }

        [HttpPut("{id}")]
        public ActionResult UpdateTitle(int id, [FromQuery] string title)
        {
            var sl = _context.ShoppingLists.FirstOrDefault(sl => sl.IdShoppingList == id);
            if (sl != null)
            {
                sl.Title = title;
                _context.Update(sl);
                try
                {
                    _context.SaveChanges();
                    return Ok();
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Internal server error: " + ex.Message);
                }
            }
            else
            {
                return NotFound("Shopping list was not found");
            }
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var listToDelete = _context.ShoppingLists
                            .Include(sl => sl.ShoppingListProducts)
                            .FirstOrDefault(sl => sl.IdShoppingList == id);
            if (listToDelete != null)
            {
                _context.Remove(listToDelete);
                try
                {
                    _context.SaveChanges();
                    return Ok();
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Internal server error: " + ex.Message);
                }
            }
            else
            {
                return NotFound("List was not found");
            }
        }

        [HttpDelete("{id}/{idProduct}")]
        public ActionResult Delete(int id, int idProduct)
        {
            var productToDelete = _context.ShoppingListProducts.FirstOrDefault(slp => slp.IdShoppingList == id && slp.IdProduct == idProduct);
            if (productToDelete != null)
            {
                _context.Remove(productToDelete);
                try
                {
                    _context.SaveChanges();
                    return Ok();
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Internal server error: " + ex.Message);
                }
            }
            else
            {
                return NotFound("List was not found");
            }
        }
    }
}
