// Profile routes: defines navigation for profile editing and user details.
import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const PROFILE_ROUTES: Routes = [
  {
    path: 'edit-profile',
    canActivate: [authGuard],
    loadComponent: () => import('./edit-profile/edit-profile').then((c) => c.EditProfile),
  },
  {
    path: 'my-reports',
    canActivate: [authGuard],
    loadComponent: () => import('../reports/user-reports/user-reports').then((c) => c.UserReportsComponent),
  },
];
