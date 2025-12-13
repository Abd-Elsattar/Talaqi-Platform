import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, finalize, switchMap, take, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../models/api-response';
import { AuthResponse } from '../models/auth';



// Auth Interceptor
// Attaches JWT access token to outgoing requests
// Handles 401 responses by attempting to refresh the token
// If refresh is successful, retries the original request with the new token
// If refresh fails, clears tokens and propagates the error
// Usage: add to HTTP interceptors array
// in app configuration

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  const isAuthUrl =
    /\/auth\/(login|refresh-token|register|confirm-email|send-email-confirmation|resend-verification-code|forgot-password|reset-password)/i.test(
      req.url
    );

  const accessToken = tokenService.getAccessToken();
  if (accessToken && !isAuthUrl) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isUnauthorized = error.status === 401;
      const isAuthEndpoint =
        /\/auth\/(login|refresh-token|register|confirm-email|send-email-confirmation|resend-verification-code|forgot-password|reset-password)/i.test(
          req.url
        );
      const refreshToken = tokenService.getRefreshToken();

      if (isUnauthorized && !isAuthEndpoint && refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken({ refreshToken }).pipe(
            switchMap((res: ApiResponse<AuthResponse>) => {
              if (res.isSuccess && res.data) {
                tokenService.saveTokens(res.data);
                refreshTokenSubject.next(res.data.accessToken);
                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${res.data.accessToken}` },
                });
                return next(retryReq);
              }

              tokenService.clearTokens();
              return throwError(() => error);
            }),
            catchError((err) => {
              tokenService.clearTokens();
              return throwError(() => err);
            }),
            finalize(() => {
              isRefreshing = false;
            })
          );
        }

        return refreshTokenSubject.pipe(
          filter((token) => token != null),
          take(1),
          switchMap((newToken) => {
            const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${newToken!}` } });
            return next(retryReq);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
