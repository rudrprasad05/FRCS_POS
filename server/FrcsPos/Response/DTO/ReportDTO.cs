namespace FrcsPos.Response.DTO
{
    public class SalesSummaryDTO
    {
        public DateTime Date { get; set; }
        public decimal TotalSales { get; set; }
        public int TotalItemsSold { get; set; }
    }

    public class MonthlySalesDTO
    {
        public int Month { get; set; }
        public decimal TotalSales { get; set; }
    }

    public class AnnualSalesDTO
    {
        public int Year { get; set; }
        public decimal TotalSales { get; set; }
        public List<MonthlySalesDTO> MonthlySales { get; set; } = new();
    }

    public class TopProductDTO
    {
        public int ProductVariantId { get; set; }
        public string ProductName { get; set; } = default!;
        public int QuantitySold { get; set; }
        public decimal TotalRevenue { get; set; }
    }

    public class StockLevelDTO
    {
        public int ProductVariantId { get; set; }
        public string ProductName { get; set; } = default!;
        public string WarehouseName { get; set; } = default!;
        public int TotalStock { get; set; }
    }
}
