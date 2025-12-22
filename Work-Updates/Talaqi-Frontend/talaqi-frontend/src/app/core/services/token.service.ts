// TokenService: Stores and manages auth tokens and user session data.
// Provides helpers to read/write tokens securely, attach them to requests,
// and clear session on logout or token expiration.

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, AuthResponse } from '../models/auth';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly ACCESS_TOKEN_KEY = 'access_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private readonly TOKEN_EXPIRES_AT_KEY = 'token_expires_at';
    private readonly USER_KEY = 'user';

    private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor() { }

    getAccessToken(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    getTokenExpiresAt(): string | null {
        return localStorage.getItem(this.TOKEN_EXPIRES_AT_KEY);
    }

    getStoredUser(): User | null {
        const userJson = localStorage.getItem(this.USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    saveTokens(authResponse: AuthResponse): void {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, authResponse.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refreshToken);
        localStorage.setItem(this.TOKEN_EXPIRES_AT_KEY, authResponse.expiresAt);
        localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
        this.currentUserSubject.next(authResponse.user);
    }

    clearTokens(): void {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.TOKEN_EXPIRES_AT_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
    }

    isAuthenticated(): boolean {
        const token = this.getAccessToken();
        const expiresAt = this.getTokenExpiresAt();

        if (!token || !expiresAt) {
            return false;
        }

        // Check if token is expired
        const expirationDate = new Date(expiresAt);
        return expirationDate > new Date();
    }

    isTokenExpiringSoon(minutesBeforeExpiry: number = 5): boolean {
        const expiresAt = this.getTokenExpiresAt();
        if (!expiresAt) {
            return false;
        }

        const expirationDate = new Date(expiresAt);
        const now = new Date();
        const timeUntilExpiry = expirationDate.getTime() - now.getTime();
        const minutesUntilExpiry = timeUntilExpiry / (1000 * 60);

        return minutesUntilExpiry <= minutesBeforeExpiry && minutesUntilExpiry > 0;
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    // Update current user data (e.g., after profile update)
    updateUser(user: User): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    isAdmin(): boolean {
        const user = this.getCurrentUser();
        return user?.role === 'Admin';
    }
}
