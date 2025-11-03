using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Talaqi.Application.Common;
using Talaqi.Application.DTOs.Auth;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Application.Interfaces.Services;
using Talaqi.Domain.Entities;

namespace Talaqi.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;

        public AuthService(IUnitOfWork unitOfWork, ITokenService tokenService, IEmailService emailService, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _tokenService = tokenService;
            _emailService = emailService;
            _mapper = mapper;
        }

        public async Task<Result<AuthResponseDto>> RegisterAsync(RegisterDto registerDto)
        {
            // Validate password match
            if (registerDto.Password != registerDto.ConfirmPassword)
                return Result<AuthResponseDto>.Failure("Passwords do not match");

            // Check if mail exists
            if (await _unitOfWork.Users.EmailExistAsync(registerDto.Email))
                return Result<AuthResponseDto>.Failure("Email already exists");

            // Create User
            var user = new User
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.LastName,
                PhoneNumber = registerDto.PhoneNumber,
                PassWordHash = HashPassword(registerDto.Password),
                CreateAt = DateTime.UtcNow,
                IsActive = true,
                Role = "User"
            };

            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            // Generate tokens
            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            var response = new AuthResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddHours(7),
                User = _mapper.Map<UserDto>(user)
            };

            return Result<AuthResponseDto>.Success(response, "Rigistration successful");
        }
        public async Task<Result<AuthResponseDto>> LoginAsync(LoginDto loginDto)
        {
            var user = await _unitOfWork.Users.GetUserByEmailAsync(loginDto.Email.ToLower());

            if (user == null || !VerifyPassword(loginDto.Password, user.PassWordHash))
                return Result<AuthResponseDto>.Failure("Invalid email or Password");

            if (!user.IsActive)
                return Result<AuthResponseDto>.Failure("Account is deactivated");

            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            var response = new AuthResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddHours(7),
                User = _mapper.Map<UserDto>(user)
            };

            return Result<AuthResponseDto>.Success(response, "Login successful");
        }
        public async Task<Result> forgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _unitOfWork.Users.GetUserByEmailAsync(forgotPasswordDto.Email.ToLower());

            if (user == null)
                return Result.Success("If the email exists, a reset code will be sent");

            // Invalidate old Codes
            await _unitOfWork.VerificationCodes.InvalidateCodesForEmailAsync(forgotPasswordDto.Email, "PasswordReset");

            // Generate new Code
            var code = _tokenService.GenerateVerificationCode();
            var verificationCode = new VerificationCode
            {
                Email = forgotPasswordDto.Email,
                Code = code,
                Purpose = "PasswordReset",
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                CreateAt = DateTime.UtcNow
            };

            await _unitOfWork.VerificationCodes.AddAsync(verificationCode);
            await _unitOfWork.SaveChangesAsync();

            // Send email
            await _emailService.SendVerificationCodeAsync(forgotPasswordDto.Email, code);

            return Result.Success("Password reset code sent successfully");
        }
        public async Task<Result> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
        {
            if (resetPasswordDto.NewPassword != resetPasswordDto.ConfirmPassword)
                return Result.Failure("Passwords do not match");

            var verificationCode = await _unitOfWork.VerificationCodes
                .GetValidCodeAsync(resetPasswordDto.Email.ToLower(), resetPasswordDto.Code, "PasswordReset");

            if (verificationCode == null || !verificationCode.IsValid)
                return Result.Failure("nvalid or expired verification code");

            var user = await _unitOfWork.Users.GetUserByEmailAsync(resetPasswordDto.Email.ToLower());

            if (user == null)
                return Result.Failure("User not found");

            user.PassWordHash = HashPassword(resetPasswordDto.NewPassword);
            verificationCode.IsUsed = true;

            await _unitOfWork.SaveChangesAsync();

            return Result.Success("Password reset successful");
        }

        public async Task<Result<AuthResponseDto>> RefreshTokenAsync(string refreshToken)
        {
            // Implement refresh token logic here
            // For simplicity, returning failure for now
            return Result<AuthResponseDto>.Failure("Invalid refresh token");
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashBytes);
        }
        private bool VerifyPassword(string password, string hash)
        {

            var hashedPassword = HashPassword(password);
            return hashedPassword == hash;
        }
    }
}
