// Login component: manages user authentication and form submission.
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);
  public languageService = inject(LanguageService);

  isSubmitting = false;
  authError: string | null = null;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor() {
    // Prefill email from query params if provided (e.g., after successful registration)
    const emailFromQuery = this.route.snapshot.queryParamMap.get('email');
    if (emailFromQuery) {
      this.loginForm.patchValue({ email: emailFromQuery });
    }
  }

  // Helper methods for field validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) return this.translate.instant('login.errors.required');
    if (field.hasError('email')) return this.translate.instant('login.errors.email');
    return '';
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.authError = null;

    const credentials = {
      email: this.loginForm.get('email')?.value || '',
      password: this.loginForm.get('password')?.value || '',
    };

    this.auth.login(credentials).subscribe({
      next: (res) => {
        this.isSubmitting = false;

        if (res.isSuccess) {
          // Store tokens using TokenService
          this.tokenService.saveTokens(res.data);

          // Welcome message
          Swal.fire({
            title: this.translate.instant('login.success.title'),
            text: this.translate.instant('login.success.message'),
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            // Navigate to home
            this.router.navigate(['/home']);
          });
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        // عرض رسالة خطأ أنيقة داخل النموذج
        this.authError = err?.error?.message || this.translate.instant('login.errors.authError');
        // إبراز الحقول كغير صحيحة لمساعدة المستخدم بصرياً
        const emailCtrl = this.loginForm.get('email');
        const passwordCtrl = this.loginForm.get('password');
        emailCtrl?.setErrors({ invalid: true });
        passwordCtrl?.setErrors({ invalid: true });
        emailCtrl?.markAsTouched();
        passwordCtrl?.markAsTouched();
      },
    });
  }
}
