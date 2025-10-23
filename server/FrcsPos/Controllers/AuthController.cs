using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.DTO;
using FrcsPos.Interfaces;
using FrcsPos.Mappers;
using FrcsPos.Models;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using FrcsPos.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static FrcsPos.Models.Requests.AuthRequestObject;

namespace FrcsPos.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : BaseController
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMediaMapper _mediaMapper;

        public AuthController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<AuthController> logger,
            IMediaMapper mediaMapper
        ) : base(configuration, tokenService, logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mediaMapper = mediaMapper;
        }

        [Authorize]
        [HttpGet("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("token", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });

            return Ok(ApiResponse<string>.Ok(data: "ok"));
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
                var user = await _userManager.Users
                    .Include(u => u.ProfilePicture)
                    .FirstOrDefaultAsync(u => u.Email == model.Email);
                if (user == null)
                {
                    return BadRequest(ApiResponse<LoginDTO>.Fail(message: "invalid username or password"));
                }

                if (!user.EmailConfirmed)
                {
                    return UnprocessableEntity(ApiResponse<LoginDTO>.Forbidden(message: "email not verified"));
                }

                if (user.LockoutEnd > DateTime.UtcNow)
                {
                    return UnprocessableEntity(ApiResponse<LoginDTO>.Forbidden(message: "too to many requests"));
                }

                var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
                if (!result.Succeeded)
                {
                    user.AccessFailedCount += 1;
                    if (user.AccessFailedCount > 3)
                    {
                        user.LockoutEnabled = true;
                        user.LockoutEnd = DateTime.UtcNow.AddMinutes(5);
                        user.AccessFailedCount = 0;
                    }
                    await _userManager.UpdateAsync(user);

                    return BadRequest(ApiResponse<LoginDTO>.Fail(message: "invalid username or password"));
                }
                user.LockoutEnabled = false;
                user.LockoutEnd = null;
                user.AccessFailedCount = 0;

                var roles = await _userManager.GetRolesAsync(user);
                var tokenString = _tokenService.CreateToken(user, roles);

                Response.Cookies.Append("token", tokenString, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,  // Set to false for local development
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddHours(1)
                });

                var userRole = roles.FirstOrDefault() ?? "user";
                await _userManager.UpdateAsync(user);

                var pfp = new MediaDto();

                if (user.ProfilePicture != null)
                {
                    pfp = await _mediaMapper.ToDtoAsync(user.ProfilePicture);
                }

                var resDTO = new LoginDTO
                {
                    Username = user.UserName ?? string.Empty,
                    Email = user.Email ?? string.Empty,
                    Id = user.Id,
                    Token = tokenString,
                    Role = userRole,
                    ProfilePictureLink = pfp.Url,
                };

                return Ok(ApiResponse<LoginDTO>.Ok(resDTO)

                );

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
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