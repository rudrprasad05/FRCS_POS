using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Services
{
    using Azure;
    using Azure.Communication.Email;
    using Azure.Identity;

    public class EmailService
    {
        private readonly EmailClient _emailClient;
        private readonly string _senderAddress;

        public EmailService(IConfiguration config)
        {
            // The resource endpoint (found in Azure Portal)
            var endpoint = config["Azure:Email:Endpoint"];
            _senderAddress = config["Azure:Email:Sender"];

            // Use DefaultAzureCredential (works with Managed Identity or local dev)
            var credential = new DefaultAzureCredential();

            _emailClient = new EmailClient(new Uri(endpoint), credential);
        }

        public async Task<bool> SendAsync(string to, string subject, string htmlBody)
        {
            try
            {
                var message = new EmailMessage(
                    _senderAddress,
                    new EmailRecipients(new List<EmailAddress> { new EmailAddress(to) }),
                    new EmailContent(subject)
                    {
                        Html = htmlBody,
                        PlainText = "View this email in HTML format."
                    }
                );

                var operation = await _emailClient.SendAsync(WaitUntil.Completed, message);
                return operation.Value.Status == EmailSendStatus.Succeeded;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email failed: {ex.Message}");
                return false;
            }
        }
    }

}