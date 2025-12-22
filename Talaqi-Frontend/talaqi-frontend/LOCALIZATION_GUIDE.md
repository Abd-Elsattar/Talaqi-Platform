# Localization Implementation Guide

## Overview
This document explains the localization (i18n) implementation for the Talaqi Platform, supporting both Arabic (RTL) and English (LTR) languages.

## What Was Implemented

### 1. Core Dependencies
- **@ngx-translate/core**: Core translation functionality
- **@ngx-translate/http-loader**: HTTP loader for loading translation files

### 2. Translation Files
Located in `src/assets/i18n/`:
- `ar.json` - Arabic translations (default language)
- `en.json` - English translations

### 3. Services

#### LanguageService (`src/app/core/services/language.service.ts`)
Manages language switching and persistence:
- **getCurrentLanguage()**: Returns current active language ('ar' or 'en')
- **setLanguage(lang)**: Changes the application language
- **toggleLanguage()**: Switches between Arabic and English
- **isRtl()**: Returns true if current language is RTL (Arabic)
- Automatically applies RTL/LTR direction to HTML element
- Persists language preference in localStorage

#### TranslateLoader (`src/app/core/services/translate-loader.ts`)
Factory function for loading translation JSON files from assets.

### 4. Components

#### LanguageSwitcherComponent (`src/app/shared/language-switcher/language-switcher.ts`)
A reusable button component for language switching:
- Displays current language
- Toggles between Arabic and English on click
- Styled with icon and responsive design
- Already integrated into the navbar

### 5. Configuration
Updated `app.config.ts` to include:
- TranslateModule with default language set to Arabic
- HTTP loader configuration for JSON translation files

## How to Use

### In Templates (HTML)
Use the `translate` pipe to display translated text:

```html
<!-- Simple translation -->
<h1>{{ 'home.hero.slide1.title' | translate }}</h1>

<!-- In attributes -->
<input [placeholder]="'home.search.placeholder' | translate">

<!-- In title/aria-label -->
<button [title]="'home.search.clearFilter' | translate">
```

### In Components (TypeScript)
Inject TranslateService to use translations programmatically:

```typescript
import { TranslateService } from '@ngx-translate/core';

export class MyComponent {
  private translate = inject(TranslateService);

  showAlert() {
    const message = this.translate.instant('home.alerts.dateRangeError');
    alert(message);
  }
}
```

### Adding the Language Switcher
The language switcher is already added to the navbar. To add it elsewhere:

```typescript
// In your component imports
import { LanguageSwitcherComponent } from '../shared/language-switcher/language-switcher';

@Component({
  imports: [LanguageSwitcherComponent, ...],
  // ...
})
```

```html
<!-- In your template -->
<app-language-switcher></app-language-switcher>
```

## Translation File Structure

All translations follow a hierarchical key structure:

```json
{
  "home": {
    "hero": {
      "slide1": {
        "title": "Translation text",
        "description": "Translation text"
      }
    },
    "search": {
      "placeholder": "Translation text"
    }
  }
}
```

### Adding New Translations

1. **Add to Arabic file** (`ar.json`):
```json
{
  "myFeature": {
    "title": "عنوان الميزة",
    "description": "وصف الميزة"
  }
}
```

2. **Add to English file** (`en.json`):
```json
{
  "myFeature": {
    "title": "Feature Title",
    "description": "Feature description"
  }
}
```

3. **Use in template**:
```html
<h1>{{ 'myFeature.title' | translate }}</h1>
<p>{{ 'myFeature.description' | translate }}</p>
```

## Components Refactored

### Home Page (Public/Logout View)
✅ **Fully localized** - All text content uses translation keys:
- Hero slider (all 4 slides)
- Action buttons
- Search bar and filters
- Loading states
- Item cards and status badges
- Empty states
- Pagination
- Advertisements section
- Error messages

## RTL/LTR Support

The language service automatically handles:
- Setting `dir="rtl"` for Arabic
- Setting `dir="ltr"` for English
- Setting `lang` attribute on HTML element
- Can be tested using `languageService.isRtl()` in components

## Testing the Implementation

1. **Start the development server** (already running on port 4200)
2. **Open the application** in your browser
3. **Look for the language switcher** in the navbar (icon with "EN" or "عربي")
4. **Click it** to toggle between languages
5. **Navigate to the home page** to see all translations in action
6. **Verify**:
   - All text changes to English/Arabic
   - Direction changes (RTL/LTR)
   - Language preference persists on page reload

## Next Steps

To localize other pages, follow this pattern:

1. **Extract all hardcoded text** from the component
2. **Add translation keys** to both `ar.json` and `en.json`
3. **Import TranslateModule** in the component:
   ```typescript
   imports: [TranslateModule, ...]
   ```
4. **Replace hardcoded text** with translation pipes in templates
5. **Use `translate.instant()`** for programmatic translations
6. **Test both languages** thoroughly

## File Changes Summary

### Created Files:
- `src/assets/i18n/ar.json` - Arabic translations
- `src/assets/i18n/en.json` - English translations
- `src/app/core/services/language.service.ts` - Language management
- `src/app/core/services/translate-loader.ts` - Translation loader factory
- `src/app/shared/language-switcher/language-switcher.ts` - Language switcher component

### Modified Files:
- `src/app/app.config.ts` - Added TranslateModule configuration
- `src/app/features/public/home/home.ts` - Refactored to use translations
- `src/app/features/public/home/home.html` - Refactored to use translate pipe
- `src/app/shared/navbar/navbar.ts` - Added language switcher
- `src/app/shared/navbar/navbar.html` - Added language switcher button

## Best Practices

1. ✅ Always add translations to BOTH language files
2. ✅ Use descriptive, hierarchical keys (e.g., `home.search.placeholder`)
3. ✅ Keep translation keys organized by feature/page
4. ✅ Use `translate.instant()` for programmatic translations (alerts, console, etc.)
5. ✅ Use the translate pipe (`| translate`) in templates
6. ✅ Test with both languages before committing
7. ✅ Maintain consistent key naming across files

## Future Enhancements

- Add more languages (French, Spanish, etc.)
- Implement lazy loading for translation files
- Add translation validation scripts
- Create translation management tool
- Add pluralization support
- Implement date/number formatting per locale
