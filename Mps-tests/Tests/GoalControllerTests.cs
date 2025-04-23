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
    public class GoalControllerTests
    {
        private GoalController _controller;

        [SetUp]
        public void Setup()
        {
            var _context = new MpsContext();

            _controller = new GoalController(_context);
        }

        [Test]
        public void Get_ReturnsGoalList()
        {
            // Act
            var result = _controller.Get();

            // Assert
            Assert.That(result, Is.InstanceOf<List<Goal>>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Post_ReturnsOk_WhenGoalAddedSuccessfully()
        {
            // Arrange
            var goal = new Goal { Name = "Test", Description = "Test description" };

            // Act
            var result = _controller.Post(goal);

            // Assert
            Assert.That(result, Is.InstanceOf<OkResult>());
        }

        [Test]
        public void Put_ReturnsOk_WhenGoalUpdatedSuccessfully()
        {
            // Arrange
            var goalToUpdate = 1; // Assuming this ID exists in the fake context
            var updatedGoal = new Goal { IdGoal = goalToUpdate, Name= "Gain weight", Description = "Focus on consuming calorie-dense foods such as nuts, avocados, and lean proteins regularly, while incorporating strength training exercises to build muscle mass" };

            // Act
            var result = _controller.Put(goalToUpdate, updatedGoal);

            Assert.That(result, Is.InstanceOf<OkResult>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Put_ReturnsInternalServerError_WhenAllergenNotFound()
        {
            // Arrange
            var nonExistentGoalId = 999; // Assuming this ID doesn't exist in the fake context
            var updatedGoal = new Goal { IdGoal = nonExistentGoalId, Name = "Gain weight", Description = "Focus on consuming calorie-dense foods such as nuts, avocados, and lean proteins regularly, while incorporating strength training exercises to build muscle mass" };

            // Act
            var result = _controller.Put(nonExistentGoalId, updatedGoal);

            // Assert
            Assert.That(result, Is.InstanceOf<BadRequestResult>());
        }

        [Test]
        public void Delete_ReturnsOk_WhenGoalDeletedSuccessfully()
        {
            // Arrange
            var goalIdToDelete = 2006;

            // Act
            var result = _controller.Delete(goalIdToDelete);

            // Assert
            Assert.That(result, Is.InstanceOf<OkResult>());
        }

        [Test]
        public void Delete_ReturnsInternalServerError_WhenGoalNotFound()
        {
            // Arrange
            var nonExistentGoalId = 999; // Assuming this ID doesn't exist in the fake context

            // Act
            var result = _controller.Delete(nonExistentGoalId);

            Assert.That(result, Is.InstanceOf<BadRequestResult>());
        }
    }
}
