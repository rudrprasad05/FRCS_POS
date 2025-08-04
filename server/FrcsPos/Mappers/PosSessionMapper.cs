using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Request;
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
                ConnectionTimeOut = session.ConnectionTimeOut,
                ConnectionUUID = session.ConnectionUUID,
                UUID = session.UUID,
                CreatedOn = session.CreatedOn,
                UpdatedOn = session.UpdatedOn,
                PosTerminalId = session.PosTerminalId,

            };

        }

        public static PosSession FromNewPosSessionRequestToModel(this NewPosSession session)
        {
            return new PosSession
            {
                PosUserId = session.PosUserId,
            };

        }

    }
}