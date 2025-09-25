using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Response.DTO
{
    public class ExpiryNotificationConfigurationDTO : BaseDTO
    {
        public int FirstWarningInDays { get; set; }
        public int CriticalWarningInHours { get; set; }

    }
}