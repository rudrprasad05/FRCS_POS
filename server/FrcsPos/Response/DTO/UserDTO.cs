using System;
using System.ComponentModel.DataAnnotations;

namespace FrcsPos.Response.DTO
{
    public class UserDTO
    {
        [Required] public string Id { get; set; } = string.Empty;
        [Required] public string Username { get; set; } = string.Empty;
        [Required] public string Email { get; set; } = string.Empty;
        [Required] public string Token { get; set; } = string.Empty;
        [Required] public string Role { get; set; } = string.Empty;

    }

    public class NewUserDTO
    {
        [Required] public string Username { get; set; } = string.Empty;
        [Required] public string Email { get; set; } = string.Empty;
        [Required] public string Password { get; set; } = string.Empty;
        public string? Role { get; set; } = null;

    }
}