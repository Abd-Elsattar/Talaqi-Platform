// Account Verification component: confirms user email/phone and updates state.
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './verify.html',
  styleUrl: './verify.css',
})
export class Verify implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private translate = inject(TranslateService);

  email = '';
  isSubmitting = false;
  isResending = false;
  countdown = 0;
  private countdownInterval: any;

  verifyForm = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6)]],
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.verifyForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  getFieldError(fieldName: string): string {
    const field = this.verifyForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) return this.translate.instant('verify.errors.required');
    if (field.hasError('minlength')) return this.translate.instant('verify.errors.minlength');
    return '';
  }

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'] || '';

    if (!this.email) {
      this.router.navigate(['/register']);
    }

    // Log to confirm email was passed correctly
    console.log('=== VERIFY PAGE LOADED ===');
    console.log('Email received:', this.email);
    console.log('⚠️ IMPORTANT: Check your email inbox for verification code!');
    console.log('📧 Email address:', this.email);
    console.log('🔍 Check these folders:');
    console.log('   - Inbox');
    console.log('   - Spam/Junk folder');
    console.log('   - Promotions tab (Gmail)');
    console.log('   - Updates tab (Gmail)');
    console.log('');
    console.log('❌ If no email received, the backend is NOT sending emails!');
    console.log('   Backend must call email service during registration.');
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startCountdown() {
    this.countdown = 60; // 60 seconds cooldown
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  resendCode() {
    if (this.isResending || this.countdown > 0) return;

    this.isResending = true;

    const requestData = { email: this.email };

    console.log('Resending verification code to:', this.email);

    this.auth.sendEmailConfirmation(requestData).subscribe({
      next: (res) => {
        console.log('Resend response:', res);
        this.isResending = false;
        if (res.isSuccess) {
          this.startCountdown();
          Swal.fire({
            title: this.translate.instant('verify.resendSuccess.title'),
            text: this.translate.instant('verify.resendSuccess.message'),
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            title: this.translate.instant('verify.resendFailure.title'),
            text: res.message || this.translate.instant('verify.resendFailure.defaultMessage'),
            icon: 'error',
            confirmButtonText: this.translate.instant('verify.resendFailure.confirmButton'),
          });
        }
      },
      error: (err) => {
        console.error('Resend error:', err);
        this.isResending = false;

        let errorMessage = this.translate.instant('verify.resendFailure.defaultMessage');

        if (err.status === 0) {
          errorMessage = this.translate.instant('verify.errors.serverError');
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }

        Swal.fire({
          title: this.translate.instant('verify.resendFailure.title'),
          text: errorMessage,
          icon: 'error',
          confirmButtonText: this.translate.instant('verify.resendFailure.confirmButton'),
        });
      },
    });
  }

  onSubmit() {
    if (this.verifyForm.invalid) return;

    this.isSubmitting = true;

    const requestData = {
      email: this.email,
      code: this.verifyForm.get('code')?.value || '',
    };

    console.log('Submitting verification with data:', requestData);
    console.log('API endpoint:', `${this.auth['apiUrl']}/confirm-email`);

    this.auth.verifyEmail(requestData).subscribe({
      next: (res) => {
        console.log('Verification response:', res);
        this.isSubmitting = false;
        if (res.isSuccess) {
          Swal.fire({
            title: this.translate.instant('verify.success.title'),
            text: this.translate.instant('verify.success.message'),
            icon: 'success',
            confirmButtonText: this.translate.instant('verify.success.confirmButton'),
          }).then(() => {
            this.router.navigate(['/login'], { queryParams: { email: this.email } });
          });
        } else {
          console.error('Verification failed:', res.message);
          Swal.fire({
            title: this.translate.instant('verify.failure.title'),
            text: res.message || this.translate.instant('verify.failure.defaultMessage'),
            icon: 'error',
            confirmButtonText: this.translate.instant('verify.failure.confirmButton'),
          });
        }
      },
      error: (err) => {
        console.error('Verification error:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Error details:', err.error);

        this.isSubmitting = false;

        let errorMessage = this.translate.instant('verify.errors.invalidCode');

        if (err.status === 0) {
          errorMessage = this.translate.instant('verify.errors.serverError');
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }

        Swal.fire({
          title: this.translate.instant('verify.failure.invalidCode'),
          text: errorMessage,
          icon: 'error',
          confirmButtonText: this.translate.instant('verify.failure.confirmButton'),
        });
      },
    });
  }
}
