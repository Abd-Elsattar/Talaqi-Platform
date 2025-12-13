// Reset Password component: validates token and updates user password.
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../core/services/auth.service';
import { ResetPasswordDto } from '../../../../core/models/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css'],
})
export class ResetPassword implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

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

    if (c.hasError('required')) return 'هذا الحقل مطلوب';
    if (c.hasError('minlength'))
      return `يجب أن يكون ${c.getError('minlength').requiredLength} أحرف على الأقل`;

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
        title: 'خطأ',
        text: 'كلمات المرور غير متطابقة',
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
            title: 'تم التعيين بنجاح',
            text: 'تم تغيير كلمة المرور.',
            confirmButtonText: 'تسجيل الدخول',
          }).then(() => this.router.navigate(['/login']));
        }
      },
      error: () => (this.isSubmitting = false),
    });
  }
}
