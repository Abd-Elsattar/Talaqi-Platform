import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token.service';

// Guard to protect routes that require authentication
// If the user is not authenticated, they are redirected to the login page
// and the attempted URL is passed as a query parameter for post-login redirection
// Usage: add to route's canActivate array

export const authGuard: CanActivateFn = (_route, state) => {
    const tokenService = inject(TokenService);
    const router = inject(Router);

    if (tokenService.isAuthenticated()) {
        return true;
    }

    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
};

