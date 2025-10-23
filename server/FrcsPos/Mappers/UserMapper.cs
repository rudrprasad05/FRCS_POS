using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;
using Microsoft.AspNetCore.Identity;

namespace FrcsPos.Mappers
{
    public interface IUserMapper
    {
        Task<UserDTO> FromModelToDtoAsync(User request);
        Task<List<UserDTO>> FromModelToDtoAsync(ICollection<User> request);
    }
    public class UserMapper : IUserMapper
    {
        private readonly IProductVariantMapper _variantMapper;
        private readonly IMediaMapper _mediaMapper;
        private readonly UserManager<User> _userManager;


        public UserMapper(UserManager<User> userManager, IProductVariantMapper variantMapper, IMediaMapper mediaMapper)
        {
            _userManager = userManager;
            _variantMapper = variantMapper;
            _mediaMapper = mediaMapper;

        }
        public async Task<UserDTO> FromModelToDtoAsync(User request)
        {
            if (request == null)
                return new UserDTO();

            var dto = new UserDTO
            {
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                Username = request.UserName ?? "",
                IsDeleted = request.IsDeleted,

            };

            // Map Variants (with signed media URLs)
            if (request.ProfilePicture != null)
            {
                var mDto = await _mediaMapper.ToDtoAsync(request.ProfilePicture);
                dto.ProfilePicture = mDto;
                dto.ProfilePictureLink = mDto.Url;
            }

            var roles = await _userManager.GetRolesAsync(request);

            dto.Role = string.Join(", ", roles);

            return dto;
        }

        public Task<List<UserDTO>> FromModelToDtoAsync(ICollection<User> request)
        {
            throw new NotImplementedException();
        }

    }

}
