using System.Collections.Generic;
using FrcsPos.Request;

namespace FrcsPos.Request
{
    public class StartRefundRequest
    {
        public string SaleId { get; set; } = null!;
        public List<RefundItemRequest> Items { get; set; } = new();
        public string? Reason { get; set; }
    }
}
