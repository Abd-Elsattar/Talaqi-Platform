using AutoMapper;
using System.Security.Cryptography;
using System.Text;
using Talaqi.Application.Common;
using Talaqi.Application.DTOs.Auth;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Application.Interfaces.Services;
using Talaqi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Talaqi.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;

        public AuthService(IUnitOfWork unitOfWork, ITokenService tokenService,
                          IEmailService emailService, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _tokenService = tokenService;
            _emailService = emailService;
            _mapper = mapper;
        }

        #region Register
        public async Task<Result<AuthResponseDto>> RegisterAsync(RegisterDto dto)
        {
            dto.Email = dto.Email.Trim().ToLower();

            // Validate password match
            if (dto.Password != dto.ConfirmPassword)
                return Result<AuthResponseDto>.Failure("Passwords do not match");

            // Check if email exists
            if (await _unitOfWork.Users.EmailExistsAsync(dto.Email))
                return Result<AuthResponseDto>.Failure("Email already exists");

            // Create user with email verification flag set to false
            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email.ToLower(),
                PhoneNumber = dto.PhoneNumber,
                PasswordHash = HashPassword(dto.Password),
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                IsEmailVerified = false,  // Start as unverified
                Role = "User"
            };

            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            // NEW: Automatically send email confirmation code
            await SendEmailConfirmationCodeInternalAsync(user.Email);

            return Result<AuthResponseDto>.Success(
                new AuthResponseDto
                {
                    User = _mapper.Map<UserDto>(user)
                },
                "Registration successful. Please verify your email.");
        } 
        #endregion

        public async Task<Result<AuthResponseDto>> LoginAsync(LoginDto dto)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(dto.Email.ToLower());

            if (user == null || !VerifyPassword(dto.Password, user.PasswordHash))
                return Result<AuthResponseDto>.Failure("Invalid email or password");

            if (!user.IsActive)
                return Result<AuthResponseDto>.Failure("Account is deactivated");

            // Check email verification
            if (!user.IsEmailVerified)
                return Result<AuthResponseDto>.Failure("Please verify your email address before logging in");

            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _unitOfWork.SaveChangesAsync();

            var response = new AuthResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddHours(1),
                User = _mapper.Map<UserDto>(user)
            };

            return Result<AuthResponseDto>.Success(response, "Login successful");
        }

        public async Task<Result> ForgotPasswordAsync(ForgotPasswordDto dto)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(dto.Email.ToLower());

            if (user == null)
                return Result.Success("If the email exists, a reset code will be sent");

            // Invalidate old codes
            await _unitOfWork.VerificationCodes.InvalidateCodesForEmailAsync(dto.Email, "PasswordReset");

            // Generate new code
            var code = _tokenService.GenerateVerificationCode();
            var verificationCode = new VerificationCode
            {
                Email = dto.Email.ToLower(),
                Code = code,
                Purpose = "PasswordReset",
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.VerificationCodes.AddAsync(verificationCode);
            await _unitOfWork.SaveChangesAsync();

            // Send email using new template method
            await _emailService.SendPasswordResetCodeAsync(dto.Email, code);

            return Result.Success("Verification code sent to your email");
        }

        public async Task<Result> ResetPasswordAsync(ResetPasswordDto dto)
        {
            if (dto.NewPassword != dto.ConfirmPassword)
                return Result.Failure("Passwords do not match");

            var verificationCode = await _unitOfWork.VerificationCodes
                .GetValidCodeAsync(dto.Email.ToLower(), dto.Code, "PasswordReset");

            if (verificationCode == null || !verificationCode.IsValid)
                return Result.Failure("Invalid or expired verification code");

            var user = await _unitOfWork.Users.GetByEmailAsync(dto.Email.ToLower());

            if (user == null)
                return Result.Failure("User not found");

            user.PasswordHash = HashPassword(dto.NewPassword);
            verificationCode.IsUsed = true;

            await _unitOfWork.SaveChangesAsync();

            return Result.Success("Password reset successful");
        }

        public async Task<Result> SendEmailConfirmationCodeAsync(SendEmailConfirmationCodeDto dto)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(dto.Email.ToLower());

            if (user == null)
                return Result.Success("If the email exists, a confirmation code will be sent");

            if (user.IsEmailVerified)
                return Result.Failure("Email is already confirmed");

            // Use helper method
            await SendEmailConfirmationCodeInternalAsync(dto.Email.ToLower());

            return Result.Success("Confirmation code sent to your email");
        }

        public async Task<Result> ConfirmEmailAsync(ConfirmEmailDto dto)
        {
            var verificationCode = await _unitOfWork.VerificationCodes
                .GetValidCodeAsync(dto.Email.ToLower(), dto.Code, "EmailConfirmation");

            if (verificationCode == null || !verificationCode.IsValid)
                return Result.Failure("Invalid or expired confirmation code");

            var user = await _unitOfWork.Users.GetByEmailAsync(dto.Email.ToLower());

            if (user == null)
                return Result.Failure("User not found");

            user.IsEmailVerified = true;
            verificationCode.IsUsed = true;
            await _unitOfWork.SaveChangesAsync();

            return Result.Success("Email confirmed successfully");
        }

        public async Task<Result<AuthResponseDto>> RefreshTokenAsync(string refreshToken)
        {
            try
            {

                var user = await _unitOfWork.Users
                    .GetQueryable()
                    .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

                if (user == null)
                    return Result<AuthResponseDto>.Failure("Invalid refresh token.");


                if (user.RefreshTokenExpiryTime < DateTime.UtcNow)
                    return Result<AuthResponseDto>.Failure("Refresh token has expired.");

                var newAccessToken = _tokenService.GenerateAccessToken(user);
                var newRefreshToken = _tokenService.GenerateRefreshToken();

                user.RefreshToken = newRefreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

                await _unitOfWork.SaveChangesAsync();

                var response = new AuthResponseDto
                {
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshToken,
                    ExpiresAt = DateTime.UtcNow.AddHours(1),
                    User = _mapper.Map<UserDto>(user)
                };

                return Result<AuthResponseDto>.Success(response, "Token refreshed successfully.");
            }
            catch (Exception ex)
            {
                return Result<AuthResponseDto>.Failure($"Error refreshing token: {ex.Message}");
            }
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        private bool VerifyPassword(string password, string hash)
        {
            var passwordHash = HashPassword(password);
            return passwordHash == hash;
        }

        #region Helper Methods
        /// <summary>
        /// Send email confirmation code - can be called independently or after registration
        /// </summary>
        private async Task SendEmailConfirmationCodeInternalAsync(string email)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(email);

            if (user == null)
                return;

            if (user.IsEmailVerified)
                return;

            // Invalidate old codes
            await _unitOfWork.VerificationCodes.InvalidateCodesForEmailAsync(email, "EmailConfirmation");

            // Generate new code
            var code = _tokenService.GenerateVerificationCode();
            var verificationCode = new VerificationCode
            {
                Email = email,
                Code = code,
                Purpose = "EmailConfirmation",
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.VerificationCodes.AddAsync(verificationCode);
            await _unitOfWork.SaveChangesAsync();

            // Send email using new template method
            await _emailService.SendEmailConfirmationAsync(email, code);
        }
        #endregion
    }

}
