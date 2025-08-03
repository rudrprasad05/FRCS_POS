using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        public int CompanyId { get; set; }
        public Company Company { get; set; } = default!;

        public int SaleId { get; set; }
        public Sale Sale { get; set; } = default!;

        public string RequestedByUserId { get; set; } = null!;
        public User RequestedBy { get; set; } = default!;

        public RefundStatus Status { get; set; } = RefundStatus.PENDING;
        public string? Reason { get; set; }

        public string? ApprovedByUserId { get; set; }
        public User? ApprovedBy { get; set; }

        public ICollection<RefundItem> Items { get; set; } = new List<RefundItem>();
    }
}