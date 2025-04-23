namespace Mps.Server.NewModels
{
    public partial class UserProductDto
    {
        public int IdUserProduct { get; set; }

        public DateOnly ExpirationDate { get; set; }

        public string Note { get; set; } = "";

        public decimal Quantity { get; set; }

        public int MeasurementUnit { get; set; }

        public int IdProduct { get; set; }
        public virtual Product IdProductNavigation { get; set; } = null!;
        public List<int> Categories { get; set; } = [];
    }
}
