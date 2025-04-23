using Mps.Server.Controllers;
using Mps.Server.Data;
using Mps.Server.NewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Mps_tests.Tests
{
    [TestFixture]
    public class ShoppingListControllerTests
    {
        private ShoppingListController _controller;

        [SetUp]
        public void Setup()
        {
            var _context = new MpsContext();

            _controller = new ShoppingListController(_context);
        }

        [Test]
        public void Get_ReturnsShoppingList()
        {
            // Act
            var result = _controller.Get();

            // Assert
            Assert.That(result, Is.InstanceOf<ActionResult<List<ShoppingList>>>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Get_ValidId_ReturnsOkResultWithExpectedData()
        {
            // Arrange
            int validId = 3005;

            // Act
            var result = _controller.Get(validId);

            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void UpdateTitle_ValidIdAndTitle_ReturnsOkResult()
        {
            // Arrange
            int validId = 3005;
            string newTitle = "Updated ShoppingList 1";

            // Act
            var result = _controller.UpdateTitle(validId, newTitle);

            // Assert
            Assert.That(result, Is.InstanceOf<OkResult>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void UpdateTitle_InvalidId_ReturnsNotFoundResult()
        {
            // Arrange
            int invalidId = 999; // Assuming this ID does not exist
            string newTitle = "Updated ShoppingList";

            // Act
            var result = _controller.UpdateTitle(invalidId, newTitle);

            // Assert
            Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Delete_ValidId_ReturnsOkResult()
        {
            // Arrange
            int validId = 6005;

            // Act
            var result = _controller.Delete(validId);

            // Assert
            Assert.That(result, Is.InstanceOf<OkResult>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Delete_InvalidId_ReturnsNotFoundResult()
        {
            // Arrange
            int invalidId = 999; // Assuming this ID does not exist

            // Act
            var result = _controller.Delete(invalidId);

            // Assert
            Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Delete_ValidIds_ReturnsOkResult()
        {
            int validId = 3005;
            int validProductId = 9473;

            var result = _controller.Delete(validId, validProductId);

            Assert.That(result, Is.InstanceOf<OkResult>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Delete_InvalidIds_ReturnsNotFoundResult()
        {
            int validId = 4005;
            int invalidProductId = 1; // Assuming this ID does not exist in the shopping list

            var result = _controller.Delete(validId, invalidProductId);

            // Assert
            Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public async Task Post_ValidData_ReturnsOkResult()
        {
            var result = await _controller.Post("test", 10021);

            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            Assert.That(result, Is.Not.Null);
        }
    }
}
