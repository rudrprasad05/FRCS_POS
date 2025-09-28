using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FrcsPos.Models
{
    public enum RefundStatus
    {
        PENDING,
        APPROVED,
        REJECTED
    }

    public class RefundRequest : BaseModel
    {
        [Required]
        public int CompanyId { get; set; }
        public Company Company { get; set; } = default!;

        [Required]
        public int SaleId { get; set; }
        public Sale Sale { get; set; } = default!;

        [Required]
        public string RequestedByUserId { get; set; } = null!;
        public User RequestedBy { get; set; } = default!;

        public RefundStatus Status { get; set; } = RefundStatus.PENDING;

        [StringLength(500)]
        public string? Reason { get; set; }

        public string? ApprovedByUserId { get; set; }
        public User? ApprovedBy { get; set; }

        public ICollection<RefundItem> Items { get; set; } = new List<RefundItem>();
    }
}
