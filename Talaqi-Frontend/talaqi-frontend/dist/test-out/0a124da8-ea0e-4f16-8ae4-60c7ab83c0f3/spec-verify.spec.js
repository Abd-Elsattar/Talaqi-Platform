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
  ActivatedRoute,
  Router,
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

// angular:jit:template:src\app\pages\verify\verify.html
var verify_default;
var init_verify = __esm({
  "angular:jit:template:src\\app\\pages\\verify\\verify.html"() {
    verify_default = `<div class="container d-flex justify-content-center align-items-center min-vh-100 bg-light">\r
  <!-- \u0627\u0644\u0643\u0627\u0631\u062A \u0627\u0644\u0631\u0626\u064A\u0633\u064A \u0628\u0638\u0644 \u062E\u0641\u064A\u0641 \u0648\u062D\u0648\u0627\u0641 \u062F\u0627\u0626\u0631\u064A\u0629 -->\r
  <div class="card shadow-lg border-0" style="max-width: 450px; width: 100%; border-radius: 16px;">\r
    <div class="card-body p-4 p-md-5 text-center">\r
      \r
      <!-- \u0623\u064A\u0642\u0648\u0646\u0629 \u0642\u0641\u0644 \u062A\u0639\u0628\u064A\u0631\u064A\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A) -->\r
      <div class="mb-4">\r
        <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3">\r
          <i class="bi bi-shield-lock-fill text-primary fs-1"></i>\r
        </div>\r
      </div>\r
\r
      <!-- \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0648\u0627\u0644\u0648\u0635\u0641 -->\r
      <h3 class="fw-bold text-dark mb-2">\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062D\u0633\u0627\u0628 \u{1F510}</h3>\r
      <p class="text-muted mb-4">\r
        \u0644\u0642\u062F \u0623\u0631\u0633\u0644\u0646\u0627 \u0643\u0648\u062F \u062A\u0641\u0639\u064A\u0644 \u0645\u0643\u0648\u0646 \u0645\u0646 6 \u0623\u0631\u0642\u0627\u0645 \u0625\u0644\u0649 \u0628\u0631\u064A\u062F\u0643 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A:<br>\r
        <span class="text-primary fw-bold d-block mt-1">{{ email }}</span>\r
      </p>\r
\r
      <!-- \u0627\u0644\u0641\u0648\u0631\u0645 -->\r
      <form [formGroup]="verifyForm" (ngSubmit)="onSubmit()">\r
        \r
        <div class="mb-4">\r
          <label class="form-label fw-bold text-secondary small text-uppercase">\u0643\u0648\u062F \u0627\u0644\u062A\u0641\u0639\u064A\u0644</label>\r
          \r
          <!-- \u062D\u0642\u0644 \u0627\u0644\u0625\u062F\u062E\u0627\u0644 (\u0628\u062A\u0646\u0633\u064A\u0642 \u062E\u0627\u0635 \u0644\u0644\u0623\u0631\u0642\u0627\u0645) -->\r
          <input type="text" \r
                 class="form-control form-control-lg text-center fw-bold letter-spacing-lg" \r
                 class="form-control form-control-lg text-center fw-bold" \r
                 style="letter-spacing: 0.5em;"\r
                 formControlName="code" \r
                 placeholder="------" \r
                 maxlength="6"\r
                 [class.is-invalid]="verifyForm.get('code')?.invalid && verifyForm.get('code')?.touched">\r
          \r
          <!-- \u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u062E\u0637\u0623 -->\r
          <div class="invalid-feedback mt-2" *ngIf="verifyForm.get('code')?.errors?.['required']">\r
            \u0645\u0646 \u0641\u0636\u0644\u0643 \u0623\u062F\u062E\u0644 \u0627\u0644\u0643\u0648\u062F\r
          </div>\r
          <div class="invalid-feedback mt-2" *ngIf="verifyForm.get('code')?.errors?.['minlength']">\r
            \u0627\u0644\u0643\u0648\u062F \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 6 \u0623\u0631\u0642\u0627\u0645\r
          </div>\r
        </div>\r
\r
        <!-- \u0632\u0631 \u0627\u0644\u062A\u0623\u0643\u064A\u062F -->\r
        <div class="d-grid mb-3">\r
          <button type="submit" class="btn btn-primary btn-lg py-3 rounded-3 shadow-sm" \r
                  [disabled]="verifyForm.invalid || isSubmitting">\r
            <span *ngIf="!isSubmitting">\u062A\u0623\u0643\u064A\u062F \u0648\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062D\u0633\u0627\u0628</span>\r
            <span *ngIf="isSubmitting">\r
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>\r
              \u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0642\u0642...\r
            </span>\r
          </button>\r
        </div>\r
\r
        <!-- \u0631\u0627\u0628\u0637 \u0627\u0644\u0639\u0648\u062F\u0629 \u0623\u0648 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0625\u0631\u0633\u0627\u0644 -->\r
        \r
\r
      </form>\r
      \r
    </div>\r
  </div>\r
</div>`;
  }
});

// angular:jit:style:src\app\pages\verify\verify.css
var verify_default2;
var init_verify2 = __esm({
  "angular:jit:style:src\\app\\pages\\verify\\verify.css"() {
    verify_default2 = "/* src/app/pages/verify/verify.css */\n.letter-spacing-lg {\n  letter-spacing: 0.5em !important;\n  font-size: 1.5rem;\n  background-color: #FFFFFF;\n  border: 2px solid #DDDDDD;\n  color: #324260;\n  transition: all 0.3s ease;\n}\n.letter-spacing-lg:focus {\n  background-color: #FFFFFF;\n  border-color: #6C8DB5;\n  box-shadow: 0 0 0 0.25rem rgba(108, 141, 181, 0.15);\n}\n:host {\n  display: block;\n  background-color: #FFFFFF;\n}\n/*# sourceMappingURL=verify.css.map */\n";
  }
});

// src/app/pages/verify/verify.ts
var import_sweetalert2, Verify;
var init_verify3 = __esm({
  "src/app/pages/verify/verify.ts"() {
    "use strict";
    init_tslib_es6();
    init_verify();
    init_verify2();
    init_core();
    init_common();
    init_forms();
    init_router();
    import_sweetalert2 = __toESM(require_sweetalert2_all());
    init_auth_service();
    Verify = class Verify2 {
      fb = inject(FormBuilder);
      route = inject(ActivatedRoute);
      router = inject(Router);
      auth = inject(AuthService);
      email = "";
      isSubmitting = false;
      verifyForm = this.fb.group({
        code: ["", [Validators.required, Validators.minLength(6)]]
      });
      ngOnInit() {
        this.email = this.route.snapshot.queryParams["email"] || "";
        if (!this.email) {
          this.router.navigate(["/register"]);
        }
      }
      onSubmit() {
        if (this.verifyForm.invalid)
          return;
        this.isSubmitting = true;
        const requestData = {
          email: this.email,
          code: this.verifyForm.get("code")?.value || ""
        };
        this.auth.verifyEmail(requestData).subscribe({
          next: (res) => {
            this.isSubmitting = false;
            if (res.isSuccess) {
              import_sweetalert2.default.fire({
                title: "\u062A\u0645 \u0627\u0644\u062A\u0641\u0639\u064A\u0644 \u0628\u0646\u062C\u0627\u062D! \u{1F680}",
                text: "\u0623\u0647\u0644\u0627\u064B \u0628\u0643 \u0641\u064A \u062A\u0644\u0627\u0642\u064A.. \u064A\u0645\u0643\u0646\u0643 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0627\u0644\u0622\u0646",
                icon: "success",
                confirmButtonText: "\u062F\u062E\u0648\u0644"
              }).then(() => {
                this.router.navigate(["/login"]);
              });
            }
          },
          error: (err) => {
            this.isSubmitting = false;
            import_sweetalert2.default.fire({
              title: "\u0643\u0648\u062F \u062E\u0627\u0637\u0626",
              text: "\u062A\u0623\u0643\u062F \u0645\u0646 \u0643\u062A\u0627\u0628\u0629 \u0627\u0644\u0643\u0648\u062F \u0628\u0634\u0643\u0644 \u0635\u062D\u064A\u062D \u0645\u0646 \u0628\u0631\u064A\u062F\u0643 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A",
              icon: "error",
              confirmButtonText: "\u062D\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649"
            });
          }
        });
      }
    };
    Verify = __decorate([
      Component({
        selector: "app-verify",
        standalone: true,
        imports: [CommonModule, ReactiveFormsModule],
        template: verify_default,
        styles: [verify_default2]
      })
    ], Verify);
  }
});

// src/app/pages/verify/verify.spec.ts
var require_verify_spec = __commonJS({
  "src/app/pages/verify/verify.spec.ts"(exports) {
    init_testing();
    init_verify3();
    init_router();
    init_http();
    describe("Verify", () => {
      let component;
      let fixture;
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [Verify],
          providers: [
            provideRouter([]),
            provideHttpClient()
          ]
        }).compileComponents();
        fixture = TestBed.createComponent(Verify);
        component = fixture.componentInstance;
        fixture.detectChanges();
      }));
      it("should create", () => {
        expect(component).toBeTruthy();
      });
    });
  }
});
export default require_verify_spec();
//# sourceMappingURL=spec-verify.spec.js.map
