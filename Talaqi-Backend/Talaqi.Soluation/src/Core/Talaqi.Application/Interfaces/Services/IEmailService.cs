namespace Talaqi.Application.Interfaces.Services
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(string to, string subject, string body);
        Task<bool> SendVerificationCodeAsync(string email, string code);
        Task<bool> SendMatchNotificationAsync(string email, string matchDetails);
    }
}
