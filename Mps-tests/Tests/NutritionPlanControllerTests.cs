using Mps.Server.Controllers;
using Mps.Server.Data;
using Mps.Server.NewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NUnit.Framework;

namespace Mps_tests.Tests
{
    [TestFixture]
    public class NutritionPlanControllerTests
    {
        private NutritionPlanController _controller;

        [SetUp]
        public void Setup()
        {
            var configBuilder = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.json");

            var _config = configBuilder.Build();
            var _context = new MpsContext();

            _controller = new NutritionPlanController(_config, _context);
        }

        [Test]
        public void Get_ValidIdAndStartDate_ReturnsNutritionPlan()
        {
            int validId = 9021;
            DateTime validStartDate = new (2024, 4, 15);

            var result = _controller.Get(validId, validStartDate);

            Assert.That(result, Is.InstanceOf<ActionResult<NutritionPlan>>());
            Assert.That(result.Value, Is.Not.Null);
        }

        [Test]
        public void GetPlanNutrition_ValidId_ReturnsPlanNutrition()
        {
            int validId = 9021;

            var result = _controller.GetPlanNutrition(validId);

            Assert.That(result, Is.InstanceOf<ActionResult<PlanNutrition>>());
            Assert.That(result.Value, Is.Not.Null);
        }

        [Test]
        public void GetAll_ReturnsNutritionPlans()
        {
            var result = _controller.GetAll();

            Assert.That(result, Is.InstanceOf<ActionResult<List<PlanInformation>>>());
            Assert.That(result.Value, Is.Not.Null);
        }

        [Test]
        public void CreatePlan_ReturnsOk_WhenPlanCreatedSuccessfully()
        {
            var startDate = new DateTime(2024, 4, 22);
            var endDate = new DateTime(2024, 4, 28);
            var recipeInfo = new RecipeInformation
            {
                PlanDate = new DateTime(2024, 4, 22),
                Servings = 2,
                DishType = 1,
                Title = "Test",
                ReadyInMinutes = 30,
                Summary = "Test",
                Nutrition = new()
                {
                    Ingredients = []
                }
            };

            recipeInfo.Nutrition.Ingredients.Add(new Ingredient{
                Name ="Test",
                Amount = 1,
                Unit = "g",
                Nutrients =
                [
                    new Nutrient
                    {
                        Name = "Calories",
                        Amount = 1,
                        Unit = "g"
                    },
                    new Nutrient
                    {
                        Name = "Protein",
                        Amount = 1,
                        Unit = "g"
                    },
                    new Nutrient
                    {
                        Name = "Fat",
                        Amount = 1,
                        Unit = "g"
                    },
                    new Nutrient
                    {
                        Name = "Carbohydrates",
                        Amount = 1,
                        Unit = "g"
                    }
                ]
            });

            var result = _controller.CreatePlan(startDate, endDate, recipeInfo);

            Assert.That(result, Is.InstanceOf<OkResult>());
        }

        [Test]
        public void RemoveDish_ReturnsNotFound_WhenDishNotFound()
        {
            var nonExistentDishId = 99999; 

            var result = _controller.RemoveDish(nonExistentDishId);

            Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
        }

        [Test]
        public void RemoveDish_ReturnsOk_WhenDishRemovedSuccessfully()
        {
            var existingDishId = 2004;

            var result = _controller.RemoveDish(existingDishId);

            Assert.That(result, Is.InstanceOf<OkResult>());
        }

        [Test]
        public void AddRecipeToPlan_ReturnsOk_WhenRecipeAddedSuccessfully()
        {
            var recipeInfo = new RecipeInformation
            {
                PlanDate = new DateTime(2024, 4, 22),
                Servings = 2,
                DishType = 1,
                Title = "Test",
                ReadyInMinutes = 30,
                Summary = "Test",
                Nutrition = new()
                {
                    Ingredients = []
                }
            };

            recipeInfo.Nutrition.Ingredients.Add(new Ingredient
            {
                Name = "Test",
                Amount = 1,
                Unit = "g",
                Nutrients =
                [
                    new Nutrient
                    {
                        Name = "Calories",
                        Amount = 1,
                        Unit = "g"
                    },
                    new Nutrient
                    {
                        Name = "Protein",
                        Amount = 1,
                        Unit = "g"
                    },
                    new Nutrient
                    {
                        Name = "Fat",
                        Amount = 1,
                        Unit = "g"
                    },
                    new Nutrient
                    {
                        Name = "Carbohydrates",
                        Amount = 1,
                        Unit = "g"
                    }
                ]
            });

            var result = _controller.AddRecipeToPlan(3113, recipeInfo);

            Assert.That(result, Is.InstanceOf<OkResult>());
        }

        [Test]
        public void UpdateDishConsumption_ReturnsNotFound_WhenDishNotFound()
        {
            // Arrange
            var nonExistentDishId = 999999; // Assuming this ID doesn't exist in the database

            // Act
            var result = _controller.UpdateDishConsumption(nonExistentDishId, 1); // Assuming a consumption of 2 servings

            // Assert
            Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
        }

        [Test]
        public void UpdateDishConsumption_ReturnsOk_WhenDishConsumptionUpdatedSuccessfully()
        {
            // Arrange
            var existingDishId = 2007; // Assuming this ID exists in the database
            var servingsConsumed = 1; // Assuming a consumption of 2 servings

            // Act
            var result = _controller.UpdateDishConsumption(existingDishId, servingsConsumed);

            // Assert
            Assert.That(result, Is.InstanceOf<OkResult>());
        }

        [Test]
        public void Delete_ReturnsNotFound_WhenPlanNotFound()
        {
            // Arrange
            var nonExistentPlanId = 123; // Assuming this ID doesn't exist in the database

            // Act
            var result = _controller.Delete(nonExistentPlanId);

            // Assert
            Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
        }

        [Test]
        public void Delete_ReturnsOk_WhenPlanDeletedSuccessfully()
        {
            // Arrange
            var existingPlanId = 12023; // Assuming this ID exists in the database

            // Act
            var result = _controller.Delete(existingPlanId);

            // Assert
            Assert.That(result, Is.InstanceOf<OkResult>());
        }
    }
}
