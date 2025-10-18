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

        public static SaleDTO FromModelToDtoStatic(this Sale request)
        {
            if (request == null)
            {
                return new SaleDTO();
            }

            var dto = new SaleDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                CashierId = request.CashierId,
                CompanyId = request.CompanyId,
                PosSessionId = request.PosSessionId,
                InvoiceNumber = request.InvoiceNumber,
                Subtotal = request.Subtotal,
                TaxTotal = request.TaxTotal,
                Total = request.Total,
                Status = request.Status,
            };

            if (request.Cashier != null)
            {
                dto.Cashier = request.Cashier.FromUserToDto();
            }

            if (request.Company != null)
            {
                dto.Company = request.Company.FromModelToDto();
            }

            if (request.PosSession != null)
            {
                dto.PosSession = request.PosSession.FromModelToDTO(includeSale: false);
            }

            return dto;
        }

        public static List<SaleDTO> FromModelToDtoStatic(this ICollection<Sale> request)
        {
            if (request == null || request.Count == 0)
            {
                return new List<SaleDTO>();
            }

            var dtoList = new List<SaleDTO>();
            foreach (var sale in request)
            {
                var dto = sale.FromModelToDtoStatic();
                dtoList.Add(dto);
            }

            return dtoList;
        }
    }
}