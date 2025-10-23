using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Azure.Communication.Email;

namespace FrcsPos.Interfaces
{
    public interface IEmailService
    {
        public Task SendEmailAsync(string to, string subject, string htmlBody, EmailAttachment? attachment = null);
    }
}