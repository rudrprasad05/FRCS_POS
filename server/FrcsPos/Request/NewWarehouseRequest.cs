using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Request
{
    public class NewWarehouseRequest
    {
        public string Name { get; set; } = null!;
        public string Location { get; set; } = null!;
        public string CompanyName { get; set; } = null!;
    }

    public class EditWarehouseData
    {
        public string Name { get; set; } = null!;
        public string Location { get; set; } = null!;
    }
}