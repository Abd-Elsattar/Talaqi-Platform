// AuthService: Manages user authentication and session lifecycle.
// Handles login, registration, password reset/verify flows, and token storage
// or refresh logic via the `TokenService` and HTTP interceptors.

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { ApiResponse } from '../models/api-response';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ResendVerificationCodeRequest,
  ForgotPasswordDto,
  ResetPasswordDto,
  RefreshTokenRequest
} from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  register(data: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, data);
  }

  verifyEmail(data: VerifyEmailRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/confirm-email`, data);
  }

  sendEmailConfirmation(data: { email: string }): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/send-email-confirmation`, data);
  }

  resendVerificationCode(data: ResendVerificationCodeRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/resend-verification-code`, data);
  }

  login(data: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, data);
  }

  forgotPassword(data: ForgotPasswordDto): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/forgot-password`, data);
  }

  resetPassword(data: ResetPasswordDto): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/reset-password`, data);
  }

  refreshToken(data: RefreshTokenRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/refresh-token`, data);
  }
}
