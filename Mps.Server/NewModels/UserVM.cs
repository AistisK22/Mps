namespace Mps.Server.NewModels
{
    public class UserVM
    {
        public DateOnly BirthDate { get; set; }

        public decimal Weight { get; set; }

        public decimal Height { get; set; }

        public int Gender { get; set; }

        public int PhysicalActivityLevel { get; set; }

        public int IdGoal { get; set; }
    }
}
