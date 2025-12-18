import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-placeholder',
  standalone: true,
  template: `
    <div class="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
      <i class="bi bi-chat-dots" style="font-size: 4rem; opacity: 0.5;"></i>
      <h4 class="mt-3">اختر محادثة للبدء</h4>
      <p>تواصل مع الآخرين حول العناصر المفقودة والموجودة</p>
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
