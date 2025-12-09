import {
  TokenService,
  init_token_service
} from "./chunk-BG5VQJI4.js";
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
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
  inject,
  signal
} from "./chunk-USG3UEQQ.js";
import {
  __async,
  __commonJS,
  __esm
} from "./chunk-HBW54YOI.js";

// angular:jit:template:src\app\app.html
var app_default;
var init_app = __esm({
  "angular:jit:template:src\\app\\app.html"() {
    app_default = "<app-navbar />\r\n<router-outlet />\r\n<app-footer />";
  }
});

// angular:jit:style:src\app\app.css
var app_default2;
var init_app2 = __esm({
  "angular:jit:style:src\\app\\app.css"() {
    app_default2 = "/* src/app/app.css */\n/*# sourceMappingURL=app.css.map */\n";
  }
});

// angular:jit:template:src\app\shared\navbar\navbar.html
var navbar_default;
var init_navbar = __esm({
  "angular:jit:template:src\\app\\shared\\navbar\\navbar.html"() {
    navbar_default = `<nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
    <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center" routerLink="/home">
            <img src="images/logo.png" alt="\u062A\u0644\u0627\u0642\u064A Logo" class="navbar-logo me-2">
            <span class="brand-name">\u062A\u0644\u0627\u0642\u064A</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
            <ul class="navbar-nav mx-auto">
                <ng-container *ngIf="isAdmin()">
                    <li class="nav-item">
                        <a class="nav-link" (click)="navigateToAdminSection('statistics')"
                            [class.active]="activeAdminSection === 'statistics'" style="cursor: pointer;">
                            <i class="bi bi-graph-up me-1"></i>
                            \u0627\u0644\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u0627\u0644\u0639\u0627\u0645\u0629
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" (click)="navigateToAdminSection('users')"
                            [class.active]="activeAdminSection === 'users'" style="cursor: pointer;">
                            <i class="bi bi-people me-1"></i>
                            \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" (click)="navigateToAdminSection('items')"
                            [class.active]="activeAdminSection === 'items'" style="cursor: pointer;">
                            <i class="bi bi-box me-1"></i>
                            \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0639\u0646\u0627\u0635\u0631
                        </a>
                    </li>
                </ng-container>
                <ng-container *ngIf="currentUser && !isAdmin()">
                    <li class="nav-item">
                        <a class="nav-link" routerLink="/home" routerLinkActive="active"
                            [routerLinkActiveOptions]="{exact: true}">
                            <i class="bi bi-house-door me-1"></i>
                            \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" (click)="navigateToMyLostItems()" style="cursor: pointer;"
                            [class.active]="isActive('/my-lost-items')">
                            <i class="bi bi-search me-1"></i>
                            \u0627\u0644\u0645\u0641\u0642\u0648\u062F\u0627\u062A
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" routerLink="/found-items" routerLinkActive="active">
                            <i class="bi bi-box-seam me-1"></i>
                            \u0627\u0644\u0645\u0648\u062C\u0648\u062F\u0627\u062A
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" routerLink="/ai-matches" routerLinkActive="active">
                            <i class="bi bi-cpu me-1"></i>
                            \u0645\u062A\u0637\u0627\u0628\u0642\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A
                        </a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" (click)="toggleReportDropdown()" id="reportDropdown"
                            role="button" [class.show]="isReportDropdownOpen" aria-expanded="false"
                            style="cursor: pointer;">
                            <i class="bi bi-plus-circle me-1"></i>
                            \u0627\u0644\u0627\u0628\u0644\u0627\u063A \u0639\u0646 \u0627\u0644\u0639\u0646\u0627\u0635\u0631
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" [class.show]="isReportDropdownOpen"
                            aria-labelledby="reportDropdown">
                            <li>
                                <a class="dropdown-item" routerLink="/report-lost-item" (click)="closeDropdown()">
                                    <i class="bi bi-exclamation-circle text-danger me-2"></i>
                                    \u0627\u0644\u0627\u0628\u0644\u0627\u063A \u0639\u0646 \u0627\u0644\u0639\u0646\u0627\u0635\u0631 \u0627\u0644\u0645\u0641\u0642\u0648\u062F\u0629
                                </a>
                            </li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li>
                                <a class="dropdown-item" routerLink="/report-found-item" (click)="closeDropdown()">
                                    <i class="bi bi-check-circle text-success me-2"></i>
                                    \u0627\u0644\u0627\u0628\u0644\u0627\u063A \u0639\u0646 \u0627\u0644\u0639\u0646\u0627\u0635\u0631 \u0627\u0644\u0645\u0648\u062C\u0648\u062F\u0629
                                </a>
                            </li>
                        </ul>
                    </li>
                </ng-container>
            </ul>
            <div class="user-dropdown" *ngIf="currentUser">
                <div class="profile-trigger" (click)="toggleDropdown()">
                    <img [src]="getProfilePictureUrl()" alt="User Profile" class="profile-image">
                    <span class="user-name d-none d-lg-inline me-2">{{ currentUser.firstName }}</span>
                    <i class="bi bi-chevron-down"></i>
                </div>
                <div class="dropdown-menu" [class.show]="isDropdownOpen" (click)="closeDropdown()">
                    <a class="dropdown-item" routerLink="/edit-profile">
                        <i class="bi bi-person-gear me-2"></i>
                        \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A
                    </a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item text-danger" (click)="logout()">
                        <i class="bi bi-box-arrow-right me-2"></i>
                        \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C
                    </a>
                </div>
            </div>
            <div class="auth-buttons" *ngIf="!currentUser">
                <a class="btn btn-outline-primary me-2" routerLink="/login">\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644</a>
                <a class="btn btn-primary" routerLink="/register">\u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628</a>
            </div>
        </div>
    </div>
</nav>
<div class="dropdown-backdrop" *ngIf="isDropdownOpen || isReportDropdownOpen" (click)="closeDropdown()"></div>`;
  }
});

// angular:jit:style:src\app\shared\navbar\navbar.css
var navbar_default2;
var init_navbar2 = __esm({
  "angular:jit:style:src\\app\\shared\\navbar\\navbar.css"() {
    navbar_default2 = `/* src/app/shared/navbar/navbar.css */
.navbar {
  padding: 0.75rem 0;
  background: var(--primary) !important;
  box-shadow: var(--shadow-md);
  border-bottom: none;
  position: sticky;
  top: 0;
  z-index: 1030;
  transition: all var(--transition-base);
}
.navbar.scrolled {
  box-shadow: var(--shadow-lg);
  padding: 0.5rem 0;
}
.navbar-brand {
  transition: transform var(--transition-base);
}
.navbar-brand:hover {
  transform: scale(1.05);
}
.navbar-logo {
  height: 45px;
  width: auto;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
  transition: filter var(--transition-base);
}
.navbar-logo:hover {
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.5));
}
.brand-name {
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--text-light);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}
.nav-link {
  font-weight: 500;
  padding: 0.5rem 1rem;
  color: rgba(255, 255, 255, 0.9) !important;
  transition: all var(--transition-base);
  position: relative;
  border-radius: var(--radius-md);
}
.nav-link::before {
  content: "";
  position: absolute;
  bottom: 0;
  right: 50%;
  left: 50%;
  height: 2px;
  background: var(--accent-light);
  transition: all var(--transition-base);
  opacity: 0;
}
.nav-link:hover {
  color: var(--text-light) !important;
  background: rgba(108, 141, 181, 0.15);
  transform: translateY(-2px);
}
.nav-link:hover::before {
  right: 10%;
  left: 10%;
  opacity: 1;
}
.nav-link.active {
  color: var(--text-light) !important;
  font-weight: 700;
  background: rgba(108, 141, 181, 0.2);
}
.nav-link.active::before {
  right: 10%;
  left: 10%;
  opacity: 1;
}
.nav-link i {
  font-size: 1.1rem;
  margin-left: 0.25rem;
}
.nav-link.dropdown-toggle {
  background: rgba(108, 141, 181, 0.15);
}
.nav-link.dropdown-toggle.show {
  background: rgba(108, 141, 181, 0.25);
}
.user-dropdown {
  position: relative;
}
.profile-trigger {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.4rem 1rem;
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
  background: rgba(108, 141, 181, 0.15);
}
.profile-trigger:hover {
  background: rgba(108, 141, 181, 0.3);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}
.profile-image {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--text-light);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  transition: all var(--transition-base);
}
.profile-trigger:hover .profile-image {
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}
.user-name {
  font-weight: 600;
  color: var(--text-light);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.profile-trigger i {
  color: var(--text-light);
  transition: transform var(--transition-base);
}
.profile-trigger:hover i {
  transform: rotate(180deg);
}
.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.75rem);
  right: 0;
  margin-top: 0;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  min-width: 220px;
  z-index: 1000;
  display: none;
  opacity: 0;
  transform: translateY(-10px);
  transition: all var(--transition-base);
  overflow: hidden;
}
.dropdown-menu.show {
  display: block;
  opacity: 1;
  transform: translateY(0);
  animation: slideDown var(--transition-slow) ease-out;
}
.dropdown-item {
  padding: 0.85rem 1.25rem;
  display: flex;
  align-items: center;
  color: var(--text-primary);
  text-decoration: none;
  transition: all var(--transition-fast);
  cursor: pointer;
  font-weight: 500;
}
.dropdown-item i {
  font-size: 1.1rem;
  margin-left: 0.5rem;
  color: var(--text-secondary);
  transition: color var(--transition-fast);
}
.dropdown-item:hover {
  background: var(--gray-50);
  color: var(--accent);
  transform: translateX(-3px);
}
.dropdown-item:hover i {
  color: var(--accent);
}
.dropdown-item.text-danger {
  color: var(--danger);
}
.dropdown-item.text-danger:hover {
  background: #fff5f5;
  color: var(--danger-light);
}
.dropdown-item.text-danger:hover i {
  color: var(--danger-light);
}
.dropdown-divider {
  height: 0;
  margin: 0.5rem 0;
  overflow: hidden;
  border-top: 1px solid var(--border);
}
.dropdown-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background: transparent;
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
}
.auth-buttons {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}
.auth-buttons .btn {
  font-weight: 600;
  border-radius: var(--radius-full);
  padding: 0.5rem 1.5rem;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}
.auth-buttons .btn-outline-primary {
  background: transparent;
  border: 2px solid var(--text-light);
  color: var(--text-light);
}
.auth-buttons .btn-outline-primary:hover {
  background: var(--text-light);
  color: var(--primary);
  border-color: var(--text-light);
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}
.auth-buttons .btn-primary {
  background: var(--accent);
  color: var(--text-light);
  border: none;
}
.auth-buttons .btn-primary:hover {
  background: var(--accent-dark);
  color: var(--text-light);
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}
.navbar-toggler {
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-md);
  padding: 0.5rem;
  transition: all var(--transition-base);
}
.navbar-toggler:hover {
  border-color: var(--text-light);
  background: rgba(108, 141, 181, 0.15);
}
.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}
@media (max-width: 991px) {
  .navbar-nav {
    margin-top: 1rem;
    background: rgba(108, 141, 181, 0.1);
    border-radius: var(--radius-lg);
    padding: 0.5rem;
  }
  .user-dropdown {
    margin-top: 1rem;
  }
  .auth-buttons {
    margin-top: 1rem;
    flex-direction: column;
    width: 100%;
  }
  .auth-buttons .btn {
    width: 100%;
  }
  .dropdown-menu {
    position: static;
    box-shadow: none;
    border: none;
    margin-top: 0.5rem;
    background: rgba(255, 255, 255, 0.95);
  }
  .profile-trigger {
    justify-content: center;
  }
}
@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.navbar-collapse.show .nav-item {
  animation: slideInFromTop var(--transition-slow) ease-out;
}
/*# sourceMappingURL=navbar.css.map */
`;
  }
});

// src/app/shared/navbar/navbar.ts
var Navbar;
var init_navbar3 = __esm({
  "src/app/shared/navbar/navbar.ts"() {
    "use strict";
    init_tslib_es6();
    init_navbar();
    init_navbar2();
    init_core();
    init_common();
    init_router();
    init_token_service();
    Navbar = class Navbar2 {
      tokenService = inject(TokenService);
      router = inject(Router);
      userSubscription;
      currentUser = null;
      isDropdownOpen = false;
      isReportDropdownOpen = false;
      defaultProfilePicture = "images/Default User Icon.jpg";
      // Admin navigation tracking
      activeAdminSection = "statistics";
      ngOnInit() {
        this.userSubscription = this.tokenService.currentUser$.subscribe((user) => {
          this.currentUser = user;
        });
      }
      ngOnDestroy() {
        this.userSubscription?.unsubscribe();
      }
      getProfilePictureUrl() {
        return this.currentUser?.profilePictureUrl || this.defaultProfilePicture;
      }
      isAdmin() {
        return this.tokenService.isAdmin();
      }
      navigateToAdminSection(section) {
        this.activeAdminSection = section;
        this.router.navigate(["/admin-panel"], { queryParams: { section } });
      }
      toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
        if (this.isDropdownOpen)
          this.isReportDropdownOpen = false;
      }
      toggleReportDropdown() {
        this.isReportDropdownOpen = !this.isReportDropdownOpen;
        if (this.isReportDropdownOpen)
          this.isDropdownOpen = false;
      }
      closeDropdown() {
        this.isDropdownOpen = false;
        this.isReportDropdownOpen = false;
      }
      navigateToMyLostItems() {
        this.router.navigate(["/my-lost-items"]);
      }
      isActive(route) {
        return this.router.url === route;
      }
      logout() {
        this.tokenService.clearTokens();
        this.closeDropdown();
        this.router.navigate(["/home"]);
      }
    };
    Navbar = __decorate([
      Component({
        selector: "app-navbar",
        standalone: true,
        imports: [CommonModule, RouterLink, RouterLinkActive],
        template: navbar_default,
        styles: [navbar_default2]
      })
    ], Navbar);
  }
});

// angular:jit:template:src\app\shared\footer\footer.html
var footer_default;
var init_footer = __esm({
  "angular:jit:template:src\\app\\shared\\footer\\footer.html"() {
    footer_default = `<footer class="footer">\r
    <div class="container py-5">\r
        <div class="row g-4">\r
            <!-- Brand Section -->\r
            <div class="col-lg-4 col-md-6">\r
                <div class="footer-brand">\r
                    <div class="d-flex align-items-center mb-3">\r
                        <img src="images/logo.png" alt="\u062A\u0644\u0627\u0642\u064A Logo" class="footer-logo me-2">\r
                        <h3 class="brand-title gradient-text mb-0">\u062A\u0644\u0627\u0642\u064A</h3>\r
                    </div>\r
                    <p class="footer-description">\r
                        \u0645\u0646\u0635\u0629 \u0645\u0648\u062D\u062F\u0629 \u0644\u0645\u0633\u0627\u0639\u062F\u0629 \u0627\u0644\u0646\u0627\u0633 \u0639\u0644\u0649 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0627\u0644\u0623\u0634\u064A\u0627\u0621 \u0627\u0644\u0645\u0641\u0642\u0648\u062F\u0629 \u0648\u0625\u0639\u0627\u062F\u062A\u0647\u0627 \u0644\u0623\u0635\u062D\u0627\u0628\u0647\u0627.\r
                        \u0646\u0633\u062A\u062E\u062F\u0645 \u062A\u0642\u0646\u064A\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0644\u0645\u0637\u0627\u0628\u0642\u0629 \u0627\u0644\u0639\u0646\u0627\u0635\u0631 \u0627\u0644\u0645\u0641\u0642\u0648\u062F\u0629 \u0648\u0627\u0644\u0645\u0648\u062C\u0648\u062F\u0629.\r
                    </p>\r
                    <!-- Social Links -->\r
                    <div class="social-links">\r
                        <a *ngFor="let social of socialLinks" [href]="social.url" [title]="social.name"\r
                            class="social-icon" target="_blank" rel="noopener noreferrer">\r
                            <i [class]="'bi ' + social.icon"></i>\r
                        </a>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <!-- Quick Links -->\r
            <div class="col-lg-2 col-md-6">\r
                <h4 class="footer-heading">\u0631\u0648\u0627\u0628\u0637 \u0633\u0631\u064A\u0639\u0629</h4>\r
                <ul class="footer-links">\r
                    <li *ngFor="let link of quickLinks">\r
                        <a [routerLink]="link.route" class="footer-link">\r
                            <i class="bi bi-chevron-left me-2"></i>\r
                            {{ link.label }}\r
                        </a>\r
                    </li>\r
                </ul>\r
            </div>\r
\r
            <!-- Help & Support -->\r
            <div class="col-lg-3 col-md-6">\r
                <h4 class="footer-heading">\u0627\u0644\u0645\u0633\u0627\u0639\u062F\u0629 \u0648\u0627\u0644\u062F\u0639\u0645</h4>\r
                <ul class="footer-links">\r
                    <li *ngFor="let link of helpLinks">\r
                        <a [routerLink]="link.route" class="footer-link">\r
                            <i class="bi bi-chevron-left me-2"></i>\r
                            {{ link.label }}\r
                        </a>\r
                    </li>\r
                </ul>\r
            </div>\r
\r
            <!-- Contact Info -->\r
            <div class="col-lg-3 col-md-6">\r
                <h4 class="footer-heading">\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627</h4>\r
                <ul class="footer-contact">\r
                    <li class="contact-item">\r
                        <i class="bi bi-envelope-fill"></i>\r
                        <a href="mailto:talaqiteam@gmail.com">talaqiteam@gmail.com</a>\r
                    </li>\r
                    <li class="contact-item">\r
                        <i class="bi bi-telephone-fill"></i>\r
                        <a href="tel:+201007460135">01007460135</a>\r
                    </li>\r
                    <li class="contact-item">\r
                        <i class="bi bi-geo-alt-fill"></i>\r
                        <span>\u0627\u0644\u0645\u0646\u0635\u0648\u0631\u0629\u060C \u0645\u0635\u0631</span>\r
                    </li>\r
                </ul>\r
            </div>\r
        </div>\r
\r
        <!-- Divider -->\r
        <hr class="footer-divider">\r
\r
        <!-- Bottom Bar -->\r
        <div class="footer-bottom">\r
            <div class="row align-items-center">\r
                <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">\r
                    <p class="copyright mb-0">\r
                        \xA9 {{ currentYear }} <span class="gradient-text">\u062A\u0644\u0627\u0642\u064A</span>. \u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629.\r
                    </p>\r
                </div>\r
                <div class="col-md-6 text-center text-md-end">\r
                    <div class="footer-legal-links">\r
                        <a routerLink="/privacy-policy" class="legal-link">\u0633\u064A\u0627\u0633\u0629 \u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629</a>\r
                        <span class="separator">|</span>\r
                        <a routerLink="/terms-of-service" class="legal-link">\u0634\u0631\u0648\u0637 \u0627\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645</a>\r
                        <span class="separator">|</span>\r
                        <a routerLink="/cookie-policy" class="legal-link">\u0633\u064A\u0627\u0633\u0629 \u0627\u0644\u0643\u0648\u0643\u064A\u0632</a>\r
                    </div>\r
                </div>\r
            </div>\r
        </div>\r
    </div>\r
\r
    <!-- Scroll to Top Button -->\r
    <button class="scroll-to-top" (click)="scrollToTop()" title="\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0623\u0639\u0644\u0649">\r
        <i class="bi bi-arrow-up"></i>\r
    </button>\r
</footer>`;
  }
});

// angular:jit:style:src\app\shared\footer\footer.css
var footer_default2;
var init_footer2 = __esm({
  "angular:jit:style:src\\app\\shared\\footer\\footer.css"() {
    footer_default2 = `/* src/app/shared/footer/footer.css */
.footer {
  background: var(--primary);
  color: var(--text-light);
  margin-top: auto;
  position: relative;
  overflow: hidden;
  border-top: 3px solid var(--accent);
}
.footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
  pointer-events: none;
}
.container {
  position: relative;
  z-index: 1;
}
.footer-brand {
  padding-left: 1rem;
}
.footer-logo {
  height: 45px;
  width: auto;
  filter: brightness(0) invert(1);
}
.brand-title {
  font-size: 2rem;
  font-weight: 900;
  color: var(--text-light);
}
.footer-description {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
  margin-bottom: 1.5rem;
  max-width: 350px;
}
.social-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(108, 141, 181, 0.2);
  color: var(--text-light);
  text-decoration: none;
  transition: all var(--transition-base);
  font-size: 1.1rem;
  border: 2px solid transparent;
}
.social-icon:hover {
  background: var(--accent);
  transform: translateY(-5px) scale(1.1);
  box-shadow: 0 5px 15px rgba(108, 141, 181, 0.4);
  border-color: var(--accent-light);
}
.footer-heading {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-light);
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.75rem;
}
.footer-heading::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  width: 50px;
  height: 3px;
  background: var(--accent);
  border-radius: var(--radius-full);
}
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-links li {
  margin-bottom: 0.75rem;
}
.footer-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: all var(--transition-base);
  display: inline-flex;
  align-items: center;
  font-weight: 500;
}
.footer-link i {
  font-size: 0.75rem;
  opacity: 0;
  transform: translateX(5px);
  transition: all var(--transition-base);
}
.footer-link:hover {
  color: var(--accent-light);
  transform: translateX(-5px);
}
.footer-link:hover i {
  opacity: 1;
  transform: translateX(0);
}
.footer-contact {
  list-style: none;
  padding: 0;
  margin: 0;
}
.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.85);
}
.contact-item i {
  font-size: 1.25rem;
  color: var(--accent-light);
  min-width: 24px;
}
.contact-item a {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: color var(--transition-base);
}
.contact-item a:hover {
  color: var(--accent-light);
}
.footer-divider {
  margin: 2rem 0;
  border: none;
  height: 1px;
  background:
    linear-gradient(
      to left,
      transparent,
      rgba(108, 141, 181, 0.3),
      transparent);
}
.footer-bottom {
  padding: 1rem 0;
}
.copyright {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.95rem;
}
.footer-legal-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.legal-link {
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color var(--transition-base);
}
.legal-link:hover {
  color: var(--accent-light);
}
.separator {
  color: rgba(255, 255, 255, 0.3);
}
.scroll-to-top {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--text-light);
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-base);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.scroll-to-top:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-xl);
  background: var(--accent-dark);
}
.scroll-to-top:active {
  transform: translateY(-2px);
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.footer {
  animation: fadeInUp 0.6s ease-out;
}
@media (max-width: 768px) {
  .footer-brand {
    text-align: center;
    padding-left: 0;
    margin-bottom: 2rem;
  }
  .footer-description {
    max-width: 100%;
  }
  .social-links {
    justify-content: center;
  }
  .footer-heading::after {
    right: 50%;
    transform: translateX(50%);
  }
  .footer-links,
  .footer-contact {
    text-align: center;
  }
  .footer-link {
    justify-content: center;
  }
  .contact-item {
    justify-content: center;
  }
  .footer-legal-links {
    flex-direction: column;
    gap: 0.5rem;
  }
  .separator {
    display: none;
  }
  .scroll-to-top {
    bottom: 1.5rem;
    left: 1.5rem;
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
}
/*# sourceMappingURL=footer.css.map */
`;
  }
});

// src/app/shared/footer/footer.ts
var FooterComponent;
var init_footer3 = __esm({
  "src/app/shared/footer/footer.ts"() {
    "use strict";
    init_tslib_es6();
    init_footer();
    init_footer2();
    init_core();
    init_common();
    init_router();
    FooterComponent = class FooterComponent2 {
      currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      socialLinks = [
        { name: "Facebook", icon: "bi-facebook", url: "https://www.facebook.com/profile.php?id=61584479934710" },
        { name: "Twitter", icon: "bi-twitter-x", url: "https://x.com/Talaqiteam" },
        { name: "Instagram", icon: "bi-instagram", url: "https://www.instagram.com/talaqinode/" },
        { name: "LinkedIn", icon: "bi-linkedin", url: "https://www.linkedin.com/in/talaqi-team-015996392/" }
      ];
      quickLinks = [
        { label: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", route: "/home" },
        { label: "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644", route: "/login" },
        { label: "\u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628", route: "/register" }
      ];
      helpLinks = [
        { label: "\u0643\u064A\u0641 \u064A\u0639\u0645\u0644\u061F", route: "/how-it-works" },
        { label: "\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629", route: "/faq" },
        { label: "\u0627\u062A\u0635\u0644 \u0628\u0646\u0627", route: "/contact" }
      ];
      scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    FooterComponent = __decorate([
      Component({
        selector: "app-footer",
        imports: [CommonModule, RouterModule],
        template: footer_default,
        styles: [footer_default2]
      })
    ], FooterComponent);
  }
});

// src/app/app.ts
var App;
var init_app3 = __esm({
  "src/app/app.ts"() {
    "use strict";
    init_tslib_es6();
    init_app();
    init_app2();
    init_core();
    init_router();
    init_navbar3();
    init_footer3();
    App = class App2 {
      title = signal("template");
    };
    App = __decorate([
      Component({
        selector: "app-root",
        imports: [RouterOutlet, Navbar, FooterComponent],
        template: app_default,
        styles: [app_default2]
      })
    ], App);
  }
});

// src/app/app.spec.ts
var require_app_spec = __commonJS({
  "src/app/app.spec.ts"(exports) {
    init_testing();
    init_app3();
    init_router();
    init_http();
    describe("App", () => {
      beforeEach(() => __async(null, null, function* () {
        yield TestBed.configureTestingModule({
          imports: [App],
          providers: [
            provideRouter([]),
            provideHttpClient()
          ]
        }).compileComponents();
      }));
      it("should create the app", () => {
        const fixture = TestBed.createComponent(App);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
      });
      it("should render title", () => {
        const fixture = TestBed.createComponent(App);
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(compiled.querySelector("app-navbar")).toBeTruthy();
      });
    });
  }
});
export default require_app_spec();
//# sourceMappingURL=spec-app.spec.js.map
