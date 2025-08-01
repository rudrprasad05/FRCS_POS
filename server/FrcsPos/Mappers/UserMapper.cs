using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

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
        
    }
}