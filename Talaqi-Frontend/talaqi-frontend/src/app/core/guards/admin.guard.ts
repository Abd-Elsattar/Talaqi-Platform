import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token.service';

// Admin guard
// Allows access only to admin users
// Redirects non-admin users to home page
// Usage: add to route's canActivate array

export const adminGuard: CanActivateFn = () => {
    const tokenService = inject(TokenService);
    const router = inject(Router);

    if (tokenService.isAdmin()) {
        return true;
    }

    router.navigate(['/']);
    return false;
};

