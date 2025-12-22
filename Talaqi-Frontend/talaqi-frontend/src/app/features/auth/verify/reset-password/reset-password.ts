// Reset Password component: validates token and updates user password.
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth.service';
import { ResetPasswordDto } from '../../../../core/models/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css'],
})
export class ResetPassword implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private translate = inject(TranslateService);

  email = '';
  isSubmitting = false;

  resetPasswordForm = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'] || '';
    if (!this.email) this.router.navigate(['/forgot-password']);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.resetPasswordForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  getFieldError(field: string): string {
    const c = this.resetPasswordForm.get(field);
    if (!c) return '';

    if (c.hasError('required')) return this.translate.instant('resetPassword.errors.required');
    if (c.hasError('minlength'))
      return this.translate.instant('resetPassword.errors.minLength', { length: c.getError('minlength').requiredLength });

    return '';
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    const newPass = this.resetPasswordForm.value.newPassword!;
    const confirm = this.resetPasswordForm.value.confirmPassword!;

    if (newPass !== confirm) {
      Swal.fire({
        icon: 'error',
        title: this.translate.instant('resetPassword.error.title'),
        text: this.translate.instant('resetPassword.errors.passwordMismatch'),
      });
      return;
    }

    this.isSubmitting = true;

    const dto: ResetPasswordDto = {
      email: this.email,
      code: this.resetPasswordForm.value.code!,
      newPassword: newPass,
      confirmPassword: confirm,
    };

    this.auth.resetPassword(dto).subscribe({
      next: (res) => {
        this.isSubmitting = false;

        if (res.isSuccess) {
          Swal.fire({
            icon: 'success',
            title: this.translate.instant('resetPassword.success.title'),
            text: this.translate.instant('resetPassword.success.text'),
            confirmButtonText: this.translate.instant('resetPassword.success.button'),
          }).then(() => this.router.navigate(['/login']));
        }
      },
      error: () => (this.isSubmitting = false),
    });
  }
}
