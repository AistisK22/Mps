namespace Mps.Server.NewModels
{
    public class UserRegistrationDto
    {
        public int IdUser { get; set; }

        public string Name { get; set; } = null!;

        public string Surname { get; set; } = null!;

        public string Password { get; set; } = null!;

        public DateOnly Birthdate { get; set; }

        public string Email { get; set; } = null!;

        public string Role { get; set; } = null!;

        public bool Active { get; set; }

        public decimal Weight { get; set; }

        public decimal Height { get; set; }

        public int Gender { get; set; }

        public int PhysicalActivityLevel { get; set; }

        public int IdGoal { get; set; }
    }
}
