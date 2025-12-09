import {
  BehaviorSubject,
  Injectable,
  __decorate,
  init_core,
  init_esm,
  init_tslib_es6
} from "./chunk-USG3UEQQ.js";
import {
  __esm
} from "./chunk-HBW54YOI.js";

// src/app/core/services/token.service.ts
var TokenService;
var init_token_service = __esm({
  "src/app/core/services/token.service.ts"() {
    "use strict";
    init_tslib_es6();
    init_core();
    init_esm();
    TokenService = class TokenService2 {
      ACCESS_TOKEN_KEY = "access_token";
      REFRESH_TOKEN_KEY = "refresh_token";
      TOKEN_EXPIRES_AT_KEY = "token_expires_at";
      USER_KEY = "user";
      currentUserSubject = new BehaviorSubject(this.getStoredUser());
      currentUser$ = this.currentUserSubject.asObservable();
      constructor() {
      }
      getAccessToken() {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
      }
      getRefreshToken() {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
      }
      getTokenExpiresAt() {
        return localStorage.getItem(this.TOKEN_EXPIRES_AT_KEY);
      }
      getStoredUser() {
        const userJson = localStorage.getItem(this.USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
      }
      saveTokens(authResponse) {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, authResponse.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refreshToken);
        localStorage.setItem(this.TOKEN_EXPIRES_AT_KEY, authResponse.expiresAt);
        localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
        this.currentUserSubject.next(authResponse.user);
      }
      clearTokens() {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.TOKEN_EXPIRES_AT_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
      }
      isAuthenticated() {
        const token = this.getAccessToken();
        const expiresAt = this.getTokenExpiresAt();
        if (!token || !expiresAt) {
          return false;
        }
        const expirationDate = new Date(expiresAt);
        return expirationDate > /* @__PURE__ */ new Date();
      }
      isTokenExpiringSoon(minutesBeforeExpiry = 5) {
        const expiresAt = this.getTokenExpiresAt();
        if (!expiresAt) {
          return false;
        }
        const expirationDate = new Date(expiresAt);
        const now = /* @__PURE__ */ new Date();
        const timeUntilExpiry = expirationDate.getTime() - now.getTime();
        const minutesUntilExpiry = timeUntilExpiry / (1e3 * 60);
        return minutesUntilExpiry <= minutesBeforeExpiry && minutesUntilExpiry > 0;
      }
      getCurrentUser() {
        return this.currentUserSubject.value;
      }
      // Update current user data (e.g., after profile update)
      updateUser(user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
      }
      isAdmin() {
        const user = this.getCurrentUser();
        return user?.role === "Admin";
      }
      static ctorParameters = () => [];
    };
    TokenService = __decorate([
      Injectable({
        providedIn: "root"
      })
    ], TokenService);
  }
});

export {
  TokenService,
  init_token_service
};
//# sourceMappingURL=chunk-BG5VQJI4.js.map
