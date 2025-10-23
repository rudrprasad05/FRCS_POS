using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using Azure;
using Azure.Communication.Email;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Polly;
using FrcsPos.Interfaces;

namespace FrcsPos.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailClient _emailClient;
        private readonly string _senderAddress;
        private readonly IBackgroundTaskQueue _taskQueue;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly ILogger<EmailService> _logger;


        public EmailService(
            IConfiguration configuration,
            IBackgroundTaskQueue taskQueue,
            IServiceScopeFactory serviceScopeFactory,
            ILogger<EmailService> logger

        )
        {
            string connectionString = configuration["AZURE_EMAIL:ConnectionString"] ?? throw new ArgumentNullException("AzureCommunicationServices:ConnectionString is missing");
            _senderAddress = configuration["AZURE_EMAIL:SenderAddress"] ?? "DoNotReply@1b369397-0976-4de5-923f-a49b58d1438b.azurecomm.net";
            _emailClient = new EmailClient(connectionString);
            _taskQueue = taskQueue;
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger;

        }
        // add this similar to notifications
        public Task SendEmailAsync(string to, string subject, string htmlBody, EmailAttachment? attachment = null)
        {
            _taskQueue.QueueBackgroundWorkItem(async token =>
            {
                try
                {
                    // Retry policy for transient ACS failures
                    var policy = Policy
                        .Handle<RequestFailedException>()
                        .Or<Exception>()
                        .WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));

                    var emailMessage = new EmailMessage(
                        senderAddress: _senderAddress,
                        content: new EmailContent(subject)
                        {
                            PlainText = subject,
                            Html = htmlBody
                        },
                        recipients: new EmailRecipients(new List<EmailAddress> { new EmailAddress(to) })
                    );

                    if (attachment != null)
                    {
                        emailMessage.Attachments.Add(attachment);
                    }

                    EmailSendOperation emailSendOperation = await policy.ExecuteAsync(async () =>
                        await _emailClient.SendAsync(WaitUntil.Completed, emailMessage));

                    if (emailSendOperation.HasCompleted && emailSendOperation.Value.Status == EmailSendStatus.Succeeded)
                    {
                        Console.WriteLine($"Email sent successfully. MessageId: {emailSendOperation.Value}");
                        return;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error creating background email: {_senderAddress}", _senderAddress);
                }
            });

            return Task.CompletedTask;
        }
    }

}