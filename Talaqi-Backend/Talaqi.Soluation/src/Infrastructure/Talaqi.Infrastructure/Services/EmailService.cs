using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using Talaqi.Application.Interfaces.Services;

namespace Talaqi.Infrastructure.Services
{
    // The EmailService class implements the IEmailService interface
    internal class EmailService : IEmailService
    {
        // Private fields to store configuration and logger instances
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        // Constructor that initializes the configuration and logger fields
        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        // Asynchronous method to send an email
        public async Task<bool> SendEmailAsync(string to, string subject, string body)
        {
            try
            {
                // Create a new email message
                var message = new MimeMessage();

                // Set the sender email address
                message.From.Add(new MailboxAddress("Talaqi Platform", _configuration["EmailSettings: SenderEmail"]));

                // Set the recipient email address
                message.To.Add(new MailboxAddress("", to));

                // Set the subject of the email
                message.Subject = subject;

                // Create a body builder and set the HTML body content
                var builder = new BodyBuilder
                {
                    HtmlBody = body
                };

                // Attach the HTML body to the email message
                message.Body = builder.ToMessageBody();

                // Initialize the SMTP client for sending the email
                using var client = new SmtpClient();

                // Connect to the SMTP server with StartTLS security
                await client.ConnectAsync(
                    _configuration["EmailSettings:SmtpServer"],
                    int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587"),
                    SecureSocketOptions.StartTls
                );

                // Authenticate the email sender
                await client.AuthenticateAsync(
                    _configuration["EmailSettings:SenderEmail"],
                    _configuration["EmailSettings:SenderPassword"]
                );

                // Send the email message
                await client.SendAsync(message);

                // Disconnect the client
                await client.DisconnectAsync(true);

                // Log successful sending of the email
                _logger.LogInformation($"Email sent successfully to {to}");
                return true;
            }
            catch (Exception ex)
            {
                // Log an error if the email failed to send
                _logger.LogError(ex, $"Failed to send email to {to}");
                return false;
            }
        }

        // Method that sends a notification email about a potential match
        public async Task<bool> SendMatchNotificationAsync(string email, string matchDetails)
        {
            // Define the subject of the email
            var subject = "Potential Match Found - Talaqi";

            // Define the HTML body content for the email
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

            // Send the email using the SendEmailAsync method
            return await SendEmailAsync(email, subject, body);
        }

        // Method that sends a verification code for password reset
        public async Task<bool> SendVerificationCodeAsync(string email, string code)
        {
            // Define the subject of the email
            var subject = "Password Reset Verification Code - Talaqi";

            // Define the HTML body content for the email
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

            // Send the email using the SendEmailAsync method
            return await SendEmailAsync(email, subject, body);
        }
    }
}