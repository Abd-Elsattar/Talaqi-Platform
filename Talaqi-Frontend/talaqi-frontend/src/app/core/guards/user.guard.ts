import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token.service';

// User guard
// Redirects admin users to admin panel statistics section
// Allows non-admin users to proceed
// Usage: add to route's canActivate array

export const userGuard: CanActivateFn = () => {
    const tokenService = inject(TokenService);
    const router = inject(Router);

    if (tokenService.isAdmin()) {
        router.navigate(['/admin-panel'], { queryParams: { section: 'statistics' } });
        return false;
    }

    return true;
};

