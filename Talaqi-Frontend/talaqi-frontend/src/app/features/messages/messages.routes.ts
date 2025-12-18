import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { MessagesLayoutComponent } from './messages-layout/messages-layout';

export const MESSAGES_ROUTES: Routes = [
  {
    path: 'messages',
    component: MessagesLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./chat-placeholder/chat-placeholder').then(c => c.ChatPlaceholderComponent)
      },
      {
        path: 'chat/:id',
        loadComponent: () => import('./chat-conversation/chat-conversation').then(c => c.ChatConversationComponent)
      }
    ]
  }
];
