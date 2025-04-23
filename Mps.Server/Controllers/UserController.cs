using Mps.Server.Data;
using Mps.Server.NewModels;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;


namespace Mps.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly MpsContext _context;
        private readonly IConfiguration _config;
        public UserController(MpsContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpGet]
        [Authorize]
        public List<User> Get()
        {
            return _context.Users.ToList();
        }

        [HttpGet("GetUser")]
        [Authorize]
        public ActionResult<User> GetUser()
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = _context.Users.Include(u => u.PhysicalActivityLevelNavigation).FirstOrDefault(u => u.Email == userEmail);
            if (user == null) 
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPut("Update")]
        [Authorize]
        public ActionResult<User> UpdateUser(UserVM userVM)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = _context.Users.FirstOrDefault(u => u.Email == userEmail);
            if (user == null)
            {
                return NotFound("User not found");
            }
            else
            {
                user.Birthdate = userVM.BirthDate;  
                user.Weight = userVM.Weight;
                user.Height = userVM.Height;
                user.Gender = userVM.Gender;
                user.PhysicalActivityLevel = userVM.PhysicalActivityLevel;
                user.IdGoal = userVM.IdGoal;
                _context.Users.Update(user);
                try
                {
                    _context.SaveChanges();
                }
                catch (Exception ex)
                {
                    return BadRequest("Error while updating account's information. Error: " + ex.Message);
                }
            }
            return Ok(user);
        }

        [HttpPost("register")]
        public ActionResult<User> Register([FromBody] UserRegistrationDto user)
        {
            var duplicateUser = _context.Users.FirstOrDefault(u => u.Email == user.Email);
            if (duplicateUser != null)
            {
                return BadRequest("The email address you entered is already in use. Please try a different email address.");
            }

            var userToInsert = new User
            {
                Name = user.Name,
                Surname = user.Surname,
                Birthdate = user.Birthdate,
                Email = user.Email,
                Role = "",
                Active = true,
                Weight = user.Weight,
                Height = user.Height,
                Gender = user.Gender,
                PhysicalActivityLevel = user.PhysicalActivityLevel,
                IdGoal = user.IdGoal
            };

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);
            userToInsert.Password = passwordHash;
            _context.Add(userToInsert);

            try
            {
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest("There was an error while saving data. Please try again. Error: " + ex.Message);
            }

            return Ok(userToInsert);
        }

        [HttpPost("login")]
        public ActionResult Login([FromBody] LoginVM user)
        {
            var userToLogin = _context.Users.FirstOrDefault(u => u.Email == user.Email);
            if (userToLogin == null)
            {
                return BadRequest("User not found");
            }
            else
            {
                if (userToLogin.Active)
                {
                    if (!BCrypt.Net.BCrypt.Verify(user.Password, userToLogin.Password))
                    {
                        return Unauthorized("Oops! Incorrect login details. Please double-check and try again");
                    }
                    else
                    {
                        string token = CreateToken(userToLogin);
                        var loginInfo = new
                        {
                            token,
                            isAdmin = userToLogin.Role == "Admin"
                        };
                        return Ok(loginInfo);
                    }
                }
                else
                {
                    return Unauthorized("User is blocked");
                }
            }
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim> { 
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value!));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: cred
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        [HttpPost("Block/{id}")]
        [Authorize]
        public ActionResult<User> Block(int id)
        {
            var user = _context.Users.FirstOrDefault(u => u.IdUser == id);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            user.Active = !user.Active;
            try
            {
                _context.Users.Update(user);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest("Failed to block user. Reason:" + ex.Message);
            }

            return Ok(user);
        }

        [HttpDelete]
        [Authorize]
        public ActionResult Delete()
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = _context.Users.FirstOrDefault(u => u.Email == userEmail);
            if (user == null)
            {
                return NotFound();
            }
            else
            {
                _context.Remove(user);
                try
                {
                    _context.SaveChanges();
                    return Ok();
                }
                catch (Exception ex)
                {
                    return BadRequest("Error while deleting account: " + ex.Message);
                }
            }
        }

        [HttpGet("RemindPassword")]
        public ActionResult RemindPassword([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return NotFound("User was not found");
            }

            var user = _context.Users.FirstOrDefault(u => u.Email == email);
            if (user == null) 
            {
                return NotFound("User was not found");
            }

            byte[] encryptedArray = [];
            int numberToEncrypt = user.IdUser;
            byte[] bytesToEncrypt = BitConverter.GetBytes(numberToEncrypt);

            using Aes aesAlg = Aes.Create();
            aesAlg.Key = Generate32ByteKey("12345678910");
            aesAlg.IV = [0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF, 0xFE, 0xDC, 0xBA, 0x98, 0x76, 0x54, 0x32, 0x10];

            ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

            using MemoryStream msEncrypt = new();
            using (CryptoStream csEncrypt = new(msEncrypt, encryptor, CryptoStreamMode.Write))
            {
                csEncrypt.Write(bytesToEncrypt, 0, bytesToEncrypt.Length);
                csEncrypt.FlushFinalBlock();
            }

            encryptedArray = msEncrypt.ToArray();
            var url = "https://localhost:5173/ChangePassword/" + Convert.ToBase64String(encryptedArray);

            try
            {
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress("AisKai", _config.GetSection("Smtp:Username").Value));
                emailMessage.To.Add(new MailboxAddress("Everette Fahey", _config.GetSection("Smtp:Username").Value));
                emailMessage.Subject = "Password Reminder";
                emailMessage.Body = new TextPart("html")
                {
                    Text = "<h3>It appears that you may have forgotten your password for your account with us. " +
                    "No need to worry; we're here to assist you in regaining access to your account promptly and securely." +
                    "<br/><br/>To reset your password, please follow the password reminder link below:<br/></h3>" +
                    $"<a href='{url}'>" + url + "</a>"
                };

                using var client = new SmtpClient();
                client.Connect("smtp.ethereal.email", 587, SecureSocketOptions.StartTls);
                client.Authenticate(_config.GetSection("Smtp:Username").Value, _config.GetSection("Smtp:Password").Value);
                client.Send(emailMessage);
                client.Disconnect(true);

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("ChangePassword")]
        public ActionResult ChangePassword([FromBody] LoginVM user, [FromQuery] string encryptedId)
        {
            if (string.IsNullOrEmpty(user.Password) || string.IsNullOrEmpty(encryptedId))
            {
                return StatusCode(500, "Internal server error");
            }

            using Aes aesAlg = Aes.Create();
            aesAlg.Key = Generate32ByteKey("12345678910");
            aesAlg.IV = [0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF, 0xFE, 0xDC, 0xBA, 0x98, 0x76, 0x54, 0x32, 0x10];
            var encryptedArray = Convert.FromBase64String(encryptedId);

            ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

            using MemoryStream msDecrypt = new (encryptedArray);
            using CryptoStream csDecrypt = new (msDecrypt, decryptor, CryptoStreamMode.Read);
            byte[] decryptedBytes = new byte[encryptedArray.Length];

            int decryptedByteCount = csDecrypt.Read(decryptedBytes, 0, decryptedBytes.Length);

            int userID = BitConverter.ToInt32(decryptedBytes, 0);

            var userToUpdate = _context.Users.FirstOrDefault(u => u.IdUser == userID);
            if (userToUpdate == null)
            {
                return StatusCode(500, "User was not found");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);
            userToUpdate.Password = passwordHash;

            _context.Update(userToUpdate);

            try
            {
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error while updating user's password. Exception: {ex.Message}");
            }

            return Ok();
        }

        static byte[] Generate32ByteKey(string input)
        {
            return SHA256.HashData(Encoding.UTF8.GetBytes(input));
        }

        [HttpGet("GetGenderList")]
        public ActionResult<List<Gender>> GetGenderList()
        {
            return _context.Genders.ToList();
        }

        [HttpGet("GetPalList")]
        public ActionResult<List<PhysicalActivityLevel>> GetPalList()
        {
            return _context.PhysicalActivityLevels.ToList();
        }
    }
}
