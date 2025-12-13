import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import Swal from 'sweetalert2';


// Error Interceptor
// Catches HTTP errors and displays user-friendly messages
// Handles specific status codes (400, 401, 403, 404, 500)
// Redirects to login on 401 errors (except for login requests)
// Usage: add to HTTP interceptors array
// in app configuration

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  const isAuthLogin = /\/auth\/login/i.test(req.url);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'حدث خطأ غير متوقع';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `خطأ: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 0:
            errorMessage = 'لا يمكن الاتصال بالخادم. تأكد من تشغيل الخادم وتوفر الإنترنت.';
            break;
          case 400:
            errorMessage = error.error?.message || 'بيانات غير صحيحة';
            break;
          case 401:
            if (isAuthLogin) {
              errorMessage = error.error?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
            } else {
              errorMessage = 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مجدداً';
              tokenService.clearTokens();
              router.navigate(['/login']);
            }
            break;
          case 403:
            errorMessage = 'ليس لديك صلاحية للوصول إلى هذا المحتوى';
            break;
          case 404:
            errorMessage = 'المحتوى المطلوب غير موجود';
            break;
          case 500:
            errorMessage = 'خطأ في الخادم، يرجى المحاولة لاحقاً';
            break;
          default:
            errorMessage = error.error?.message || 'حدث خطأ غير متوقع';
        }
      }

      console.error('HTTP Error:', error);

      if (error.status !== 401 || !isAuthLogin) {
        Swal.fire({ title: 'خطأ', text: errorMessage, icon: 'error', confirmButtonText: 'حسناً' });
      }

      return throwError(() => error);
    })
  );
};
