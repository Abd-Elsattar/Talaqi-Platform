import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-chat-placeholder',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div class="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
      <i class="bi bi-chat-dots" style="font-size: 4rem; opacity: 0.5;"></i>
      <h4 class="mt-3">{{ 'messages.placeholder.title' | translate }}</h4>
      <p>{{ 'messages.placeholder.subtitle' | translate }}</p>
    </div>
  `,
  styles: [`
    :host {
      height: 100%;
      width: 100%;
      display: block;
    }
  `]
})
export class ChatPlaceholderComponent {}
