using Mps.Server.Data;
using Mps.Server.NewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Mps.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GoalController : ControllerBase
    {
        private readonly MpsContext _context;
        public GoalController(MpsContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public List<Goal> Get()
        {
            return _context.Goals.ToList();
        }

        [HttpPost]
        public ActionResult Post([FromBody] Goal GoalVM)
        {
            _context.Goals.Add(GoalVM);
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
        public ActionResult Put(int id, [FromBody] Goal GoalVM)
        {
            var GoalToUpdate = _context.Goals.FirstOrDefault(al => al.IdGoal == id);
            if (GoalToUpdate != null)
            {
                GoalToUpdate.Name = GoalVM.Name;
                GoalToUpdate.Description = GoalVM.Description;
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
                return NotFound("Goal not found");
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var GoalToDelete = _context.Goals.FirstOrDefault(al => al.IdGoal == id);
            if (GoalToDelete != null)
            {
                _context.Goals.Remove(GoalToDelete);
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
                return NotFound("Goal not found");
        }
    }
}
