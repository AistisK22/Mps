using Mps.Server.Controllers;
using Mps.Server.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mps_tests.Tests
{
    [TestFixture]
    public class ReceiptControllerTests
    {
        private ReceiptController _controller;

        [SetUp]
        public void Setup()
        {
            var _context = new MpsContext();

            _controller = new ReceiptController(_context);
        }

        [Test]
        public async Task Post_ValidFile_ReturnsContent()
        {
            var result = await _controller.GenerateContent("../../../../Mps.Server/Uploads/test.png");

            // Assert
            Assert.That(result, Is.InstanceOf<OkResult>());
            Assert.That(result, Is.Not.Null);
        }
    }
}
