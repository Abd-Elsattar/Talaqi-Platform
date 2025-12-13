// Auth Models
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl?: string;
  role?: string;
}

// Response Model for authentication-related responses
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

// Request Models for authentication-related requests
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

// Request Model for email verification
export interface VerifyEmailRequest {
  email: string;
  code: string;
}

// Request Model for resending verification code
export interface ResendVerificationCodeRequest {
  email: string;
}

// Request Model for login
export interface LoginRequest {
  email: string;
  password: string;
}

// Request Model for forgot password
export interface ForgotPasswordDto {
  email: string;
}

// Request Model for reset password
export interface ResetPasswordDto {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

// Request Model for refresh token
export interface RefreshTokenRequest {
  refreshToken: string;
}
