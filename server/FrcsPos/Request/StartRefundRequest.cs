using System.Collections.Generic;
using FrcsPos.Request;

namespace FrcsPos.Request
{
    public class StartRefundRequest
    {
        public int SaleId { get; set; }
        public List<RefundItemRequest> Items { get; set; } = new();
        public string? Reason { get; set; }
    }
}
