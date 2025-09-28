using System;
using System.ComponentModel.DataAnnotations;

namespace FrcsPos.Models
{
    public class RefundItem : BaseModel
    {
        [Required]
        public int RefundRequestId { get; set; }
        public RefundRequest RefundRequest { get; set; } = default!;

        [Required]
        public int SaleItemId { get; set; }
        public SaleItem SaleItem { get; set; } = default!;

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Range(0, int.MaxValue)]
        public int? ApprovedQuantity { get; set; }

        [StringLength(300)]
        public string? Note { get; set; }
    }
}
