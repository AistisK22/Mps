using Mps.Server.Data;
using Mps.Server.NewModels;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using System.Security.Claims;

namespace Mps.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductController : ControllerBase
    {
        private readonly MpsContext _context;
        private readonly IConfiguration _config;
        public ProductController(MpsContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpGet]
        public ActionResult<List<UserProductDto>> Get()
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
                    return _context.UserProducts
                                    .Include(up => up.IdProductNavigation)
                                    .Where(up => up.IdUser == user.IdUser)
                                    .Select(up => new UserProductDto
                                    { 
                                        ExpirationDate = up.ExpirationDate,
                                        IdProductNavigation = up.IdProductNavigation,
                                        Quantity = up.Quantity,
                                        IdUserProduct = up.IdUserProduct,
                                        Note = up.Note,
                                        MeasurementUnit = up.MeasurementUnit,
                                        IdProduct = up.IdProduct,
                                        Categories = _context.CategoryProducts
                                                             .Where(p => p.IdProduct == up.IdProduct)
                                                             .Select(p => p.IdCategory).ToList()
                                    })
                                    .ToList();
                }
            }
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromForm] ProductVM product)
        {
            string fileName = "";
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
                    try
                    {
                        if (product.Image != null)
                        {
                            fileName = Guid.NewGuid().ToString() + Path.GetExtension(product.Image.FileName);

                            var filePath = Path.Combine(_config.GetSection("FileSettings:UploadFolder").Value!, "Uploads", fileName);

                            Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                            using var stream = new FileStream(filePath, FileMode.Create);
                            await product.Image.CopyToAsync(stream);
                        }

                        var userProduct = new UserProduct
                        {
                            ExpirationDate = DateOnly.FromDateTime(product.ExpirationDate),
                            Note = product.Note,
                            Quantity = product.Quantity,
                            MeasurementUnit = product.Unit,
                            IdUser = user.IdUser
                        };

                        var userProducts = new List<UserProduct>
                        {
                            userProduct
                        };

                        var productToAdd = new Product
                        {
                            Title = product.Title,
                            Calories = product.Calories,
                            Fat = product.Fat,
                            Protein = product.Protein,
                            Carbs = product.Carbs,
                            Image = fileName == "" ? null : fileName,
                            UserProducts = userProducts
                        };

                        await _context.AddAsync(productToAdd);
                        await _context.SaveChangesAsync();

                        if (product.Category.Count > 0)
                        {
                            foreach (var categoryID in product.Category)
                            {
                                var categoryProduct = new CategoryProduct
                                {
                                    IdCategory = categoryID,
                                    IdProduct = productToAdd.IdProduct
                                };

                                await _context.AddAsync(categoryProduct);
                            }
                        }

                        await _context.SaveChangesAsync();
                        return Ok();

                    }
                    catch (Exception ex)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, $"Error uploading file: {ex.Message}");
                    }
                }
            }      
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromForm] ProductVM product)
        {
            var productToUpdate = _context.Products.Include(p => p.UserProducts).FirstOrDefault(p => p.IdProduct == id);
            if (productToUpdate == null)
            {
                return NotFound("Product was not found");
            }

            var userProductToUpdate = productToUpdate.UserProducts.FirstOrDefault();
            if (userProductToUpdate == null)
            {
                return NotFound("Product was not found");
            }

            if (product.Image != null && product.Image.Length != 0)
            {
                try
                {
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(product.Image.FileName);

                    var filePath = Path.Combine(_config.GetSection("FileSettings:UploadFolder").Value!, "Uploads", fileName);

                    Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await product.Image.CopyToAsync(stream);
                    }

                    productToUpdate.Image = fileName;
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, $"Error uploading file: {ex.Message}");
                }
            }

            productToUpdate.Title = product.Title;
            productToUpdate.Fat = product.Fat;
            productToUpdate.Calories = product.Calories;
            productToUpdate.Carbs = product.Carbs;
            productToUpdate.Protein = product.Protein;
            userProductToUpdate.Note = product.Note;
            userProductToUpdate.MeasurementUnit = product.Unit;
            userProductToUpdate.Quantity = product.Quantity;
            userProductToUpdate.ExpirationDate = DateOnly.FromDateTime(product.ExpirationDate);
            
            _context.Update(userProductToUpdate);
            _context.Update(productToUpdate);

            var categoryProductsToDelete = _context.CategoryProducts.Where(p => p.IdProduct == productToUpdate.IdProduct).ToList();
            if (categoryProductsToDelete != null)
            {
                _context.RemoveRange(categoryProductsToDelete);
            }

            if (product.Category.Count > 0)
            {
                foreach (var categoryID in product.Category)
                {
                    var categoryProduct = new CategoryProduct
                    {
                        IdCategory = categoryID,
                        IdProduct = productToUpdate.IdProduct
                    };

                    _context.Add(categoryProduct);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error updating product: {ex.Message}");
            }

            return Ok();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var product = _context.Products.Include(p => p.UserProducts).FirstOrDefault(p => p.IdProduct == id);
            if (product == null)
            {
                return NotFound("Product was not found");
            }
            else
            {
                if (product.Image != null)
                {
                    var filePath = Path.Combine(_config.GetSection("FileSettings:UploadFolder").Value!, "Uploads", product.Image);
                    try
                    {
                        System.IO.File.Delete(filePath);
                    }
                    catch (Exception ex)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting product's image: {ex.Message}");
                    }
                }

                product.UserProducts.Clear();
                _context.Remove(product);
                try
                {
                    _context.SaveChanges();
                    return Ok();
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting product: {ex.Message}");
                }
            }
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpGet("send-product-reminders")]
        public Task SendProductReminders()
        {
            var todayDate = DateOnly.FromDateTime(DateTime.Today);
            var users = _context.Users.ToList();
            if (users.Count > 0)
            {
                foreach (var user in users)
                {
                    var needToSend = false;
                    string reminderText = "<h3>Your's expiring food products:</h3>";
                    reminderText += "<table " +
                        "style=\"" +
                        "border-radius:4px" +
                        "border-collapse:collapse; box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);" +
                        "margin:25px 0; min-width: 400px;" +
                        "font-size:0.9em; font-family:sans-serif\">" +
                        "<tr>" +
                        "<th style=\"background-color: #FFA500;color: #ffffff;text-align: left;padding: 12px 15px;\">Product's name</th>" +
                        "<th style=\"background-color: #FFA500;color: #ffffff;text-align: left;padding: 12px 15px;\">Expiration date</th>" +
                        "</tr>" +
                        "<tr>";
                    var userProducts = _context.UserProducts
                                                .Include(up => up.IdProductNavigation)
                                                .Where(up => up.IdUser == user.IdUser)
                                                .ToList();
                    if (userProducts.Count > 0)
                    {
                        foreach (var userProduct in userProducts)
                        {
                            var dateToCompare = todayDate.AddDays(1);
                            if (userProduct.ExpirationDate < dateToCompare)
                            {
                                needToSend = true;
                                var daysRemaining = userProduct.ExpirationDate.DayNumber - todayDate.DayNumber;
                                reminderText += "<td style=\"padding: 12px 15px;\">" + userProduct.IdProductNavigation.Title + "</td>"
                                              + "<td style=\"padding: 12px 15px;\">" + userProduct.ExpirationDate.ToString("yyyy-MM-dd")
                                              + "<span style=\"color:red\">&nbsp;(" + daysRemaining + " days)</span></td></tr>";
                            }
                        }
                    }

                    if (needToSend)
                    {
                        reminderText += "</table>";
                        try
                        {
                            var emailMessage = new MimeMessage();
                            var a = _config.GetSection("FileSettings:UploadFolder").Value;
                            emailMessage.From.Add(new MailboxAddress("AisKai", _config.GetSection("SmtpSettings:Username").Value));
                            emailMessage.To.Add(new MailboxAddress("Everette Fahey", _config.GetSection("SmtpSettings:Username").Value));
                            emailMessage.Subject = "Expiring products";
                            emailMessage.Body = new TextPart("html")
                            {
                                Text = reminderText
                            };

                            using var client = new SmtpClient();
                            client.Connect("smtp.ethereal.email", 587, SecureSocketOptions.StartTls); 
                            client.Authenticate(_config.GetSection("SmtpSettings:Username").Value, _config.GetSection("SmtpSettings:Password").Value); 
                            client.Send(emailMessage);
                            client.Disconnect(true);

                            return Task.CompletedTask;
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
                    }
                }
            }
            return Task.CompletedTask;
        }

    }
}
