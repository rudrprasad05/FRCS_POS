using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public static class NotificationMapper
    {
        public static NotificationDTO FromModelToDto(this Notification request)
        {
            if (request == null)
            {
                return new NotificationDTO();
            }

            var dto = new NotificationDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                Title = request.Title,
                Message = request.Message,
                IsRead = request.IsRead,
                Type = request.Type,
                IsSuperAdmin = request.IsSuperAdmin,
                ActionUrl = request.ActionUrl,

            };

            return dto;
        }
    }
}