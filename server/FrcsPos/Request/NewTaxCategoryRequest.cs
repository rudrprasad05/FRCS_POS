namespace FrcsPos.Request
{
    public class NewTaxRequest
    {
        public string Name { get; set; } = string.Empty;
        public decimal Percentage { get; set; }
    }
}
