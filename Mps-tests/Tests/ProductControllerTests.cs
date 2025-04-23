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
    public class ProductControllerTests
    {
        private ProductController _controller;

        [SetUp]
        public void Setup()
        {
            var _context = new MpsContext();

            _controller = new ProductController(_context);
        }

        [Test]
        public void Get_ReturnsProductList()
        {
            // Act
            var result = _controller.Get();

            // Assert
            Assert.That(result, Is.InstanceOf<ActionResult<List<UserProductDto>>>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Post_ReturnsOk_WhenProductAddedSuccessfully()
        {
            // Arrange
            var product = new ProductVM 
            { 
                Title = "Test", 
                Quantity = 1,
                Note = "",
                Unit = 1,
                ExpirationDate = new DateTime(2024, 4, 25),
                Calories = 1,
                Fat = 1,
                Protein = 1,
                Carbs = 1
            };

            // Act
            var result = _controller.Post(product);

            // Assert
            Assert.That(result.Result, Is.InstanceOf<OkResult>());
        }

        [Test]
        public void Put_ReturnsOk_WhenProductUpdatedSuccessfully()
        {
            // Arrange
            var productToUpdate = 20754; // Assuming this ID exists in the fake context
            var updatedProduct = new ProductVM
            {
                Title = " Kedainiu aštrios morkos ",
                Quantity = 1,
                Note = "",
                Unit = 5,
                ExpirationDate = new DateTime(2024, 4, 25),
                Calories = 245,
                Fat = 1,
                Protein = 1,
                Carbs = 1
            };

            // Act
            var result = _controller.Put(productToUpdate, updatedProduct);

            Assert.That(result.Result, Is.InstanceOf<OkResult>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Put_ReturnsInternalServerError_WhenProductNotFound()
        {
            // Arrange
            var nonExistentProductId = -1; // Assuming this ID doesn't exist in the fake context
            var updatedProduct = new ProductVM
            {
                Title = " Kedainiu aštrios morkos ",
                Quantity = 1,
                Note = "",
                Unit = 5,
                ExpirationDate = new DateTime(2024, 4, 25),
                Calories = 245,
                Fat = 1,
                Protein = 1,
                Carbs = 1
            };
            // Act
            var result = _controller.Put(nonExistentProductId, updatedProduct);

            // Assert
            Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
        }

        [Test]
        public void Delete_ReturnsOk_WhenProductDeletedSuccessfully()
        {
            // Arrange
            var productIdToDelete = 20758;

            // Act
            var result = _controller.Delete(productIdToDelete);

            // Assert
            Assert.That(result, Is.InstanceOf<OkResult>());
        }

        [Test]
        public void Delete_ReturnsInternalServerError_WhenProductNotFound()
        {
            // Arrange
            var nonExistentProductId = 2; // Assuming this ID doesn't exist in the fake context

            // Act
            var result = _controller.Delete(nonExistentProductId);

            // Assert
            Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
        }
    }
}
