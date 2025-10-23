using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.DTO;

namespace FrcsPos.Response.DTO
{
    public class LoginDTO
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string Id { get; set; } = string.Empty;
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Token { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public MediaDto? ProfilePicture { get; set; } = null;
        public string? ProfilePictureLink { get; set; } = null;
    }
}