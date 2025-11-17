namespace Talaqi.Domain.Entities
{
    public class VerificationCode : BaseEntity
    {
        public string Email { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public bool IsUsed { get; set; }
        public string Purpose { get; set; } = string.Empty; // "PasswordReset", "EmailVerification"

        public bool IsValid => !IsUsed && DateTime.UtcNow < ExpiresAt;

        public static VerificationCode Create(string email, string purpose, TimeSpan validity)
        {
            return new VerificationCode
            {
                Email = email,
                Code = Guid.NewGuid().ToString("N")[..6].ToUpper(),
                ExpiresAt = DateTime.UtcNow.Add(validity),
                Purpose = purpose
            };
        }
    }
}