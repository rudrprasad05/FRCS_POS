using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public static class PosTerminalMapper
    {
        public static PosTerminalDTO FromModelToJustModelDTO(this PosTerminal request)
        {
            ArgumentNullException.ThrowIfNull(request);
            return new PosTerminalDTO
            {
                Name = request.Name,
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                IsActive = request.IsActive,
                LocationDescription = request.LocationDescription ?? string.Empty,
                SerialNumber = request.SerialNumber ?? string.Empty
            };
        }

        public static PosTerminalDTO FromModelToDto(this PosTerminal request)
        {
            ArgumentNullException.ThrowIfNull(request);
            var dto = new PosTerminalDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                IsActive = request.IsActive,
                Name = request.Name,
                LocationDescription = request.LocationDescription ?? string.Empty,
                SerialNumber = request.SerialNumber ?? string.Empty,
            };

            if (request.Sales != null)
            {
                dto.Sales = request.Sales.FromModelToDtoStatic();
            }
            if (request.Company != null)
            {
                dto.Company = request.Company.FromModelToDTOWithoutPosTerminals();
            }
            if (request.Session != null)
            {
                dto.Session = request.Session.FromPosSessionListToPosSessionDTOList();
                dto.LastUsedBy = request.Session.OrderByDescending(s => s.CreatedOn)?.FirstOrDefault()?.PosUser.FromUserToDtoStatic();

                dto.TotalSales = request.Session
                    .SelectMany(s => s.Sales)
                    .Sum(x => x.Total);
            }

            return dto;
        }
        public static PosTerminalDTO FromModelToDtoWithoutCompany(this PosTerminal request)
        {
            ArgumentNullException.ThrowIfNull(request);
            return new PosTerminalDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                Name = request.Name,
                LocationDescription = request.LocationDescription ?? string.Empty,
                SerialNumber = request.SerialNumber ?? string.Empty,
                IsActive = request.IsActive,
                IsDeleted = request.IsDeleted,
            };
        }

        public static List<PosTerminalDTO> FromModelToDtoWithoutCompany(this ICollection<PosTerminal> request)
        {
            if (request == null || request.Count == 0)
            {
                return [];
            }
            List<PosTerminalDTO> ptdList = [];
            foreach (PosTerminal pt in request)
            {
                PosTerminalDTO ptd = pt.FromModelToDtoWithoutCompany();
                ptdList.Add(ptd);
            }

            return ptdList;
        }
    }
}