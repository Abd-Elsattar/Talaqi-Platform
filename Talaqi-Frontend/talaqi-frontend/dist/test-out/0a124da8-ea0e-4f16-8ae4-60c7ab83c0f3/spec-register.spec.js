import {
  TokenService,
  init_token_service
} from "./chunk-BG5VQJI4.js";
import {
  AuthService,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  init_auth_service,
  init_forms,
  require_sweetalert2_all
} from "./chunk-AGTKZXNS.js";
import {
  Router,
  RouterLink,
  init_http,
  init_router,
  provideHttpClient,
  provideRouter
} from "./chunk-QF45UZN5.js";
import {
  CommonModule,
  init_common
} from "./chunk-RZ5Z6H34.js";
import {
  Component,
  TestBed,
  __decorate,
  init_core,
  init_testing,
  init_tslib_es6,
  inject
} from "./chunk-USG3UEQQ.js";
import {
  __async,
  __commonJS,
  __esm,
  __toESM
} from "./chunk-HBW54YOI.js";

// angular:jit:template:src\app\pages\register\register.html
var register_default;
var init_register = __esm({
  "angular:jit:template:src\\app\\pages\\register\\register.html"() {
    register_default = `<div class="container d-flex justify-content-center align-items-center min-vh-100 bg-light py-5">\r
  <div class="card shadow-lg border-0" style="max-width: 500px; width: 100%; border-radius: 15px;">\r
    <div class="card-body p-4 p-md-5">\r
\r
      <div class="text-center mb-4">\r
        <h2 class="fw-bold text-primary">\u062D\u0633\u0627\u0628 \u062C\u062F\u064A\u062F \u{1F680}</h2>\r
        <p class="text-muted">\u0633\u062C\u0644 \u0628\u064A\u0627\u0646\u0627\u062A\u0643 \u0639\u0634\u0627\u0646 \u062A\u0642\u062F\u0631 \u062A\u0628\u0644\u063A \u0639\u0646 \u0645\u0641\u0642\u0648\u062F\u0627\u062A\u0643</p>\r
      </div>\r
\r
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">\r
\r
        <div class="row g-3">\r
          <div class="col-md-6">\r
            <label class="form-label">\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0623\u0648\u0644</label>\r
            <input type="text" class="form-control" formControlName="firstName"\r
              [class.is-invalid]="f.firstName.invalid && f.firstName.touched" placeholder="\u0623\u062D\u0645\u062F">\r
            <div class="invalid-feedback">\u0645\u0637\u0644\u0648\u0628 (3 \u062D\u0631\u0648\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644)</div>\r
          </div>\r
\r
          <div class="col-md-6">\r
            <label class="form-label">\u0627\u0633\u0645 \u0627\u0644\u0639\u0627\u0626\u0644\u0629</label>\r
            <input type="text" class="form-control" formControlName="lastName"\r
              [class.is-invalid]="f.lastName.invalid && f.lastName.touched" placeholder="\u0639\u0644\u064A">\r
            <div class="invalid-feedback">\u0627\u0633\u0645 \u0627\u0644\u0639\u0627\u0626\u0644\u0629 \u0645\u0637\u0644\u0648\u0628</div>\r
          </div>\r
\r
          <div class="col-12">\r
            <label class="form-label">\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A</label>\r
            <input type="email" class="form-control" formControlName="email"\r
              [class.is-invalid]="f.email.invalid && f.email.touched" placeholder="name@example.com">\r
            <div class="invalid-feedback">\u0628\u0631\u064A\u062F \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u063A\u064A\u0631 \u0635\u062D\u064A\u062D</div>\r
          </div>\r
\r
          <div class="col-12">\r
            <label class="form-label">\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641</label>\r
            <input type="tel" class="form-control" formControlName="phoneNumber"\r
              [class.is-invalid]="f.phoneNumber.invalid && f.phoneNumber.touched" placeholder="01xxxxxxxxx">\r
            <div class="invalid-feedback">\u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D</div>\r
          </div>\r
\r
          <div class="col-12">\r
            <label class="form-label">\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631</label>\r
            <input type="password" class="form-control" formControlName="password"\r
              [class.is-invalid]="f.password.invalid && f.password.touched" placeholder="********">\r
            <div class="invalid-feedback">\u064A\u062C\u0628 \u0623\u0646 \u062A\u0643\u0648\u0646 6 \u0623\u062D\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644</div>\r
          </div>\r
\r
          <div class="col-12">\r
            <label class="form-label">\u062A\u0623\u0643\u064A\u062F \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631</label>\r
            <input type="password" class="form-control" formControlName="confirmPassword"\r
              [class.is-invalid]="f.confirmPassword.invalid && f.confirmPassword.touched" placeholder="********">\r
            <div class="invalid-feedback">\u062A\u0623\u0643\u064A\u062F \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0645\u0637\u0644\u0648\u0628</div>\r
          </div>\r
        </div>\r
\r
        <div class="d-grid mt-4">\r
          <button type="submit" class="btn btn-primary btn-lg" [disabled]="registerForm.invalid || isSubmitting">\r
            {{ isSubmitting ? '\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u0633\u062C\u064A\u0644...' : '\u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062D\u0633\u0627\u0628' }}\r
          </button>\r
        </div>\r
\r
        <div class="text-center mt-3">\r
          <span class="text-muted">\u0644\u062F\u064A\u0643 \u062D\u0633\u0627\u0628 \u0628\u0627\u0644\u0641\u0639\u0644\u061F </span>\r
          <a routerLink="/login" class="text-decoration-none fw-bold">\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644</a>\r
        </div>\r
\r
      </form>\r
    </div>\r
  </div>\r
</div>`;
  }
});

// angular:jit:style:src\app\pages\register\register.css
var register_default2;
var init_register2 = __esm({
  "angular:jit:style:src\\app\\pages\\register\\register.css"() {
    register_default2 = '/* src/app/pages/register/register.css */\n:host {\n  display: block;\n  min-height: calc(100vh - 60px);\n  background:\n    linear-gradient(\n      135deg,\n      #324260 0%,\n      #6C8DB5 100%);\n  position: relative;\n  overflow: hidden;\n}\n:host::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-image:\n    radial-gradient(\n      circle at 20% 50%,\n      rgba(255, 255, 255, 0.1) 0%,\n      transparent 50%),\n    radial-gradient(\n      circle at 80% 80%,\n      rgba(255, 255, 255, 0.1) 0%,\n      transparent 50%);\n  animation: float 20s ease-in-out infinite;\n}\n.container {\n  position: relative;\n  z-index: 1;\n}\n.card {\n  border: 1px solid var(--border);\n  border-radius: var(--radius-2xl);\n  -webkit-backdrop-filter: blur(20px);\n  backdrop-filter: blur(20px);\n  background: rgba(255, 255, 255, 0.98);\n  box-shadow: var(--shadow-2xl);\n  overflow: hidden;\n  animation: fadeInUp 0.6s ease-out;\n}\n.card::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 5px;\n  background: var(--accent);\n}\n.card-body {\n  position: relative;\n}\n.text-center h2 {\n  background:\n    linear-gradient(\n      135deg,\n      var(--primary) 0%,\n      var(--accent) 100%);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n  font-weight: 900;\n  margin-bottom: 0.5rem;\n  animation: slideDown 0.6s ease-out 0.2s both;\n}\n.text-muted {\n  color: var(--text-secondary) !important;\n  animation: fadeIn 0.6s ease-out 0.4s both;\n}\n.form-label {\n  font-weight: 600;\n  color: var(--text-primary);\n  margin-bottom: 0.5rem;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.form-label i {\n  color: var(--accent);\n}\n.form-control {\n  border: 2px solid var(--border);\n  border-radius: var(--radius-lg);\n  padding: 0.75rem 1rem;\n  transition: all var(--transition-base);\n  background: var(--white);\n  color: var(--text-primary);\n}\n.form-control:focus {\n  border-color: var(--accent);\n  box-shadow: 0 0 0 0.25rem rgba(108, 141, 181, 0.15);\n  transform: translateY(-2px);\n}\n.form-control::placeholder {\n  color: var(--text-secondary);\n}\n.invalid-feedback {\n  display: block;\n  margin-top: 0.5rem;\n  color: var(--danger);\n  font-size: 0.875rem;\n  font-weight: 500;\n  animation: shake 0.3s ease-in-out;\n}\n.form-control.is-invalid {\n  border-color: var(--danger);\n  animation: shake 0.3s ease-in-out;\n}\na[routerLink="/forgot-password"] {\n  color: var(--accent);\n  text-decoration: none;\n  font-weight: 600;\n  transition: all var(--transition-base);\n  position: relative;\n}\na[routerLink="/forgot-password"]::after {\n  content: "";\n  position: absolute;\n  bottom: -2px;\n  left: 0;\n  width: 0;\n  height: 2px;\n  background: var(--accent);\n  transition: width var(--transition-base);\n}\na[routerLink="/forgot-password"]:hover {\n  color: var(--accent-dark);\n}\na[routerLink="/forgot-password"]:hover::after {\n  width: 100%;\n}\n.btn-primary {\n  padding: 0.875rem 2rem;\n  font-weight: 700;\n  font-size: 1.05rem;\n  border-radius: var(--radius-lg);\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  position: relative;\n  overflow: hidden;\n  background: var(--accent);\n  border: none;\n}\n.btn-primary::before {\n  content: "";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 0;\n  height: 0;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.3);\n  transform: translate(-50%, -50%);\n  transition: width 0.6s, height 0.6s;\n}\n.btn-primary:hover {\n  background: var(--accent-dark);\n}\n.btn-primary:hover::before {\n  width: 300px;\n  height: 300px;\n}\n.btn-primary:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n  background: var(--accent);\n}\n.text-center a[routerLink="/register"] {\n  color: var(--accent);\n  font-weight: 700;\n  text-decoration: none;\n  position: relative;\n  transition: all var(--transition-base);\n}\n.text-center a[routerLink="/register"]::after {\n  content: "";\n  position: absolute;\n  bottom: -2px;\n  left: 0;\n  right: 0;\n  height: 2px;\n  background: var(--accent);\n  transform: scaleX(0);\n  transition: transform var(--transition-base);\n}\n.text-center a[routerLink="/register"]:hover {\n  color: var(--accent-dark);\n}\n.text-center a[routerLink="/register"]:hover::after {\n  transform: scaleX(1);\n}\n@keyframes shake {\n  0%, 100% {\n    transform: translateX(0);\n  }\n  10%, 30%, 50%, 70%, 90% {\n    transform: translateX(-5px);\n  }\n  20%, 40%, 60%, 80% {\n    transform: translateX(5px);\n  }\n}\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.spinner-border-sm {\n  animation: spin 1s linear infinite;\n}\n@media (max-width: 576px) {\n  .card {\n    border-radius: var(--radius-xl);\n  }\n  .btn-primary {\n    padding: 0.75rem 1.5rem;\n    font-size: 1rem;\n  }\n}\n/*# sourceMappingURL=register.css.map */\n';
  }
});

// src/app/pages/register/register.ts
var import_sweetalert2, Register;
var init_register3 = __esm({
  "src/app/pages/register/register.ts"() {
    "use strict";
    init_tslib_es6();
    init_register();
    init_register2();
    init_core();
    init_common();
    init_forms();
    init_router();
    init_auth_service();
    init_token_service();
    import_sweetalert2 = __toESM(require_sweetalert2_all());
    Register = class Register2 {
      fb = inject(FormBuilder);
      auth = inject(AuthService);
      tokenService = inject(TokenService);
      router = inject(Router);
      isSubmitting = false;
      registerForm = this.fb.group({
        firstName: ["", [Validators.required, Validators.minLength(3)]],
        lastName: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        phoneNumber: ["", [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]]
      });
      onSubmit() {
        if (this.registerForm.invalid) {
          this.registerForm.markAllAsTouched();
          return;
        }
        this.isSubmitting = true;
        const request = this.registerForm.value;
        this.auth.register(request).subscribe({
          next: (res) => {
            this.isSubmitting = false;
            if (res.isSuccess) {
              this.tokenService.saveTokens(res.data);
              import_sweetalert2.default.fire({
                title: "\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062D\u0633\u0627\u0628! \u{1F4E7}",
                text: "\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0643\u0648\u062F \u0627\u0644\u062A\u0641\u0639\u064A\u0644 \u0625\u0644\u0649 \u0628\u0631\u064A\u062F\u0643 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A",
                icon: "success",
                confirmButtonText: "\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062D\u0633\u0627\u0628",
                allowOutsideClick: false,
                allowEscapeKey: false
              }).then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                  this.router.navigateByUrl(`/verify?email=${request.email}`);
                }
              });
            }
          },
          error: (err) => {
            this.isSubmitting = false;
          }
        });
      }
      get f() {
        return this.registerForm.controls;
      }
    };
    Register = __decorate([
      Component({
        selector: "app-register",
        standalone: true,
        imports: [CommonModule, ReactiveFormsModule, RouterLink],
        template: register_default,
        styles: [register_default2]
      })
    ], Register);
  }
});

// src/app/pages/register/register.spec.ts
var require_register_spec = __commonJS({
  "src/app/pages/register/register.spec.ts"(exports) {
    init_testing();
    init_register3();
    init_router();
    init_http();
    describe("Register", () => {
      let component;
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [Register],
          providers: [
            provideRouter([]),
            provideHttpClient()
          ]
        }).compileComponents();
        fixture = TestBed.createComponent(Register);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(component).toBeTruthy();
      });
    });
  }
});
export default require_register_spec();
//# sourceMappingURL=spec-register.spec.js.map
