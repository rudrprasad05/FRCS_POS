using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Static
{
    public static class EmailTemplates
    {
        public static string VerifyEmailBody(string verificationLink)
        {
            var htmlBody = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='UTF-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <title>Email Verification</title>
                </head>
                <body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>
                    <table align='center' border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px;'>
                        <tr>
                            <td style='padding: 20px 0; text-align: center; background-color: #004aad;'>
                                <h1 style='color: #ffffff; margin: 0; font-size: 24px;'>Verify Your Email</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style='padding: 20px; background-color: #ffffff;'>
                                <p style='font-size: 16px; color: #333333; line-height: 1.5;'>Hello,</p>
                                <p style='font-size: 16px; color: #333333; line-height: 1.5;'>
                                    Thank you for registering! Please verify your email address by clicking the button below:
                                </p>
                                <p style='text-align: center; margin: 30px 0;'>
                                    <a href='{verificationLink}' style='display: inline-block; padding: 12px 24px; background-color: #004aad; color: #ffffff; text-decoration: none; font-size: 16px; border-radius: 4px;'>Verify Email</a>
                                </p>
                                <p style='font-size: 14px; color: #666666; line-height: 1.5;'>
                                    If the button doesn't work, copy and paste this link into your browser:
                                    <br><a href='{verificationLink}' style='color: #004aad;'>{verificationLink}</a>
                                </p>
                                <p style='font-size: 14px; color: #666666; line-height: 1.5;'>
                                    This link will expire in 2 days. If you didn't request this, please ignore this email.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style='padding: 20px; text-align: center; background-color: #f4f4f4;'>
                                <p style='font-size: 12px; color: #999999; margin: 0;'>
                                    &copy; 2025 YourAppName. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            ";

            return htmlBody;
        }
    }
}