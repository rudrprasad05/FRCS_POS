using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public enum RefundStatus
    {
        Pending = 1,
        Approved = 2,
        Rejected = 3
    }

    public class RefundRequest : BaseModel
    {
        public int CompanyId { get; set; }
        public Company Company { get; set; } = default!;

        public int SaleId { get; set; }
        public Sale Sale { get; set; } = default!;

        public int RequestedByUserId { get; set; }
        public User RequestedBy { get; set; } = default!;

        public RefundStatus Status { get; set; } = RefundStatus.Pending;
        public string? Reason { get; set; }

        public string? ApprovedByUserId { get; set; }
        public User? ApprovedBy { get; set; }

        public ICollection<RefundItem> Items { get; set; } = new List<RefundItem>();
    }
}