// Register component: handles account creation and form validation.
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/auth';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    public languageService: LanguageService
  ) {
    this.form = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^01[0-2,5]{1}[0-9]{8}$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatch }
    );

    // Prefill email if passed via query params (e.g., coming back from verify "تعديل البريد")
    const emailFromQuery = this.route.snapshot.queryParamMap.get('email');
    if (emailFromQuery) {
      this.form.patchValue({ email: emailFromQuery });
    }
  }

  // مطابقة الباسورد
  passwordMatch(group: FormGroup) {
    return group.get('password')?.value === group.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  // check invalid
  isInvalid(control: string) {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  // get error message
  getError(control: string) {
    const c = this.form.get(control);
    if (!c || !c.errors) return '';

    if (c.errors['required']) return this.translate.instant('register.errors.required');
    if (c.errors['email']) return this.translate.instant('register.errors.email');
    if (c.errors['minlength']) return this.translate.instant('register.errors.minlength');
    if (c.errors['pattern']) return this.translate.instant('register.errors.pattern');
    if (c.errors['mismatch']) return this.translate.instant('register.errors.mismatch');

    return this.translate.instant('register.errors.invalid');
  }

  // submit
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload: RegisterRequest = this.form.value as RegisterRequest;

    this.auth
      .register(payload)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            Swal.fire({
              title: this.translate.instant('register.success.title'),
              text: this.translate.instant('register.success.message'),
              icon: 'success',
              confirmButtonText: this.translate.instant('register.success.confirmButton'),
            }).then(() => {
              this.router.navigate(['/verify'], {
                queryParams: { email: payload.email },
              });
            });
          } else {
            Swal.fire({
              title: this.translate.instant('register.failure.title'),
              text: res.message || this.translate.instant('register.failure.defaultMessage'),
              icon: 'error',
              confirmButtonText: this.translate.instant('register.failure.confirmButton'),
            });
          }
        },
        error: (err) => {
          const message = err?.error?.message || this.translate.instant('register.failure.defaultMessage');
          Swal.fire({
            title: this.translate.instant('register.failure.title'),
            text: message,
            icon: 'error',
            confirmButtonText: this.translate.instant('register.failure.confirmButton'),
          });
        },
      });
  }
}
