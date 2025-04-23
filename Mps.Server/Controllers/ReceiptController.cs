using Google.Api.Gax.Grpc;
using Google.Cloud.AIPlatform.V1;
using Google.Protobuf;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.IO;
using Mps.Server.NewModels;
using System.Security.Claims;
using Mps.Server.Data;
using System.Globalization;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Mps.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReceiptController : ControllerBase
    {
        private readonly MpsContext _context;
        public ReceiptController(MpsContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult> Post(IFormFile receipt)
        {
            string[] allowedExtensions = [".png", ".jpeg", ".jpg"];

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(receipt.FileName);

            var filePath = Path.Combine("E:\\Users\\Namu\\Desktop\\Mps\\Mps.client\\public\\", "Uploads", fileName);

            if (!Array.Exists(allowedExtensions, ext => ext.Equals(Path.GetExtension(filePath), StringComparison.OrdinalIgnoreCase)))
            {
                return BadRequest("File extension is not allowed: " + Path.GetExtension(filePath));
            }

            Directory.CreateDirectory(Path.GetDirectoryName(filePath));

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await receipt.CopyToAsync(stream);
            }
            return await GenerateContent(filePath);
        }

        [HttpGet("Read")]
        public async Task<ActionResult> GenerateContent(
        string filePath,
        string projectId = "mitybos-planavimo-sistema",
        string location = "europe-west1",
        string publisher = "google",
        string model = "gemini-1.0-pro-vision"
        )
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (userEmail != null)
            {
                var user = _context.Users.FirstOrDefault(u => u.Email == userEmail);
                if (user != null)
                {
                    var predictionServiceClient = new PredictionServiceClientBuilder
                    {
                        Endpoint = $"{location}-aiplatform.googleapis.com"
                    }.Build();

                    ByteString receipt = await ReadImageFileAsync(filePath);

                    var content = new Content
                    {
                        Role = "USER"
                    };
                    content.Parts.AddRange(new List<Part>()
                    {
                        new()
                        {
                            InlineData = new()
                            {
                                MimeType = "image/png",
                                Data = receipt
                            }
                        },
                        new()
                        {
                            Text = "Extract only food products, their quantity (if available) and measurement unit (if available) from this receipt. " +
                            "Also get generic nutrition information for each product (calories, fat, protein, carbohydrates). " +
                            "Provide this information in a table format: | Food | Quantity | Measurement unit | Calories (no measurement unit needed) | Fat (no measurement unit needed) | Protein (no measurement unit needed) | Carbs (no measurement unit needed) |"
                        }
                    });

                    var generateContentRequest = new GenerateContentRequest
                    {
                        Model = $"projects/{projectId}/locations/{location}/publishers/{publisher}/models/{model}"
                    };
                    generateContentRequest.Contents.Add(content);

                    var response = await predictionServiceClient.GenerateContentAsync(generateContentRequest);

                    StringBuilder fullText = new();

                    fullText.Append(response.Candidates[0].Content.Parts[0].Text);

                    var responseString = fullText.ToString();
                    string[] lines = responseString.Split('\n');

                    for (int i = 0; i < lines.Length; i++)
                    {
                        if (i > 1)
                        {
                            string[] parts = lines[i].Split("|");

                            var title = parts[1];
                            var quantity = !string.IsNullOrEmpty(parts[2].Trim())
                                            ? parts[2]
                                            : "1";
                            var calories = !string.IsNullOrEmpty(parts[4].Trim()) ? parts[4] : "1";
                            var fat = !string.IsNullOrEmpty(parts[5].Trim()) ? parts[5] : "1";
                            var protein = !string.IsNullOrEmpty(parts[6].Trim()) ? parts[6] : "1";
                            var carbs = !string.IsNullOrEmpty(parts[7].Trim()) ? parts[7] : "1";
                            var measurementUnit = !string.IsNullOrEmpty(parts[3].Trim())
                                            ? GetMeasurementUnit(parts[3].Trim())
                                            : 5;

                            var userProduct = new UserProduct
                            {
                                ExpirationDate = DateOnly.FromDateTime(DateTime.Now),
                                Note = "",
                                Quantity = Convert.ToDecimal(quantity, CultureInfo.InvariantCulture),
                                MeasurementUnit = measurementUnit,
                                IdUser = user.IdUser
                            };

                            var userProducts = new List<UserProduct>
                                {
                                    userProduct
                                };

                            var productToAdd = new Product
                            {
                                Title = title,
                                Calories = Convert.ToDecimal(calories, CultureInfo.InvariantCulture),
                                Fat = Convert.ToDecimal(fat, CultureInfo.InvariantCulture),
                                Protein = Convert.ToDecimal(protein, CultureInfo.InvariantCulture),
                                Carbs = Convert.ToDecimal(carbs, CultureInfo.InvariantCulture),
                                Image = null,
                                UserProducts = userProducts
                            };

                            await _context.AddAsync(productToAdd);
                            await _context.SaveChangesAsync();

                            var categoryProduct = new CategoryProduct
                            {
                                IdCategory = 1002,
                                IdProduct = productToAdd.IdProduct
                            };

                            await _context.AddAsync(categoryProduct);
                        }
                    }

                    try
                    {
                        await _context.SaveChangesAsync();
                        System.IO.File.Delete(filePath);
                    }
                    catch (Exception ex)
                    {
                        var c = ex;
                        return StatusCode(500, $"Internal server error: {ex.Message}");
                    }
                }
            }

            return Ok();
        }

        private static async Task<ByteString> ReadImageFileAsync(string filePath)
        {
            byte[] imageBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            return ByteString.CopyFrom(imageBytes);
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
                "teaspoons" => 9,
                "clove" => 10,
                "slice" => 11,
                "fruit" => 12,
                "oz" => 13,
                "ounces" => 13,
                "ounce" => 13,
                "ozs" => 13,
                "small" => 14,
                "tablespoon" => 15,
                "tablespoons" => 15,
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
    }
}
