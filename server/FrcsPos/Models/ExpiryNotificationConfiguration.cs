using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public class ExpiryNotificationConfiguration : BaseModel
    {
        public int FirstWarningInDays { get; set; }
        public int CriticalWarningInHours { get; set; }

        public Product Product { get; set; } = null!;
        public int ProductId { get; set; } = default;

    }
}