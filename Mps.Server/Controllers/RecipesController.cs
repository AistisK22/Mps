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
    public class RecipesController : ControllerBase
    {
        private readonly MpsContext _context;
        private readonly IConfiguration _config;
        public RecipesController(MpsContext context, IConfiguration config)
        {
            _context = context;
            _config = config;   
        }

        [HttpGet]
        public ActionResult<List<Recipe>> Get()
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = _context.Users.FirstOrDefault(u => u.Email == userEmail);

            if (user == null)
            {
                return BadRequest("User not found");
            }

            var customRecipes = _context.Recipes
                .Include(r => r.RecipeIngredients)
                    .ThenInclude(ri => ri.IdProductNavigation)
                .Include(r => r.RecipeIngredients)
                    .ThenInclude(ri => ri.MeasurementUnitNavigation)
                .Where(r => r.IdUser == user.IdUser)
                .ToList();

            return customRecipes;
        }

        [HttpGet("{id}")]
        public ActionResult<Recipe> Get(int id)
        {
            var recipe = _context.Recipes
                .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.IdProductNavigation)
                .FirstOrDefault(r => r.IdRecipe == id);
            if (recipe == null)
            {
                return BadRequest("Recipe not found");
            }
            return recipe;
        }

        [HttpPost]
        public ActionResult Post([FromForm] CustomRecipeDto customRecipe)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = _context.Users.FirstOrDefault(u => u.Email == userEmail);

            if (user == null)
            {
                return BadRequest("User not found");
            }

            foreach (var ri in customRecipe.RecipeIngredients)
            {
                var mu = _context.MeasurementUnits.First(mu => mu.IdMeasurementUnits == ri.MeasurementUnit);
                ri.MeasurementUnitNavigation = mu;
            }

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(customRecipe.Image);

            var filePath = Path.Combine(_config.GetSection("FileSettings:UploadFolder").Value!, "Uploads", fileName);

            var recipe = new Recipe
            {
                Title = customRecipe.Title,
                Summary = customRecipe.Summary,
                ReadyInMinutes = customRecipe.ReadyInMinutes,
                Image = fileName,
                SpoonacularId = customRecipe.SpoonacularId,
                Instructions = customRecipe.Instructions,
                WeightPerServing = customRecipe.WeightPerServing,
                IdUserNavigation = customRecipe.IdUserNavigation,
                IdUser = user.IdUser,
                RecipeIngredients = customRecipe.RecipeIngredients
            };

            try
            {
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                using var stream = new FileStream(filePath, FileMode.Create);
                customRecipe.ImageFile.CopyTo(stream);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

            try
            {
                _context.Add(recipe);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

            return Ok(customRecipe);
        }

        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromForm] CustomRecipeDto customRecipe)
        {
            var recipeToUpdate = _context.Recipes
                .Include(r => r.RecipeIngredients)
                .ThenInclude(ri => ri.IdProductNavigation)
                .FirstOrDefault(r => r.IdRecipe == id);

            if (recipeToUpdate == null)
            {
                return BadRequest("Custom recipe not found");
            }

            foreach (var ri in customRecipe.RecipeIngredients)
            {
                var mu = _context.MeasurementUnits.First(mu => mu.IdMeasurementUnits == ri.MeasurementUnit);
                ri.MeasurementUnitNavigation = mu;
            }

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(customRecipe.Image);
            if (customRecipe.ImageFile != null)
            {
                var filePath = Path.Combine(_config.GetSection("FileSettings:UploadFolder").Value!, "Uploads", fileName);

                try
                {
                    Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                    using var stream = new FileStream(filePath, FileMode.Create);
                    customRecipe.ImageFile.CopyTo(stream);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, ex.Message);
                }
            }

            recipeToUpdate.Title = customRecipe.Title;
            recipeToUpdate.Summary = customRecipe.Summary;
            recipeToUpdate.ReadyInMinutes = customRecipe.ReadyInMinutes;
            recipeToUpdate.Image = customRecipe.ImageFile != null ? fileName : customRecipe.Image;
            recipeToUpdate.SpoonacularId = customRecipe.SpoonacularId;
            recipeToUpdate.Instructions = customRecipe.Instructions;
            recipeToUpdate.RecipeIngredients = customRecipe.RecipeIngredients;

            try
            {
                _context.Update(recipeToUpdate);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

            return Ok(customRecipe);
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var entityToDelete = _context.Recipes.First(x => x.IdRecipe == id);
            var recipeIngredientsToDelete = _context.RecipeIngredients.Where(x => x.IdRecipe == entityToDelete.IdRecipe);
            if (entityToDelete == null || recipeIngredientsToDelete == null)
            {
                return NotFound("Recipe was not found");
            }
            _context.RemoveRange(recipeIngredientsToDelete);
            _context.Recipes.Remove(entityToDelete);
            try
            {
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error while deleting recipe: " + ex.Message);
            }
        }
    }
}
