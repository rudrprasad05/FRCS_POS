using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public static class ProductVariatMapper
    {
        public static ProductVariantDTO FromModelToDto(this ProductVariant request)
        {
            if (request == null)
            {
                return new ProductVariantDTO();
            }

            var dto = new ProductVariantDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                IsDeleted = request.IsDeleted,
            };

            return dto;
        }

        public static List<ProductBatchDTO> FromModelToDto(this ICollection<ProductBatch> request)
        {
            if (request == null || request.Count == 0)
            {
                return [];
            }

            var dtoList = new List<ProductBatchDTO>();
            foreach (ProductBatch w in request)
            {
                var dto = w.FromModelToDto();
                dtoList.Add(dto);
            }

            return dtoList;
        }
    }
}