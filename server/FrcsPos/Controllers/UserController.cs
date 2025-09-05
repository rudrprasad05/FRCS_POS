using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using FrcsPos.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    // [Authorize]
    [Route("api/user")]
    [ApiController]
    public class UserController : BaseController
    {
        private readonly UserManager<User> _userManager;
        private readonly IUserRepository _userRepository;
        private readonly IWebHostEnvironment _env;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly INotificationService _notificationService;

        private readonly ICompanyRepository _companyRepository;


        public UserController(
            UserManager<User> userManager,
            ICompanyRepository companyRepository,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            ITokenService tokenService,
            IWebHostEnvironment env,
            ILogger<UserController> logger,
            IUserRepository userRepository,
            INotificationService notificationService


        ) : base(configuration, tokenService, logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _env = env;
            _userRepository = userRepository;
            _notificationService = notificationService;
            _companyRepository = companyRepository;

        }

        [HttpGet("get-all-users")]
        public async Task<IActionResult> GetAllSuperAdmins([FromQuery] RequestQueryObject requestQuery)
        {
            var model = await _userRepository.GetAllUsers(requestQuery);
            if (model == null || !model.Success)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }

        [HttpGet("get-all-users-not-in-company")]
        public async Task<IActionResult> GetAllSuperAdminsNotInCompany([FromQuery] string? role)
        {
            var model = await _userRepository.GetAllSuperAdminsNotInCompany(role);
            if (model == null || !model.Success)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }

        [HttpGet("get-user-by-company")]
        public async Task<IActionResult> GetUserByCompany([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _userRepository.GetUserByCompany(queryObject);
            if (model == null || !model.Success)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Register([FromBody] NewUserDTO model, [FromQuery] string? CompanyName)
        {
            if (!ModelState.IsValid)
            {
                var modelErrors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(ApiResponse<string>.Fail(
                    errors: modelErrors,
                    message: "Validation failed."
                ));
            }

            string roleType = model.Role ?? "USER";

            try
            {
                // Check for duplicate username
                if (await _userManager.FindByNameAsync(model.Username) != null)
                {
                    return Conflict(ApiResponse<string>.Fail(
                        errors: new List<string> { "Username already exists." },
                        message: "Duplicate username."
                    ));
                }

                // Check for duplicate email
                if (await _userManager.FindByEmailAsync(model.Email) != null)
                {
                    return Conflict(ApiResponse<string>.Fail(
                        errors: new List<string> { "Email is already registered." },
                        message: "Duplicate email."
                    ));
                }

                var user = new User
                {
                    UserName = model.Username,
                    Email = model.Email
                };

                // Create user
                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    return BadRequest(ApiResponse<string>.Fail(
                        errors: errors,
                        message: "User creation failed."
                    ));
                }

                // Ensure role exists
                if (!await _roleManager.RoleExistsAsync(roleType))
                {
                    await _roleManager.CreateAsync(new IdentityRole(roleType));
                }

                // Assign role
                var roleResult = await _userManager.AddToRoleAsync(user, roleType);
                if (!roleResult.Succeeded)
                {
                    var errors = roleResult.Errors.Select(e => e.Description).ToList();
                    return BadRequest(ApiResponse<string>.Fail(
                        errors: errors,
                        message: "Role assignment failed."
                    ));
                }

                // Include role(s) in JWT
                var roles = await _userManager.GetRolesAsync(user);
                var dto = new UserDTO
                {
                    Username = model.Username ?? "",
                    Email = model.Email ?? "",
                };

                FireAndForget.Run(_notificationService.CreateBackgroundNotification(
                    title: "New user added",
                    message: "user " + model.Username + " was created",
                    type: NotificationType.SUCCESS,
                    isSuperAdmin: true,
                    actionUrl: "/admin/users/" + user.Id
                ));

                FireAndForget.Run(_notificationService.CreateBackgroundNotification(
                    title: "Welcome to the Tap N Go",
                    message: "refer to our guide on how to setup your account",
                    type: NotificationType.SUCCESS,
                    isSuperAdmin: false,
                    actionUrl: "/admin/users/" + user.Id,
                    userId: user.Id
                ));

                if (!string.IsNullOrEmpty(CompanyName))
                {
                    var request = new AddUserToCompany
                    {
                        UserId = user.Id,
                        CompanyUUID = CompanyName,
                    };
                    var company = await _companyRepository.AddUserToCompanyAsync(request);
                    if (company.Success != true)
                    {
                        return BadRequest(company);
                    }
                }


                return Ok(ApiResponse<UserDTO>.Ok(
                    data: dto,
                    message: "User registered successfully."
                ));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.Fail(
                    errors: new List<string> { ex.Message },
                    message: "An unexpected error occurred."
                ));
            }
        }

    }
}