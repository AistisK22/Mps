namespace Mps.Server.NewModels
{
    public partial class CategoryDto
    {
        public int IdCategory { get; set; }
        public required string Title { get; set; }
        public bool Selected { get; set; }
    }
}
