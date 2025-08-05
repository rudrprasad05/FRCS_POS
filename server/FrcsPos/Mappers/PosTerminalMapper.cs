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
        public static PosTerminal FromNewPosTerminalToModel(this NewPosTerminalRequest request)
        {
            ArgumentNullException.ThrowIfNull(request);
            return new PosTerminal
            {
                Name = request.Name,
                CompanyId = request.CompanyId,
            };
        }

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
    }
}