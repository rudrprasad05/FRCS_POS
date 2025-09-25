using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public static class ExpiryNotificationConfigurationMapper
    {
        public static ExpiryNotificationConfigurationDTO FromModelToDto(this ExpiryNotificationConfiguration request)
        {
            if (request == null)
            {
                return new ExpiryNotificationConfigurationDTO();
            }

            var dto = new ExpiryNotificationConfigurationDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                FirstWarningInDays = request.FirstWarningInDays,
                CriticalWarningInHours = request.CriticalWarningInHours,
            };

            return dto;
        }

    }
}