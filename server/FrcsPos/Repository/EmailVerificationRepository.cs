using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Interfaces;
using FrcsPos.Mappers;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using FrcsPos.Services;
using FrcsPos.Static;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Repository
{
    public class EmailVerificationRepository : IEmailVerificationRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<EmailVerificationRepository> _logger;



        public EmailVerificationRepository(
            ApplicationDbContext context,
            IConfiguration configuration,
            IEmailService emailService,
            UserManager<User> userManager,
            ILogger<EmailVerificationRepository> logger
        )
        {
            _context = context;
            _userManager = userManager;
            _configuration = configuration;
            _emailService = emailService;
            _logger = logger;
        }

        public async Task<ApiResponse<EmailVerificationDTO>> CreateNewLink(User user)
        {

            if (user == null)
            {
                return ApiResponse<EmailVerificationDTO>.NotFound();
            }

            if (user.EmailConfirmed)
            {
                return ApiResponse<EmailVerificationDTO>.Fail(message: "User email already verified");
            }

            var code = Guid.NewGuid().ToString();
            var emailVerification = new EmailVerification
            {
                UserId = user.Id,
                Code = code,
                IsVerified = false,
                UseBy = DateTime.UtcNow.AddDays(2),
                CreatedOn = DateTime.UtcNow,
                UpdatedOn = DateTime.UtcNow
            };

            _context.EmailVerifications.Add(emailVerification);
            await _context.SaveChangesAsync();

            string baseUrl = _configuration["BASE_URL"] ?? throw new InvalidOperationException("base url not found");
            var verificationLink = $"{baseUrl}/auth/verify-email?code={code}&userId={user.Id}";

            FireAndForget.Run(_emailService.SendEmailAsync(user.Email ?? "", "Verify Email Address", EmailTemplates.VerifyEmailBody(verificationLink)));

            return ApiResponse<EmailVerificationDTO>.Ok(new EmailVerificationDTO
            {
                UserId = user.Id,
                UseBy = emailVerification.UseBy
            });
        }

        public async Task<ApiResponse<EmailVerificationDTO>> VerifyLink(string code, string userId)
        {
            var verification = _context.EmailVerifications.FirstOrDefault(
                x => x.Code == code &&
                x.UserId == userId &&
                x.UseBy > DateTime.UtcNow
            );
            var user = _context.Users.FirstOrDefault(x => x.Id == userId);
            if (verification == null || user == null)
            {
                return ApiResponse<EmailVerificationDTO>.NotFound(message: "link not found");
            }

            if (user.EmailConfirmed)
            {
                return ApiResponse<EmailVerificationDTO>.Fail(message: "Email already verified");
            }

            user.EmailConfirmed = true;
            verification.IsVerified = true;

            await _context.SaveChangesAsync();

            return ApiResponse<EmailVerificationDTO>.Ok(verification.ToDtoAsync());

        }

        public async Task<ApiResponse<EmailVerificationDTO>> ResetPassword(PasswordResetRequest request)
        {

            var code = request.Code;
            var userId = request.UserId;
            var newPassword = request.Password;


            var verification = _context.EmailVerifications.FirstOrDefault(
                x => x.Code == code &&
                x.UserId == userId &&
                x.UseBy > DateTime.UtcNow
            );
            var user = _context.Users.FirstOrDefault(x => x.Id == userId);
            if (verification == null || user == null)
            {
                return ApiResponse<EmailVerificationDTO>.NotFound(message: "link not working");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                return ApiResponse<EmailVerificationDTO>.Fail(message: $"Password reset failed: {errors}");
            }


            verification.IsVerified = true;
            await _context.SaveChangesAsync();

            return ApiResponse<EmailVerificationDTO>.Ok(
                data: new EmailVerificationDTO
                {
                    UserId = user.Id,
                    Code = verification.Code,
                    UseBy = verification.UseBy,
                },
                message: "Password reset successfully"
            );
        }

        public async Task<bool> SendPasswordResetEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email ?? "");
            if (user == null)
            {
                return false;
            }

            var code = Guid.NewGuid().ToString();

            var emailVerification = new EmailVerification
            {
                UserId = user.Id,
                Code = code,
                IsVerified = false,
                UseBy = DateTime.UtcNow.AddDays(2),
                CreatedOn = DateTime.UtcNow,
                UpdatedOn = DateTime.UtcNow
            };

            _context.EmailVerifications.Add(emailVerification);
            await _context.SaveChangesAsync();

            string baseUrl = _configuration["BASE_URL"] ?? throw new InvalidOperationException("base url not found");
            var verificationLink = $"{baseUrl}/auth/forgot-password?code={code}&userId={user.Id}";

            FireAndForget.Run(_emailService.SendEmailAsync(user.Email ?? "", "Reset Password", EmailTemplates.ResetPasswordBody(verificationLink)));

            return true;
        }


    }
}