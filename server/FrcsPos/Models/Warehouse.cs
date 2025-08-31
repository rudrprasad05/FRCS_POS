namespace FrcsPos.Models
{
    public class Warehouse : BaseModel
    {
        public int CompanyId { get; set; }
        public Company Company { get; set; } = default!;

        public string Name { get; set; } = default!;
        public string Location { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public ICollection<ProductBatch> ProductBatches { get; set; } = new List<ProductBatch>();
    }
}
