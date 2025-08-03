using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public static class PosSessionMapper
    {
        public static List<PosSessionDTO> FromPosSessionListToPosSessionDTOList(this ICollection<PosSession> sessions)
        {
            var result = new List<PosSessionDTO>();
            foreach (var session in sessions)
            {
                result.Add(session.FromModelToDTO());
            }

            return result;

        }

        public static PosSessionDTO FromModelToDTO(this PosSession session)
        {
            return new PosSessionDTO
            {
                Id = session.Id,
                UUID = session.UUID,
                CreatedOn = session.CreatedOn,
                UpdatedOn = session.UpdatedOn,
                PosTerminalId = session.PosTerminalId,

            };

        }

    }
}