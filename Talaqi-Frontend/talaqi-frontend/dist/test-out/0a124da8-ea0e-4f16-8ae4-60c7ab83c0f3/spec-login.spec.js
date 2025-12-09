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

// angular:jit:template:src\app\pages\login\login.html
var login_default;
var init_login = __esm({
  "angular:jit:template:src\\app\\pages\\login\\login.html"() {
    login_default = `<div class="container d-flex justify-content-center align-items-center min-vh-100 bg-light">\r
\r
  <div class="card shadow-lg border-0" style="max-width: 450px; width: 100%; border-radius: 16px;">\r
    <div class="card-body p-4 p-md-5">\r
\r
      <div class="text-center mb-4">\r
        <h2 class="fw-bold text-primary">\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0639\u0648\u062F\u062A\u0643 \u{1F44B}</h2>\r
        <p class="text-muted">\u0633\u062C\u0644 \u062F\u062E\u0648\u0644\u0643 \u0644\u0644\u0645\u062A\u0627\u0628\u0639\u0629</p>\r
      </div>\r
\r
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">\r
\r
        <!-- \u0627\u0644\u0625\u064A\u0645\u064A\u0644 -->\r
        <div class="mb-3">\r
          <label class="form-label">\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A</label>\r
          <input type="email" class="form-control" formControlName="email"\r
            [class.is-invalid]="f.email.invalid && f.email.touched" placeholder="name@example.com">\r
          <div class="invalid-feedback">\u0628\u0631\u064A\u062F \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u063A\u064A\u0631 \u0635\u062D\u064A\u062D</div>\r
        </div>\r
\r
        <!-- \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 -->\r
        <div class="mb-3">\r
          <label class="form-label">\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631</label>\r
          <input type="password" class="form-control" formControlName="password"\r
            [class.is-invalid]="f.password.invalid && f.password.touched" placeholder="********">\r
          <div class="invalid-feedback">\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0645\u0637\u0644\u0648\u0628\u0629</div>\r
        </div>\r
\r
        <!-- \u0646\u0633\u064A\u062A \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 -->\r
        <div class="d-flex justify-content-end mb-4">\r
          <a routerLink="/forgot-password" class="text-decoration-none small">\u0646\u0633\u064A\u062A \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631\u061F</a>\r
        </div>\r
\r
        <!-- \u0632\u0631 \u0627\u0644\u062F\u062E\u0648\u0644 -->\r
        <div class="d-grid mb-3">\r
          <button type="submit" class="btn btn-primary btn-lg" [disabled]="loginForm.invalid || isSubmitting">\r
            {{ isSubmitting ? '\u062C\u0627\u0631\u064A \u0627\u0644\u062F\u062E\u0648\u0644...' : '\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644' }}\r
          </button>\r
        </div>\r
\r
        <!-- \u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u062D\u0633\u0627\u0628 -->\r
        <div class="text-center mt-4">\r
          <span class="text-muted">\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u062D\u0633\u0627\u0628\u061F </span>\r
          <a routerLink="/register" class="text-decoration-none fw-bold">\u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628 \u062C\u062F\u064A\u062F</a>\r
        </div>\r
\r
      </form>\r
\r
    </div>\r
  </div>\r
</div>`;
  }
});

// angular:jit:style:src\app\pages\login\login.css
var login_default2;
var init_login2 = __esm({
  "angular:jit:style:src\\app\\pages\\login\\login.css"() {
    login_default2 = '/* src/app/pages/login/login.css */\n:host {\n  display: block;\n  min-height: calc(100vh - 60px);\n  background:\n    linear-gradient(\n      135deg,\n      #324260 0%,\n      #6C8DB5 100%);\n  position: relative;\n  overflow: hidden;\n}\n:host::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-image:\n    radial-gradient(\n      circle at 20% 50%,\n      rgba(255, 255, 255, 0.1) 0%,\n      transparent 50%),\n    radial-gradient(\n      circle at 80% 80%,\n      rgba(255, 255, 255, 0.1) 0%,\n      transparent 50%);\n  animation: float 20s ease-in-out infinite;\n}\n.container {\n  position: relative;\n  z-index: 1;\n}\n.card {\n  border: 1px solid var(--border);\n  border-radius: var(--radius-2xl);\n  -webkit-backdrop-filter: blur(20px);\n  backdrop-filter: blur(20px);\n  background: rgba(255, 255, 255, 0.98);\n  box-shadow: var(--shadow-2xl);\n  overflow: hidden;\n  animation: fadeInUp 0.6s ease-out;\n}\n.card::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 5px;\n  background: var(--accent);\n}\n.card-body {\n  position: relative;\n}\n.text-center h2 {\n  background:\n    linear-gradient(\n      135deg,\n      var(--primary) 0%,\n      var(--accent) 100%);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n  font-weight: 900;\n  margin-bottom: 0.5rem;\n  animation: slideDown 0.6s ease-out 0.2s both;\n}\n.text-muted {\n  color: var(--text-secondary) !important;\n  animation: fadeIn 0.6s ease-out 0.4s both;\n}\n.form-label {\n  font-weight: 600;\n  color: var(--text-primary);\n  margin-bottom: 0.5rem;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.form-label i {\n  color: var(--accent);\n}\n.form-control {\n  border: 2px solid var(--border);\n  border-radius: var(--radius-lg);\n  padding: 0.75rem 1rem;\n  transition: all var(--transition-base);\n  background: var(--white);\n  color: var(--text-primary);\n}\n.form-control:focus {\n  border-color: var(--accent);\n  box-shadow: 0 0 0 0.25rem rgba(108, 141, 181, 0.15);\n  transform: translateY(-2px);\n}\n.form-control::placeholder {\n  color: var(--text-secondary);\n}\n.invalid-feedback {\n  display: block;\n  margin-top: 0.5rem;\n  color: var(--danger);\n  font-size: 0.875rem;\n  font-weight: 500;\n  animation: shake 0.3s ease-in-out;\n}\n.form-control.is-invalid {\n  border-color: var(--danger);\n  animation: shake 0.3s ease-in-out;\n}\na[routerLink="/forgot-password"] {\n  color: var(--accent);\n  text-decoration: none;\n  font-weight: 600;\n  transition: all var(--transition-base);\n  position: relative;\n}\na[routerLink="/forgot-password"]::after {\n  content: "";\n  position: absolute;\n  bottom: -2px;\n  left: 0;\n  width: 0;\n  height: 2px;\n  background: var(--accent);\n  transition: width var(--transition-base);\n}\na[routerLink="/forgot-password"]:hover {\n  color: var(--accent-dark);\n}\na[routerLink="/forgot-password"]:hover::after {\n  width: 100%;\n}\n.btn-primary {\n  padding: 0.875rem 2rem;\n  font-weight: 700;\n  font-size: 1.05rem;\n  border-radius: var(--radius-lg);\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  position: relative;\n  overflow: hidden;\n  background: var(--accent);\n  border: none;\n}\n.btn-primary::before {\n  content: "";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 0;\n  height: 0;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.3);\n  transform: translate(-50%, -50%);\n  transition: width 0.6s, height 0.6s;\n}\n.btn-primary:hover {\n  background: var(--accent-dark);\n}\n.btn-primary:hover::before {\n  width: 300px;\n  height: 300px;\n}\n.btn-primary:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n  background: var(--accent);\n}\n.text-center a[routerLink="/register"] {\n  color: var(--accent);\n  font-weight: 700;\n  text-decoration: none;\n  position: relative;\n  transition: all var(--transition-base);\n}\n.text-center a[routerLink="/register"]::after {\n  content: "";\n  position: absolute;\n  bottom: -2px;\n  left: 0;\n  right: 0;\n  height: 2px;\n  background: var(--accent);\n  transform: scaleX(0);\n  transition: transform var(--transition-base);\n}\n.text-center a[routerLink="/register"]:hover {\n  color: var(--accent-dark);\n}\n.text-center a[routerLink="/register"]:hover::after {\n  transform: scaleX(1);\n}\n@keyframes shake {\n  0%, 100% {\n    transform: translateX(0);\n  }\n  10%, 30%, 50%, 70%, 90% {\n    transform: translateX(-5px);\n  }\n  20%, 40%, 60%, 80% {\n    transform: translateX(5px);\n  }\n}\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.spinner-border-sm {\n  animation: spin 1s linear infinite;\n}\n@media (max-width: 576px) {\n  .card {\n    border-radius: var(--radius-xl);\n  }\n  .btn-primary {\n    padding: 0.75rem 1.5rem;\n    font-size: 1rem;\n  }\n}\n/*# sourceMappingURL=login.css.map */\n';
  }
});

// src/app/pages/login/login.ts
var import_sweetalert2, Login;
var init_login3 = __esm({
  "src/app/pages/login/login.ts"() {
    "use strict";
    init_tslib_es6();
    init_login();
    init_login2();
    init_core();
    init_common();
    init_forms();
    init_router();
    init_auth_service();
    init_token_service();
    import_sweetalert2 = __toESM(require_sweetalert2_all());
    Login = class Login2 {
      fb = inject(FormBuilder);
      auth = inject(AuthService);
      tokenService = inject(TokenService);
      router = inject(Router);
      isSubmitting = false;
      // فورم الدخول
      loginForm = this.fb.group({
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required]]
      });
      onSubmit() {
        if (this.loginForm.invalid) {
          this.loginForm.markAllAsTouched();
          return;
        }
        this.isSubmitting = true;
        const credentials = {
          email: this.loginForm.get("email")?.value || "",
          password: this.loginForm.get("password")?.value || ""
        };
        this.auth.login(credentials).subscribe({
          next: (res) => {
            this.isSubmitting = false;
            if (res.isSuccess) {
              this.tokenService.saveTokens(res.data);
              import_sweetalert2.default.fire({
                title: "\u0623\u0647\u0644\u0627\u064B \u0628\u0643! \u{1F44B}",
                text: "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0628\u0646\u062C\u0627\u062D",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
              }).then(() => {
                this.router.navigate(["/home"]);
              });
            }
          },
          error: (err) => {
            this.isSubmitting = false;
          }
        });
      }
      get f() {
        return this.loginForm.controls;
      }
    };
    Login = __decorate([
      Component({
        selector: "app-login",
        standalone: true,
        imports: [CommonModule, ReactiveFormsModule, RouterLink],
        template: login_default,
        styles: [login_default2]
      })
    ], Login);
  }
});

// src/app/pages/login/login.spec.ts
var require_login_spec = __commonJS({
  "src/app/pages/login/login.spec.ts"(exports) {
    init_testing();
    init_login3();
    init_router();
    init_http();
    describe("Login", () => {
      let component;
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [Login],
          providers: [
            provideRouter([]),
            provideHttpClient()
          ]
        }).compileComponents();
        fixture = TestBed.createComponent(Login);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(component).toBeTruthy();
      });
    });
  }
});
export default require_login_spec();
//# sourceMappingURL=spec-login.spec.js.map
