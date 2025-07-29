using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(User user, IList<string> roles); 
        public string? GetUserIdFromToken(HttpContext httpContext);
    }
}