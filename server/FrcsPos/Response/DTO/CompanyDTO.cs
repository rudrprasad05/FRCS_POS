using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Response.DTO
{
    public class CompanyDTO : BaseDTO
    {
        public CompanyDTO()
        {
            Name = "default name";
            AdminUser = default!;
        }
        public string Name { get; set; } = default!;
        public UserDTO AdminUser { get; set; } = default!;
        public List<PosTerminalDTO> PosTerminals { get; set; } = default!;
        public List<CompanyUserDTO> Users { get; set; } = [];
        public List<WarehouseDTO> Warehouses { get; set; } = [];
        public List<ProductDTO> Products { get; set; } = [];

    }
}