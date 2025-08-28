using System.Collections.Generic;
using System.Linq;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public static class WarehouseMapper
    {
        // Single entity → DTO
        public static WarehouseDTO FromModelToDto(this Warehouse warehouse)
        {
            if (warehouse == null) return null;

            return new WarehouseDTO
            {
                Id = warehouse.Id,
                CompanyId = warehouse.CompanyId,
                Name = warehouse.Name,
                Location = warehouse.Location
            };
        }

        // Collection → DTO List
        public static List<WarehouseDTO> FromModelToDto(this IEnumerable<Warehouse> warehouses)
        {
            return warehouses?.Select(w => w.FromModelToDto()).ToList()
                   ?? new List<WarehouseDTO>();
        }
    }
}
