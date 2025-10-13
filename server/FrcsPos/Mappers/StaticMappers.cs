using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public static class StaticMappers
    {
        public static ProductDTO FromModelToDtoStatic(this Product request)
        {
            if (request == null)
                return new ProductDTO();

            return new ProductDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                IsDeleted = request.IsDeleted,
                Name = request.Name,
                CompanyId = request.CompanyId,
                Sku = request.Sku,
                TaxCategoryId = request.TaxCategoryId,
                IsPerishable = request.IsPerishable
            };
        }

        public static List<ProductDTO> FromModelToDtoStatic(this ICollection<Product> request)
        {
            if (request == null || request.Count == 0)
                return [];

            var dtoList = new List<ProductDTO>();
            foreach (var product in request)
            {
                dtoList.Add(product.FromModelToDtoStatic());
            }

            return dtoList;
        }


        public static ProductVariantDTO FromModelToDtoStatic(this ProductVariant request)
        {
            if (request == null)
                return new ProductVariantDTO();

            return new ProductVariantDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                IsDeleted = request.IsDeleted,
                Name = request.Name,
                Sku = request.Sku,
                Barcode = request.Barcode,
                Price = request.Price,
                FirstWarningInDays = request.FirstWarningInDays,
                CriticalWarningInHours = request.CriticalWarningInHours,
            };
        }

        public static List<ProductVariantDTO> FromModelToDtoStatic(this ICollection<ProductVariant> request)
        {
            if (request == null || request.Count == 0)
                return [];

            var dtoList = new List<ProductVariantDTO>();
            foreach (var product in request)
            {
                dtoList.Add(product.FromModelToDtoStatic());
            }

            return dtoList;
        }
    }
}