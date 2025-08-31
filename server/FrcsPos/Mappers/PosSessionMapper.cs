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

        public static PosSessionDTO FromModelToDTO(this PosSession session, bool includeSale = true)
        {
            var result = new PosSessionDTO();

            result.Id = session.Id;
            result.ConnectionTimeOut = session.ConnectionTimeOut;
            result.ConnectionUUID = session.ConnectionUUID;
            result.UUID = session.UUID;
            result.CreatedOn = session.CreatedOn;
            result.UpdatedOn = session.UpdatedOn;
            result.PosUser = session.PosUser.FromUserToDto();
            result.PosUserId = session.PosUserId;
            result.IsActive = session.IsActive;

            if (session.PosTerminal != null)
            {
                result.PosTerminal = session.PosTerminal.FromModelToJustModelDTO();
            }

            if (includeSale && session.Sales != null)
            {
                result.Sales = session.Sales.FromModelToDto();
            }

            return result;
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