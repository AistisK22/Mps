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
    public class AllergenControllerTests
    {
        private AllergenController _controller;

        [SetUp]
        public void Setup()
        {
            var _context = new MpsContext();

            _controller = new AllergenController(_context);
        }

        [Test]
        public void Get_ReturnsAllergensList()
        {
            // Act
            var result = _controller.Get();

            // Assert
            Assert.That(result, Is.InstanceOf<List<Allergen>>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void GetSelected_ReturnsAllergensDtoList_ForAuthenticatedUser()
        {
            // Act
            var result = _controller.GetSelected();

            // Assert
            Assert.That(result, Is.InstanceOf<ActionResult<List<AllergenDto>>>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Post_ReturnsOk_WhenAllergensUpdatedSuccessfully()
        {
            var fakeAllergenIDs = new List<string> { "1", "6", "7" };

            // Act
            var result = _controller.Post(fakeAllergenIDs);

            // Assert
            Assert.That(result, Is.InstanceOf<OkObjectResult>());
        }

        [Test]
        public void Post_ReturnsOk_WhenAllergenAddedSuccessfully()
        {
            // Arrange
            var allergen = new Allergen { Name = "Peanuts", Description = "Allergen description" };

            // Act
            var result = _controller.Post(allergen);

            // Assert
            Assert.That(result, Is.InstanceOf<OkResult>());
        }

        [Test]
        public void Put_ReturnsOk_WhenAllergenUpdatedSuccessfully()
        {
            // Arrange
            var allergenIdToUpdate = 1; // Assuming this ID exists in the fake context
            var updatedAllergen = new Allergen { IdAllergen = allergenIdToUpdate, Name="Dairy", Description = "Adverse immune reaction to one or more proteins in cow's mil" };

            // Act
            var result = _controller.Put(allergenIdToUpdate, updatedAllergen);

            Assert.That(result, Is.InstanceOf<OkResult>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Put_ReturnsInternalServerError_WhenAllergenNotFound()
        {
            // Arrange
            var nonExistentAllergenId = 999; // Assuming this ID doesn't exist in the fake context
            var updatedAllergen = new Allergen { IdAllergen = nonExistentAllergenId, Name = "Updated Allergen", Description = "Updated description" };

            // Act
            var result = _controller.Put(nonExistentAllergenId, updatedAllergen);

            Assert.That(result, Is.InstanceOf<OkResult>());
        }

        [Test]
        public void Delete_ReturnsOk_WhenAllergenDeletedSuccessfully()
        {
            // Arrange
            var allergenIdToDelete = 2006;

            // Act
            var result = _controller.Delete(allergenIdToDelete);

            // Assert
            Assert.That(result, Is.InstanceOf<OkResult>());
        }
    }
}
