using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public static class ProductMapper
    {
        public static ProductDTO FromModelToDto(this Product request)
        {
            if (request == null)
            {
                return new ProductDTO();
            }

            var dto = new ProductDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                Name = request.Name,
                CompanyId = request.CompanyId,
                Sku = request.Sku,
                Barcode = request.Barcode,
                Price = request.Price,
                MediaId = request.MediaId ?? 0,
                Media = request.Media?.FromModelToDTO(),
                TaxCategory = request.TaxCategory.FromModelToDto(),
                TaxCategoryId = request.TaxCategoryId,
                IsPerishable = request.IsPerishable,
            };

            return dto;
        }

        public static ProductDTO FromModelToOnlyDto(this Product request)
        {
            if (request == null)
            {
                return new ProductDTO();
            }

            var dto = new ProductDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                Name = request.Name,
                CompanyId = request.CompanyId,
                Sku = request.Sku,
                Barcode = request.Barcode,
                Price = request.Price,
                MediaId = request.MediaId ?? 0,
                TaxCategoryId = request.TaxCategoryId,
                IsPerishable = request.IsPerishable,
            };

            return dto;
        }

        public static List<ProductDTO> FromModelToDto(this ICollection<Product> request)
        {
            if (request == null || request.Count == 0)
            {
                return [];
            }

            var dtoList = new List<ProductDTO>();
            foreach (Product w in request)
            {
                var dto = w.FromModelToDto();
                dtoList.Add(dto);
            }

            return dtoList;
        }
    }
}