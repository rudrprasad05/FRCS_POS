// FrcsPos.Mappers/NotificationMapper.cs
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public interface INotificationMapper
    {
        Task<NotificationDTO> FromModelToDto(Notification model);
        Notification FromDtoToModel(NotificationDTO dto);
    }
    public class NotificationMapper : INotificationMapper
    {
        private readonly IUserMapper _userMapper;

        public NotificationMapper(
            IUserMapper userMapper
        )
        {
            _userMapper = userMapper;
        }

        public async Task<NotificationDTO> FromModelToDto(Notification model)
        {
            if (model == null)
                return new NotificationDTO();

            var dto = new NotificationDTO
            {
                UUID = model.UUID,
                Id = model.Id,
                CreatedOn = model.CreatedOn,
                UpdatedOn = model.UpdatedOn,
                Title = model.Title,
                Message = model.Message,
                IsRead = model.IsRead,
                Type = model.Type,
                IsSuperAdmin = model.IsSuperAdmin,
                ActionUrl = model.ActionUrl,
                Company = model.Company?.FromModelToDto(),
                UserId = model.UserId,
                CompanyId = model.CompanyId
            };

            if (model.User != null)
            {
                dto.User = await _userMapper.FromModelToDtoAsync(model.User);
            }

            return dto;
        }

        public Notification FromDtoToModel(NotificationDTO dto)
        {
            if (dto == null)
                return new Notification();

            return new Notification
            {
                UUID = dto.UUID,
                Id = dto.Id,
                CreatedOn = dto.CreatedOn,
                UpdatedOn = dto.UpdatedOn,
                Title = dto.Title,
                Message = dto.Message,
                IsRead = dto.IsRead,
                Type = dto.Type,
                IsSuperAdmin = dto.IsSuperAdmin,
                ActionUrl = dto.ActionUrl,
                UserId = dto.UserId,
                CompanyId = dto.CompanyId
            };
        }
    }
}