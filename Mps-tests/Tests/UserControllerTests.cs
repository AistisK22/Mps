using Mps.Server.Controllers;
using Mps.Server.Data;
using Mps.Server.NewModels;
using Microsoft.AspNetCore.Http;
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
    public class UserControllerTests
    {
        private UserController _controller;

        [SetUp]
        public void Setup()
        {
            var configBuilder = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.json");

            var _config = configBuilder.Build();
            var _context = new MpsContext();

            _controller = new UserController(_context, _config);
        }

        [Test]
        public void Get_ReturnsListOfUsers()
        {
            var result = _controller.Get();

            // Assert
            Assert.That(result, Is.InstanceOf<List<User>>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void GetUser_ReturnsUser_WhenUserExists()
        {
            var result = _controller.GetUser();

            Assert.That(result, Is.InstanceOf<ActionResult<User>>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void UpdateUser_ReturnsOkResult_WhenUserIsUpdatedSuccessfully()
        {
            var user = new UserVM 
            { 
                BirthDate = DateOnly.FromDateTime(new DateTime(2024, 1, 1)),
                Weight = 100,
                Height = 180,
                Gender = 1,
                PhysicalActivityLevel = 1,
                IdGoal = 1
            };

            var result = _controller.UpdateUser(user);

            Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Register_WithValidUserData_ReturnsOkResult()
        {
            // Arrange
            var userDto = new UserRegistrationDto
            {
                Name = "John",
                Surname = "Doe",
                Birthdate = DateOnly.FromDateTime(new DateTime(2024, 1, 1)),
                Email = "john.doe1@example.com",
                Password = "password",
                Weight = 70,
                Height = 180,
                Gender = 1,
                Role = "",
                Active = true,
                PhysicalActivityLevel = 2,
                IdGoal = 1
            };

            // Act
            var result = _controller.Register(userDto);

            Assert.That(result, Is.InstanceOf<ActionResult<User>>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Register_WithDuplicateEmail_ReturnsBadRequest()
        {
            // Arrange
            var userDto = new UserRegistrationDto
            {
                Name = "John",
                Surname = "Doe",
                Birthdate = DateOnly.FromDateTime(new DateTime(2024, 1, 1)),
                Email = "bandau@asd.com",
                Password = "password",
                Weight = 70,
                Height = 180,
                Gender = 0,
                Role = "",
                Active = true,
                PhysicalActivityLevel = 2,
                IdGoal = 1
            };

            // Act
            var result = _controller.Register(userDto);

            Assert.That(result.Result, Is.InstanceOf<BadRequestObjectResult>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Login_WithValidCredentials_ReturnsOkResultWithToken()
        {
            var loginVM = new LoginVM
            {
                Email = "test@test.com",
                Password = "Testinis1"
            };

            var result = _controller.Login(loginVM);

            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Login_WithInvalidCredentials_ReturnsUnauthorizedResult()
        {
            var loginVM = new LoginVM
            {
                Email = "test@test.com",
                Password = "555"
            };

            var result = _controller.Login(loginVM);

            Assert.That(result, Is.InstanceOf<UnauthorizedObjectResult>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Block_WithValidId_TogglesUserActiveStatusAndReturnsOkResult()
        {
            var user = new User
            {
                IdUser = 1002,
                Active = true
            };

            var result = _controller.Block(user.IdUser);

            Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Block_WithInvalidId_ReturnsBadRequestResult()
        {
            // Arrange
            var userId = 999; // Assuming a non-existing user ID

            var result = _controller.Block(userId);

            Assert.That(result.Result, Is.InstanceOf<BadRequestObjectResult>());
            Assert.That(result, Is.Not.Null);
        }

        [Test]
        public void Delete_ValidUser_ReturnsOkResult()
        {
            var result = _controller.Delete();

            Assert.That(result, Is.InstanceOf<OkResult>());
            Assert.That(result, Is.Not.Null);
        }
    }
}
