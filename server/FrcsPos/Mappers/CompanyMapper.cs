using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public static class CompanyMapper
    {
        public static Company FromNewCompanyRequestToModel(this NewCompanyRequest request)
        {
            ArgumentNullException.ThrowIfNull(request);
            return new Company
            {
                Name = request.Name,
                AdminUserId = request.AdminUserId,
            };
        }

        public static CompanyDTO FromModelToDto(this Company request)
        {
            if (request == null)
            {
                return new CompanyDTO();
            }

            var dto = new CompanyDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                Name = request.Name,
                AdminUser = request.AdminUser.FromUserToDto(),
                AdminUserId = request.AdminUserId,
                PosTerminals = request.PosTerminals.FromModelToDtoWithoutCompany(),
                Warehouses = request.Warehouses.FromModelToDto(),
                Users = request.Users.FromCompanyUserToDTO(),
                Products = request.Products.FromModelToDtoStatic(),
            };

            return dto;
        }

        public static CompanyDTO FromModelToOnlyDto(this Company request)
        {
            if (request == null)
            {
                return new CompanyDTO();
            }

            var dto = new CompanyDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                Name = request.Name,
            };

            return dto;
        }

        public static CompanyDTO FromModelToDTOWithoutPosTerminals(this Company request)
        {
            if (request == null)
            {
                return new CompanyDTO();
            }
            var dto = new CompanyDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                Name = request.Name,
                AdminUser = request.AdminUser.FromUserToDto(),
            };

            return dto;
        }
    }
}