using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Models;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using FrcsPos.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using static CrumbCodeBackend.Models.Requests.AuthRequestObject;

namespace FrcsPos.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : BaseController
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IWebHostEnvironment _env;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IUserContext _userContext;

        public AuthController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            ITokenService tokenService,
            IWebHostEnvironment env,
            ILogger<AuthController> logger,
            IUserContext userContext
        ) : base(configuration, tokenService, logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _env = env;
            _userContext = userContext;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null)
                {
                    return BadRequest(ApiResponse<LoginDTO>.Fail(message: "invalid username or password"));
                }

                var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
                if (!result.Succeeded)
                {
                    return BadRequest(ApiResponse<LoginDTO>.Fail(message: "invalid username or password"));
                }
                var roles = await _userManager.GetRolesAsync(user);
                var tokenString = _tokenService.CreateToken(user, roles);

                Response.Cookies.Append("token", tokenString, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,  // Set to false for local development
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddHours(1)
                });

                var userRole = roles.FirstOrDefault() ?? "user";

                return Ok(
                    ApiResponse<LoginDTO>.Ok(
                        data: new LoginDTO
                        {
                            Username = user.UserName ?? string.Empty,
                            Email = user.Email ?? string.Empty,
                            Id = user.Id,
                            Token = tokenString,
                            Role = userRole
                        }
                    )

                );

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("status")]
        public IActionResult GetMyOrders()
        {
            if (!_userContext.IsAuthenticated)
                return Unauthorized(ApiResponse<string>.Unauthorised(message: "bruh"));

            return Ok(ApiResponse<string>.Ok(data: null, message: "set"));
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    return Unauthorized(new { message = "Token missing or invalid" });
                }

                var token = authHeader.Substring(7);
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                var email = jwtToken.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
                if (string.IsNullOrEmpty(email))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                var user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var roles = await _userManager.GetRolesAsync(user);
                var userRole = roles.FirstOrDefault() ?? "user";

                return Ok(
                    ApiResponse<LoginDTO>.Ok(
                        data: new LoginDTO
                        {
                            Username = user.UserName ?? string.Empty,
                            Email = user.Email ?? string.Empty,
                            Id = user.Id,
                            Token = token,
                            Role = userRole
                        }
                    )

                );
            }
            catch
            {
                return Unauthorized(new { message = "Invalid or expired token" });
            }
        }


    }
}