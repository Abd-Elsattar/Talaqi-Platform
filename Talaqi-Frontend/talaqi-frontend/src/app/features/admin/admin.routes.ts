// Admin routes: defines navigation paths and lazy-loaded components for the admin area.
import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { adminGuard } from '../../core/guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin-panel',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./components/dashboard/admin-dashboard.component').then((c) => c.AdminDashboardComponent),
  },
];
