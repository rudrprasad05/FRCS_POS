using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Response.DTO
{
    public class ScannerDTO
    {
        public string QuickConnectId { get; set; } = string.Empty;
        public string Barcode { get; set; } = string.Empty;
        public string Format { get; set; } = string.Empty;
    }

}