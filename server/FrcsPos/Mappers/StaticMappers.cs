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

            var dto = new ProductDTO
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

            if (request.TaxCategory != null)
            {
                dto.TaxCategory = request.TaxCategory.FromModelToDto();
            }

            return dto;
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

            var dto = new ProductVariantDTO
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

            if (request.Product != null)
            {
                dto.IsPerishable = request.Product.IsPerishable;
                dto.Product = request.Product.FromModelToDtoStatic();
            }

            return dto;
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
                dto.Cashier = request.Cashier.FromUserToDtoStatic();
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

        public static UserDTO FromUserToDtoStatic(this User request)
        {
            if (request == null)
            {
                return new UserDTO
                {
                    Id = "id",
                    Username = "N/A",
                    Email = "N/A",
                    Token = "N/A",
                    Role = "N/A"
                };
            }

            // Get roles from UserManager

            return new UserDTO
            {
                Id = request.Id,
                Username = request.UserName ?? string.Empty,
                Email = request.Email ?? string.Empty,
                Token = string.Empty,
                UpdatedOn = request.UpdatedOn,
                CreatedOn = request.CreatedOn,
            };
        }

        public static CompanyUserDTO FromModelToDto(this CompanyUser request)
        {
            if (request == null)
            {
                return new CompanyUserDTO();
            }

            var dto = new CompanyUserDTO
            {
                CompanyId = request.CompanyId,
                UserId = request.UserId,
                User = request.User.FromUserToDtoStatic(),
            };

            return dto;
        }

        public static List<CompanyUserDTO> FromCompanyUserToDTO(this ICollection<CompanyUser> request)
        {
            if (request == null || request.Count == 0)
            {
                return [];
            }

            var dtoList = new List<CompanyUserDTO>();
            foreach (CompanyUser w in request)
            {
                var dto = w.FromModelToDto();
                dtoList.Add(dto);
            }

            return dtoList;
        }

        public static User FromNewUserDtoToModel(this NewUserDTO request)
        {
            ArgumentNullException.ThrowIfNull(request);
            return new User
            {
                UserName = request.Username,
                Email = request.Email,
                PasswordHash = request.Password ?? string.Empty
            };
        }

        public static NotificationDTO FromModelToDtoStatic(Notification model)
        {
            if (model == null)
                return new NotificationDTO();

            var dto = new NotificationDTO
            {
                UUID = model.UUID,
                Id = model.Id,
                CreatedOn = model.CreatedOn,
                UpdatedOn = model.UpdatedOn,
                Title = model.Title,
                Message = model.Message,
                IsRead = model.IsRead,
                Type = model.Type,
                IsSuperAdmin = model.IsSuperAdmin,
                ActionUrl = model.ActionUrl,
                UserId = model.UserId,
                CompanyId = model.CompanyId
            };

            if (model.User != null)
            {
                dto.User = model.User.FromUserToDtoStatic();
            }

            return dto;
        }


    }
}