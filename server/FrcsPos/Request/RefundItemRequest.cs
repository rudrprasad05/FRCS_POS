namespace FrcsPos.Request
{
    public class RefundItemRequest
    {
        // IMPORTANT: RefundItem model uses SaleItemId as FK, so we accept SaleItemId here
        public int SaleItemId { get; set; }
        public int Quantity { get; set; }
        public string? Note { get; set; }
    }
}
