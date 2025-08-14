using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;
using Microsoft.AspNetCore.Identity;

namespace FrcsPos.Mappers
{
    public static class UserMapper
    {
        public static User FromNewUserDtoToModel(this NewUserDTO request)
        {
            ArgumentNullException.ThrowIfNull(request);
            return new User
            {
                UserName = request.Username,
                Email = request.Email,
                PasswordHash = request.Password ?? string.Empty
            };
        }

        public static async Task<UserDTO> FromUserToDtoAsync(this User request, UserManager<User> userManager)
        {
            if (request == null)
            {
                return new UserDTO
                {
                    Id = "id",
                    Username = "null",
                    Email = "null",
                    Token = "null",
                    Role = "null"
                };
            }

            // Get roles from UserManager
            var roles = await userManager.GetRolesAsync(request);

            return new UserDTO
            {
                Id = request.Id,
                Username = request.UserName ?? string.Empty,
                Email = request.Email ?? string.Empty,
                Token = request.PasswordHash ?? string.Empty, // or leave blank if not needed
                Role = string.Join(", ", roles) // assuming you want a single string; else use List<string> in DTO
            };
        }

        public static UserDTO FromUserToDto(this User request)
        {
            if (request == null)
            {
                return new UserDTO
                {
                    Id = "id",
                    Username = "null",
                    Email = "null",
                    Token = "null",
                    Role = "null"
                };
            }

            // Get roles from UserManager

            return new UserDTO
            {
                Id = request.Id,
                Username = request.UserName ?? string.Empty,
                Email = request.Email ?? string.Empty,
                Token = request.PasswordHash ?? string.Empty, // or leave blank if not needed
            };
        }
    }

}
