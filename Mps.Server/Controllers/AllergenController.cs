using Mps.Server.Data;
using Mps.Server.NewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Packaging;
using System.Security.Claims;

namespace Mps.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AllergenController : ControllerBase
    {
        private readonly MpsContext _context;
        public AllergenController(MpsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public List<Allergen> Get()
        {
            return _context.Allergens.ToList();
        }

        [HttpGet("Selected")]
        public ActionResult<List<AllergenDto>> GetSelected()
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
                    return _context.Allergens.Select(c => new AllergenDto
                    {
                        Name = c.Name,
                        IdAllergen = c.IdAllergen,
                        Selected = c.UserAllergens.Any(ua => ua.IdUser == user.IdUser),
                        Description = c.Description
                    }).ToList();
                }
            }
        }

        [HttpPost("Select")]
        public ActionResult Post([FromBody] List<string> allergenIDs)
        {
            try
            {
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(userEmail))
                    return NotFound("Email not found");

                var user = _context.Users.FirstOrDefault(u => u.Email == userEmail);
                if (user == null)
                    return NotFound("User not found");

                var allergensToRemove = _context.UserAllergens.Where(uc => uc.IdUser == user.IdUser);
                _context.UserAllergens.RemoveRange(allergensToRemove);
                if (allergenIDs != null && allergenIDs.Count != 0)
                {
                    foreach (var allergenID in allergenIDs)
                    {
                        _context.UserAllergens.Add(new UserAllergen
                        {
                            IdAllergen = Convert.ToInt32(allergenID),
                            IdUser = user.IdUser
                        });
                    }
                }
                else
                    return NotFound("No matching allergens found");
                _context.SaveChanges();

                return Ok("Allergens updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public ActionResult Post([FromBody] Allergen allergenVM)
        {
            _context.Allergens.Add(allergenVM);
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

        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] Allergen allergenVM)
        {
            var allergenToUpdate = _context.Allergens.FirstOrDefault(al => al.IdAllergen == id);
            if (allergenToUpdate != null)
            {
                allergenToUpdate.Name = allergenVM.Name;
                allergenToUpdate.Description = allergenVM.Description;
                try
                {
                    _context.SaveChanges();
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
            else
                return NotFound();

            return Ok();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var allergenToDelete = _context.Allergens.FirstOrDefault(al => al.IdAllergen == id);
            if (allergenToDelete != null)
            {
                _context.Allergens.Remove(allergenToDelete);
                try
                {
                    _context.SaveChanges();
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
            else
                return NotFound();
            return Ok();
        }
    }
}
