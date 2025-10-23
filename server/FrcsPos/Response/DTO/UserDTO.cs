using System;
using System.ComponentModel.DataAnnotations;
using FrcsPos.DTO;
using FrcsPos.Models;

namespace FrcsPos.Response.DTO
{
    public class UserDTO
    {
        [Required] public string Id { get; set; } = string.Empty;
        [Required] public string Username { get; set; } = string.Empty;
        [Required] public string Email { get; set; } = string.Empty;
        [Required] public string Token { get; set; } = string.Empty;
        [Required] public string Role { get; set; } = string.Empty;
        [Required] public DateTime CreatedOn { get; set; } = DateTime.Now;
        [Required] public DateTime UpdatedOn { get; set; } = DateTime.Now;
        [Required] public bool IsDeleted { get; set; } = false;
        public MediaDto? ProfilePicture { get; set; } = null;
        public string? ProfilePictureLink { get; set; } = null;

    }

    public class NewUserDTO
    {
        [Required] public string Username { get; set; } = string.Empty;
        [Required] public string Email { get; set; } = string.Empty;
        [Required] public string Password { get; set; } = string.Empty;
        public string? Role { get; set; } = null;

    }
}