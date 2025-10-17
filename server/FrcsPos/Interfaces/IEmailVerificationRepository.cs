using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Interfaces
{
    public interface IEmailVerificationRepository
    {
        public Task<bool> CreateNewLink(User user);
        public Task<bool> SendPasswordResetEmail(string email);
        public Task<ApiResponse<EmailVerificationDTO>> VerifyLink(string code, string userId);
        public Task<ApiResponse<EmailVerificationDTO>> ResetPassword(PasswordResetRequest request);
    }
}