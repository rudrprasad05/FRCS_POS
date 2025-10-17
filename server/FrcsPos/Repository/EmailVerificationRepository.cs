using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Interfaces;
using FrcsPos.Mappers;
using FrcsPos.Models;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using FrcsPos.Services;
using FrcsPos.Static;

namespace FrcsPos.Repository
{
    public class EmailVerificationRepository : IEmailVerificationRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public EmailVerificationRepository(
            ApplicationDbContext context,
            IConfiguration configuration,
            IEmailService emailService
        )

        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        public async Task<bool> CreateNewLink(User user)
        {
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
            if (user == null)
            {
                return false;
            }

            var email = await _emailService.SendVerifyEmailAsync(user.Email ?? "", "Verify Email Address", EmailTemplates.VerifyEmailBody(verificationLink));

            return email;

        }

        public Task<ApiResponse<EmailVerificationDTO>> SendPasswordResetEmail(string email)
        {
            throw new NotImplementedException();
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

            user.EmailConfirmed = true;
            verification.IsVerified = true;

            await _context.SaveChangesAsync();

            return ApiResponse<EmailVerificationDTO>.Ok(verification.ToDtoAsync());

        }
    }
}