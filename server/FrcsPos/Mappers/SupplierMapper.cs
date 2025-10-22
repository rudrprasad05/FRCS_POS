using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public static class SupplierMapper
    {
        public static SupplierDTO FromModelToDto(this Supplier request)
        {
            if (request == null)
            {
                return new SupplierDTO();
            }

            var dto = new SupplierDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                Name = request.Name,
                IsDeleted = request.IsDeleted,
                Code = request.Code,
                ContactName = request.ContactName,
                Phone = request.Phone,
                Email = request.Email,
                Address = request.Address,
                TaxNumber = request.TaxNumber
            };

            return dto;
        }

        public static SupplierDTO FromModelToOnlyDto(this Supplier request)
        {
            if (request == null)
            {
                return new SupplierDTO();
            }

            var dto = new SupplierDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                Name = request.Name,
                IsDeleted = request.IsDeleted,
                Code = request.Code,
                ContactName = request.ContactName,
                Phone = request.Phone,
                Email = request.Email,
                Address = request.Address,
                TaxNumber = request.TaxNumber,

            };

            return dto;
        }

        public static Supplier FromDTOToModel(this SupplierDTO request)
        {
            if (request == null)
            {
                return new Supplier();
            }

            var dto = new Supplier
            {
                Name = request.Name,
                Code = request.Code,
                ContactName = request.ContactName,
                Phone = request.Phone,
                Email = request.Email,
                Address = request.Address,
                TaxNumber = request.TaxNumber,
            };

            return dto;
        }

        public static SupplierDTO FromReqToDTO(this NewSupplierRequest request)
        {
            if (request == null)
            {
                return new SupplierDTO();
            }

            var dto = new SupplierDTO
            {
                Name = request.Name,
                Code = request.Code,
                ContactName = request.ContactName,
                Phone = request.Phone,
                Email = request.Email,
                Address = request.Address,
                TaxNumber = request.TaxNumber,
            };

            return dto;
        }

        public static List<SupplierDTO> FromModelToDto(this ICollection<Supplier> request)
        {
            if (request == null || request.Count == 0)
            {
                return [];
            }

            var dtoList = new List<SupplierDTO>();
            foreach (Supplier w in request)
            {
                var dto = w.FromModelToDto();
                dtoList.Add(dto);
            }

            return dtoList;
        }
    }
}