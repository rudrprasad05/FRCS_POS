using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public static class ProductBatchMapper
    {
        public static ProductBatchDTO FromModelToDto(this ProductBatch request, bool setWarehouse = true)
        {
            if (request == null)
            {
                return new ProductBatchDTO();
            }

            var dto = new ProductBatchDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                CompanyId = request.CompanyId,
                ProductId = request.ProductId,
            };

            if (request.Company != null)
            {
                dto.Company = request.Company;

            }
            if (request.Product != null)
            {
                dto.Product = request.Product;

            }
            if (request.Warehouse != null && setWarehouse)
            {
                dto.Warehouse = request.Warehouse;

            }

            return dto;
        }

        public static List<ProductBatchDTO> FromModelToDto(this ICollection<ProductBatch> request, bool setWarehouse = true)
        {
            if (request == null || request.Count == 0)
            {
                return [];
            }

            var dtoList = new List<ProductBatchDTO>();
            foreach (ProductBatch w in request)
            {
                var dto = w.FromModelToDto(setWarehouse);
                dtoList.Add(dto);
            }

            return dtoList;
        }
    }
}