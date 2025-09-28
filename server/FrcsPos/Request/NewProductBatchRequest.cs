using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Request
{
    public class NewProductBatchRequest
    {
        public int CompanyId { get; set; }
        public int ProductId { get; set; }
        public string WarehouseId { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }
}