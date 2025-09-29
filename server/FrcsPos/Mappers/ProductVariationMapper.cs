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
                Name = request.Name,
                Sku = request.Sku,
                Barcode = request.Barcode,
                Price = request.Price,
                FirstWarningInDays = request.FirstWarningInDays,
                CriticalWarningInHours = request.CriticalWarningInHours,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                IsDeleted = request.IsDeleted,
            };

            if (request.Media != null)
            {
                dto.Media = request.Media.FromModelToDTO();
            }

            return dto;
        }

        public static List<ProductVariantDTO> FromModelToDto(this ICollection<ProductVariant> request)
        {
            if (request == null || request.Count == 0)
            {
                return [];
            }

            var dtoList = new List<ProductVariantDTO>();
            foreach (ProductVariant w in request)
            {
                var dto = w.FromModelToDto();
                dtoList.Add(dto);
            }

            return dtoList;
        }

        public static List<ProductVariantDTO> FromModelToDto(this IEnumerable<ProductVariant> request)
        {
            return request.Select(v => v.FromModelToDto()).ToList();
        }
    }
}