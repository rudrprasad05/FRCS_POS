using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Request
{
    public class NewProductBatchRequest
    {
        public string CompanyName { get; set; } = string.Empty;
        public string ProductId { get; set; } = string.Empty;
        public string SupplierId { get; set; } = string.Empty;
        public string WarehouseId { get; set; } = string.Empty;
        public int Quantity { get; set; } = 1;
        public DateTime? ExpiryDate { get; set; }
        public DateTime ReceiveDate { get; set; } = DateTime.UtcNow;

    }

    public class EditProductBatchRequest
    {
        public string BatchId { get; set; } = string.Empty;
        public int Quantity { get; set; } = 1;
        public DateTime? ExpiryDate { get; set; }
        public DateTime ReceivedDate { get; set; } = DateTime.UtcNow;

    }
}
