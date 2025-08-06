using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Models;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : BaseController
    {
        private readonly UserManager<User> _userManager;
        private readonly IWebHostEnvironment _env;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UserController(
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            ITokenService tokenService,
            IWebHostEnvironment env,
            ILogger<UserController> logger
        ) : base(configuration, tokenService, logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _env = env;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Register([FromBody] NewUserDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Determine role type from email domain
            var roleType = model.Email.Contains("@procyonfiji.com") ? "Admin" : "User";

            try
            {
                var user = new User
                {
                    UserName = model.Username,
                    Email = model.Email
                };

                // Create user
                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                    return BadRequest(result.Errors);

                // Ensure role exists
                if (!await _roleManager.RoleExistsAsync(roleType))
                {
                    await _roleManager.CreateAsync(new IdentityRole(roleType));
                }

                // Assign role
                var roleResult = await _userManager.AddToRoleAsync(user, roleType);
                if (!roleResult.Succeeded)
                    return BadRequest(roleResult.Errors);

                // Include role(s) in JWT
                var roles = await _userManager.GetRolesAsync(user);
                var token = _tokenService.CreateToken(user, roles); 

                // Set cookie
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = !_env.IsDevelopment(),
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddDays(7)
                };

                Response.Cookies.Append("token", token, cookieOptions);

                var dto = new UserDTO
                {
                    Username = model.Username ?? "",
                    Email = model.Email ?? "",
                    Token = token,
                };

                return Ok(new ApiResponse<UserDTO>
                {
                    Success = true,
                    StatusCode = 200,
                    Data = dto,
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}