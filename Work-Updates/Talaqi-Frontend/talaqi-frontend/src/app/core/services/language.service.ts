import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translate = inject(TranslateService);
  private readonly LANGUAGE_KEY = 'app_language';

  constructor() {
    this.initLanguage();
  }

  private async initLanguage(): Promise<void> {
    // Get saved language from localStorage or default to Arabic
    const savedLang = localStorage.getItem(this.LANGUAGE_KEY) || 'ar';
    
    // Set available languages
    this.translate.addLangs(['en', 'ar']);
    
    // Set default language
    this.translate.setDefaultLang('ar');
    
    // Use the saved or default language and wait for it to load
    try {
      await firstValueFrom(this.translate.use(savedLang));
      console.log(`Language ${savedLang} loaded successfully`);
    } catch (error) {
      console.error(`Error loading language ${savedLang}:`, error);
    }
    
    // Apply RTL/LTR direction
    this.applyDirection(savedLang);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang || 'ar';
  }

  setLanguage(lang: string): void {
    if (lang === 'en' || lang === 'ar') {
      this.translate.use(lang).subscribe({
        next: () => {
          localStorage.setItem(this.LANGUAGE_KEY, lang);
          this.applyDirection(lang);
          console.log(`Language switched to ${lang}`);
        },
        error: (error) => {
          console.error(`Error switching to language ${lang}:`, error);
        }
      });
    }
  }

  toggleLanguage(): void {
    const currentLang = this.getCurrentLanguage();
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    this.setLanguage(newLang);
  }

  private applyDirection(lang: string): void {
    const htmlTag = document.documentElement;
    if (lang === 'ar') {
      htmlTag.setAttribute('dir', 'rtl');
      htmlTag.setAttribute('lang', 'ar');
    } else {
      htmlTag.setAttribute('dir', 'ltr');
      htmlTag.setAttribute('lang', 'en');
    }
  }

  isRtl(): boolean {
    return this.getCurrentLanguage() === 'ar';
  }
}
