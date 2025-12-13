// Auth routes: configures paths for login, register, verification, and password flows.
import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((c) => c.Login),
    title: 'تسجيل الدخول',
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register').then((c) => c.Register),
    title: 'انشاء حساب',
  },
  {
    path: 'verify',
    loadComponent: () => import('./verify/verify').then((c) => c.Verify),
    title: 'التحقق من الايميل',
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password').then((c) => c.ForgotPassword),
    title: 'اعادة تعيين كلمة المرور',
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./verify/reset-password/reset-password').then((c) => c.ResetPassword),
    title: 'ادخال كلمة المرور الجديد',
  },
];
