using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public static class QuickConnectMapper
    {
         public static QuickConnectDTO FromModelToDto(this QuickConnect request)
        {
            var result = new QuickConnectDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn
            };

            // if (request.PosSession != null)
            // {
            //     result.PosSession = request.PosSession.FromModelToDTO();
            // }

            return result;
        }
    }
}