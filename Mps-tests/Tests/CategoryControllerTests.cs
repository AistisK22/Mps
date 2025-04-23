using Mps.Server.Controllers;
using Mps.Server.Data;
using Mps.Server.NewModels;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mps_tests.Tests
{
    [TestFixture]
    public class CategoryControllerTests
    {
        private CategoryController _controller;

        [SetUp]
        public void Setup()
        {
            var _context = new MpsContext();

            _controller = new CategoryController(_context);
        }

        [Test]
        public void Get_ReturnsCategoryList()
        {
            // Act
            var result = _controller.Get();

            // Assert
            Assert.That(result, Is.InstanceOf<List<Category>>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void GetSelected_ReturnsCategoryDtoList_ForAuthenticatedUser()
        {
            // Act
            var result = _controller.GetSelected();

            // Assert
            Assert.That(result, Is.InstanceOf<ActionResult<List<CategoryDto>>>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Post_ReturnsOk_WhenCategoriesUpdatedSuccessfully()
        {
            var fakeCategoryIDs = new List<string> { "1", "2" };

            // Act
            var result = _controller.Select(fakeCategoryIDs);

            // Assert
            Assert.That(result, Is.InstanceOf<ObjectResult>());
        }

        [Test]
        public void Post_ReturnsOk_WhenCategoryAddedSuccessfully()
        {
            // Arrange
            var category = new Category { Title = "Category" };

            // Act
            var result = _controller.Post(category);

            // Assert
            Assert.That(result, Is.InstanceOf<OkResult>());
        }

        [Test]
        public void Put_ReturnsOk_WhenCategoryUpdatedSuccessfully()
        {
            // Arrange
            var categoryIdToUpdate = 1; // Assuming this ID exists in the fake context
            var updatedCategory = new Category { IdCategory = categoryIdToUpdate, Title= "Fruit and vegetables" };

            // Act
            var result = _controller.Put(categoryIdToUpdate, updatedCategory);

            Assert.That(result, Is.InstanceOf<OkResult>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Put_ReturnsInternalServerError_WhenCategoryNotFound()
        {
            // Arrange
            var nonExistentCategoryId = 999; // Assuming this ID doesn't exist in the fake context
            var updatedCategory = new Category { IdCategory = nonExistentCategoryId, Title = "Fruit and vegetables" };

            // Act
            var result = _controller.Put(nonExistentCategoryId, updatedCategory);

            Assert.That(result, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public void Delete_ReturnsOk_WhenCategoryDeletedSuccessfully()
        {
            // Arrange
            var categoryToDelete = 3006;

            // Act
            var result = _controller.Delete(categoryToDelete);

            // Assert
            Assert.That(result, Is.InstanceOf<OkResult>());
        }

        [Test]
        public void Delete_ReturnsInternalServerError_WhenCategoryNotFound()
        {
            // Arrange
            var nonExistentCategoryId = 999; // Assuming this ID doesn't exist in the fake context

            // Act
            var result = _controller.Delete(nonExistentCategoryId);

            Assert.That(result, Is.InstanceOf<BadRequestResult>());
        }
    }
}
