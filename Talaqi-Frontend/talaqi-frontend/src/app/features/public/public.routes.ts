// Public routes: configures navigation for home, FAQ, help, contact, and other public pages.
import { Routes } from '@angular/router';
import { userGuard } from '../../core/guards/user.guard';

export const PUBLIC_ROUTES: Routes = [
  {
    path: 'home',
    canActivate: [userGuard],
    loadComponent: () => import('./home/home').then((c) => c.Home),
    title: 'تلاقي',
  },
  {
    path: 'faq',
    loadComponent: () => import('./faq/faq').then((c) => c.FAQComponent),
  },
  {
    path: 'help-support',
    loadComponent: () => import('./help-support/help-support').then((c) => c.HelpSupportComponent),
  },
  {
    path: 'how-it-works',
    loadComponent: () => import('./how-it-works/how-it-works').then((c) => c.HowItWorksComponent),
  },
  {
    path: 'contact-us',
    loadComponent: () => import('./contact-us/contact-us').then((c) => c.ContactUsComponent),
  },
  {
    path: 'placeholder',
    loadComponent: () => import('./placeholder/placeholder').then((c) => c.PlaceholderPage),
  },
];
