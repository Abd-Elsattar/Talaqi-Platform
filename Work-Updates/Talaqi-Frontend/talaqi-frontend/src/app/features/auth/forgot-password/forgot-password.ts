// Forgot Password component: handles reset request logic and form validation.
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { ForgotPasswordDto } from '../../../core/models/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  isSubmitting = false;

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  isFieldInvalid(field: string): boolean {
    const control = this.forgotPasswordForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  getFieldError(field: string): string {
    const c = this.forgotPasswordForm.get(field);
    if (!c) return '';

    if (c.hasError('required')) return this.translate.instant('forgotPassword.errors.required');
    if (c.hasError('email')) return this.translate.instant('forgotPassword.errors.email');
    return '';
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const dto: ForgotPasswordDto = {
      email: this.forgotPasswordForm.value.email || '',
    };

    this.auth.forgotPassword(dto).subscribe({
      next: (res) => {
        this.isSubmitting = false;

        if (res.isSuccess) {
          Swal.fire({
            title: this.translate.instant('forgotPassword.success.title'),
            text: this.translate.instant('forgotPassword.success.message'),
            icon: 'success',
            confirmButtonText: this.translate.instant('forgotPassword.success.confirmButton'),
          }).then(() => {
            this.router.navigate(['/reset-password'], {
              queryParams: { email: dto.email },
            });
          });
        }
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }
}
