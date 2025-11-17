using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using Talaqi.Application.Interfaces.Services;

namespace Talaqi.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<bool> SendEmailAsync(string to, string subject, string body)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(
                    "Talaqi Platform",
                    _configuration["EmailSettings:SenderEmail"]));
                message.To.Add(new MailboxAddress("", to));
                message.Subject = subject;

                var builder = new BodyBuilder
                {
                    HtmlBody = body
                };
                message.Body = builder.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync(
                    _configuration["EmailSettings:SmtpServer"],
                    int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587"),
                    SecureSocketOptions.StartTls);

                await client.AuthenticateAsync(
                    _configuration["EmailSettings:SenderEmail"],
                    _configuration["EmailSettings:SenderPassword"]);

                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation($"Email sent successfully to {to}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {to}");
                return false;
            }
        }

        public async Task<bool> SendVerificationCodeAsync(string email, string code)
        {
            var subject = "Password Reset Verification Code - Talaqi";
            var body = $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                    <h2 style='color: #2c3e50;'>Password Reset Request</h2>
                    <p>You have requested to reset your password. Use the verification code below:</p>
                    <div style='background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;'>
                        <h1 style='color: #3498db; font-size: 36px; margin: 0;'>{code}</h1>
                    </div>
                    <p>This code will expire in 15 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <hr style='border: 1px solid #ecf0f1; margin: 20px 0;'>
                    <p style='color: #7f8c8d; font-size: 12px;'>
                        This is an automated message from Talaqi Platform. Please do not reply.
                    </p>
                </div>
            </body>
            </html>";

            return await SendEmailAsync(email, subject, body);
        }

        public async Task<bool> SendMatchNotificationAsync(string email, string matchDetails)
        {
            var subject = "Potential Match Found - Talaqi";
            var body = $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                    <h2 style='color: #2c3e50;'>Great News!</h2>
                    <p>We found a potential match for your lost item:</p>
                    <div style='background-color: #e8f5e9; padding: 20px; border-left: 4px solid #4caf50; margin: 20px 0;'>
                        <p style='margin: 0;'>{matchDetails}</p>
                    </div>
                    <p>
                        <a href='https://talaqi.com/matches' 
                           style='background-color: #4caf50; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 4px; display: inline-block;'>
                            View Match Details
                        </a>
                    </p>
                    <p style='color: #7f8c8d; font-size: 14px; margin-top: 20px;'>
                        Log in to your Talaqi account to review the match and contact the finder.
                    </p>
                    <hr style='border: 1px solid #ecf0f1; margin: 20px 0;'>
                    <p style='color: #7f8c8d; font-size: 12px;'>
                        This is an automated message from Talaqi Platform. Please do not reply.
                    </p>
                </div>
            </body>
            </html>";

            return await SendEmailAsync(email, subject, body);
        }
    }
}