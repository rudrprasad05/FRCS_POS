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
            };
        }

        public static PosTerminalDTO FromModelToDto(this PosTerminal request)
        {
            ArgumentNullException.ThrowIfNull(request);
            return new PosTerminalDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                Name = request.Name,
                Sales = request.Sales.FromModelToDto(),
                Company = request.Company.FromModelToDTOWithoutPosTerminals(),
                Session = request.Session.FromPosSessionListToPosSessionDTOList(),
            };
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