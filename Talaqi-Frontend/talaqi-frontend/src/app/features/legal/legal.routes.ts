// Legal routes: configures navigation for terms, privacy, and cookie policy pages.
import { Routes } from '@angular/router';

export const LEGAL_ROUTES: Routes = [
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./privacy-policy/privacy-policy').then((c) => c.PrivacyPolicyComponent),
  },
  {
    path: 'terms-of-service',
    loadComponent: () =>
      import('./terms-of-service/terms-of-service').then((c) => c.TermsOfServiceComponent),
  },
  {
    path: 'cookie-policy',
    loadComponent: () =>
      import('./cookie-policy/cookie-policy').then((c) => c.CookiePolicyComponent),
  },
];
