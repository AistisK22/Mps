namespace Mps.Server.NewModels
{
    public class ProductVM
    {
        public required string Title { get; set; }
        public IFormFile? Image { get; set; }
        public decimal Quantity { get; set; }
        public List<int> Category { get; set; } = [];
        public required string Note { get; set; }
        public int Unit { get; set; }
        public DateTime ExpirationDate { get; set; }
        public decimal Calories { get; set; }
        public decimal Fat { get; set; }
        public decimal Protein { get; set; }
        public decimal Carbs { get; set; }
    }
}
