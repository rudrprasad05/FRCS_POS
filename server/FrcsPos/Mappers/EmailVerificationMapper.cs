using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;
using Microsoft.AspNetCore.Identity;

namespace FrcsPos.Mappers
{
    public static class EmailVerificationMapper
    {
        public static EmailVerificationDTO ToDtoAsync(this EmailVerification request)
        {
            if (request == null)
            {
                return new EmailVerificationDTO();
            }

            return new EmailVerificationDTO
            {
                Id = request.Id,
                Code = request.Code,
                IsVerified = request.IsVerified,
                UseBy = request.UseBy, // or leave blank if not needed
            };
        }

    }

}
