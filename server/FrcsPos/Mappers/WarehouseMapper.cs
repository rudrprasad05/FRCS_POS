using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Request;
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
                IsActive = request.IsActive,
                IsDeleted = request.IsDeleted
            };

            if (request.ProductBatches != null)
            {
                dto.ProductBatches = request.ProductBatches.FromModelToDto(false);
            }

            return dto;
        }

        public static WarehouseDTO FromModelToOnlyDto(this Warehouse request)
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
                IsActive = request.IsActive,
                IsDeleted = request.IsDeleted

            };

            return dto;
        }

        public static Warehouse FromDTOToModel(this WarehouseDTO request)
        {
            if (request == null)
            {
                return new Warehouse();
            }

            var dto = new Warehouse
            {
                Name = request.Name,
                CompanyId = request.CompanyId,
                Location = request.Location ?? "",
            };

            return dto;
        }

        public static WarehouseDTO FromReqToDTO(this NewWarehouseRequest request)
        {
            if (request == null)
            {
                return new WarehouseDTO();
            }

            var dto = new WarehouseDTO
            {
                Name = request.Name,
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