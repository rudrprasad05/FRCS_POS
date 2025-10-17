using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3.Model;

namespace FrcsPos.Interfaces
{
    public interface IEmailService
    {
        public Task<bool> SendVerifyEmailAsync(string to, string subject, string htmlBody);
    }
}