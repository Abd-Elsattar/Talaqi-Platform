// Item routes: defines navigation for lost, found, and AI matches features.
import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const ITEMS_ROUTES: Routes = [
  // LOST
  {
    path: 'my-lost-items',
    canActivate: [authGuard],
    loadComponent: () => import('./lost/my-lost-items/my-lost-items').then((c) => c.MyLostItems),
  },
  {
    path: 'lost-items/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./lost/lost-item-detail/lost-item-detail').then((c) => c.LostItemDetail),
  },
  {
    path: 'report-lost-item',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./lost/report-lost-item/report-lost-item').then((c) => c.ReportLostItem),
  },

  // FOUND
  {
    path: 'my-found-items',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./found/my-found-items/my-found-items').then((c) => c.MyFoundItems),
  },
  {
    path: 'found-items/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./found/found-item-detail/found-item-detail').then((c) => c.FoundItemDetail),
  },
  {
    path: 'report-found-item',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./found/report-found-item/report-found-item').then((c) => c.ReportFoundItem),
  },

  // AI Matches
  {
    path: 'ai-matches',
    canActivate: [authGuard],
    loadComponent: () => import('./ai-matches/ai-matches').then((c) => c.AiMatches),
  },
];
