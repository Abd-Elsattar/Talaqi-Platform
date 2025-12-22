import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="btn  navbar-action-btn" 
      (click)="toggleLanguage()"
      [title]="currentLang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'">
      <i class="bi bi-translate"></i>
      <span>{{ currentLang === 'ar' ? 'EN' : 'عربي' }}</span>
    </button>
  `,
})
export class LanguageSwitcherComponent {
  languageService = inject(LanguageService);

  get currentLang(): string {
    return this.languageService.getCurrentLanguage();
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
}
