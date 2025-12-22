import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="language-switcher-btn" 
      (click)="toggleLanguage()"
      [title]="currentLang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'">
      <i class="bi bi-translate"></i>
      <span>{{ currentLang === 'ar' ? 'EN' : 'عربي' }}</span>
    </button>
  `,
  styles: [`
    .language-switcher-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .language-switcher-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
    }

    .language-switcher-btn i {
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .language-switcher-btn span {
        display: none;
      }
    }
  `],
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
