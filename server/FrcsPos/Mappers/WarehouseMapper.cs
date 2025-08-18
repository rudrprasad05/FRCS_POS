using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public static class WarehouseMapper
    {
        public static WarehouseDTO FromModelToDto(this Warehouse request)
        {
            if (request == null)
            {
                return new WarehouseDTO();
            }

            var dto = new WarehouseDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                Name = request.Name,
                CompanyId = request.CompanyId,
                Location = request.Location,
            };

            return dto;
        }

        public static List<WarehouseDTO> FromModelToDto(this ICollection<Warehouse> request)
        {
            if (request == null || request.Count == 0)
            {
                return [];
            }

            var dtoList = new List<WarehouseDTO>();
            foreach (Warehouse w in request)
            {
                var dto = w.FromModelToDto();
                dtoList.Add(dto);
            }

            return dtoList;
        }
    }
}