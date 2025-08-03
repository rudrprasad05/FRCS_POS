using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public class RefundItem : BaseModel
    {
        public int RefundRequestId { get; set; }
        public RefundRequest RefundRequest { get; set; } = default!;

        public int SaleItemId { get; set; }
        public SaleItem SaleItem { get; set; } = default!;

        public int Quantity { get; set; }
        public int? ApprovedQuantity { get; set; }
        public string? Note { get; set; }
    }
}