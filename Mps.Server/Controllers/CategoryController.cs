using Mps.Server.Data;
using Mps.Server.NewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


namespace Mps.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoryController : ControllerBase
    {
        private readonly MpsContext _context;
        public CategoryController(MpsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public List<Category> Get()
        {
            return _context.Categories.ToList();
        }

        [HttpGet("Selected")]
        public ActionResult<List<CategoryDto>> GetSelected()
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (userEmail == null)
            {
                return NotFound("Email not found");
            }
            else
            {
                var user = _context.Users.FirstOrDefault(u => u.Email == userEmail);
                if (user == null)
                {
                    return NotFound("User not found");
                }
                else
                {
                    return _context.Categories.Select(c => new CategoryDto
                    {
                        Title = c.Title,
                        IdCategory = c.IdCategory,
                        Selected = c.UserCategories.Any(uc => uc.IdUser == user.IdUser)
                    }).ToList();
                }
            }
        }

        [HttpPost("Select")]
        public ActionResult Select([FromBody] List<string> categoryIDs)
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(userEmail))
                    return NotFound("Email not found");

                var user = _context.Users.FirstOrDefault(u => u.Email == userEmail);
                if (user == null)
                    return NotFound("User not found");

                var categoriesToRemove = _context.UserCategories.Where(uc => uc.IdUser == user.IdUser);
                _context.UserCategories.RemoveRange(categoriesToRemove);
                if (categoryIDs != null && categoryIDs.Count != 0)
                {
                    foreach (var categoryID in categoryIDs)
                    {
                        var category = _context.Categories.FirstOrDefault(c => c.IdCategory == Convert.ToInt32(categoryID));
                        if (category == null)
                        {
                            return BadRequest("Error while saving categories");
                        }
                        else
                        {
                            _context.Add(new UserCategory { 
                                IdCategory = category.IdCategory,
                                IdUser = user.IdUser,
                                IdCategoryNavigation = category
                            });
                        }
                    }
                }
                try
                {
                    _context.SaveChanges();
                }
                catch (Exception ex)
                {
                    return BadRequest("Error while saving categories: " + ex.Message);
                }

                return Ok("Categories updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public ActionResult Post([FromBody] Category category)
        {
            _context.Categories.Add(category);
            try
            {
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] Category category)
        {
            var categoryToUpdate = _context.Categories.FirstOrDefault(al => al.IdCategory == id);
            if (categoryToUpdate != null)
            {
                categoryToUpdate.Title = category.Title;
                _context.Update(categoryToUpdate);
                try
                {
                    _context.SaveChanges();
                    return Ok();
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
            return BadRequest();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var categoryToDelete = _context.Categories.FirstOrDefault(al => al.IdCategory == id);
            if (categoryToDelete != null)
            {
                _context.Categories.Remove(categoryToDelete);
                try
                {
                    _context.SaveChanges();
                    return Ok();
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
            else
                return NotFound("Category not found");
        }
    }
}
