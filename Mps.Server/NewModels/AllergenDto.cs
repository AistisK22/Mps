namespace Mps.Server.NewModels
{
    public class AllergenDto
    {
        public int IdAllergen { get; set; }
        public required string Name { get; set; }
        public bool Selected { get; set; }
        public required string Description { get; set; }
    }
}
