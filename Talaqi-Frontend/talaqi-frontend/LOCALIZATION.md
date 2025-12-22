# Internationalization (i18n) Implementation Guide

## Overview
This project now supports multiple languages using `@ngx-translate/core`. The implementation allows easy switching between Arabic (default) and English.

## Structure

### Translation Files
Translation files are located in `src/assets/i18n/`:
- `ar.json` - Arabic translations (default)
- `en.json` - English translations

### Services
1. **LanguageService** (`src/app/core/services/language.service.ts`)
   - Manages language switching
   - Persists language preference in localStorage
   - Automatically applies RTL/LTR direction

2. **Translation Loader** (`src/app/core/services/translate-loader.ts`)
   - Factory function for loading translation files

### Components
1. **LanguageSwitcherComponent** (`src/app/shared/language-switcher/language-switcher.ts`)
   - Standalone component for language switching
   - Can be added to any component (currently in navbar)

## Usage

### In Templates (HTML)
Use the `translate` pipe for static text:

```html
<!-- Simple translation -->
<h1>{{ 'home.hero.slide1.title' | translate }}</h1>

<!-- Translation with placeholder attribute -->
<input [placeholder]="'home.search.placeholder' | translate">

<!-- Translation in title attribute -->
<button [title]="'home.search.clearFilter' | translate">
```

### In Components (TypeScript)
Inject `TranslateService` for dynamic translations:

```typescript
import { TranslateService } from '@ngx-translate/core';

export class MyComponent {
  private translate = inject(TranslateService);

  showMessage() {
    const message = this.translate.instant('home.alerts.dateRangeError');
    alert(message);
  }
}
```

### Language Switching
Users can switch languages using the language switcher button in the navbar. The preference is saved in localStorage and persists across sessions.

## Adding New Translations

### For Home Page (Already Implemented)
All home page text has been extracted to translation files under the `home` namespace:
- Hero slides
- Search functionality
- Action buttons
- Loading states
- Status badges
- Pagination
- Ads section

### For New Pages
1. Add translation keys to both `ar.json` and `en.json`:

```json
// ar.json
{
  "pageName": {
    "title": "العنوان بالعربية",
    "description": "الوصف بالعربية"
  }
}

// en.json
{
  "pageName": {
    "title": "Title in English",
    "description": "Description in English"
  }
}
```

2. Import `TranslateModule` in your component:

```typescript
import { TranslateModule } from '@ngx-translate/core';

@Component({
  imports: [CommonModule, TranslateModule],
  // ...
})
```

3. Use the translate pipe in your template:

```html
<h1>{{ 'pageName.title' | translate }}</h1>
```

## Directory Structure (RTL/LTR)
The language service automatically sets the HTML `dir` attribute:
- Arabic: `dir="rtl" lang="ar"`
- English: `dir="ltr" lang="en"`

This ensures proper text direction for each language.

## Best Practices

1. **Organize by Feature**: Group translations by page or feature
2. **Use Nested Objects**: Keep related translations together
3. **Consistent Naming**: Use descriptive, hierarchical keys
4. **Keep Keys in Sync**: Always update both `ar.json` and `en.json`
5. **Avoid Hardcoded Text**: All user-facing text should use translations

## Example Translation Structure

```json
{
  "common": {
    "buttons": {
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete"
    },
    "messages": {
      "success": "Operation completed successfully",
      "error": "An error occurred"
    }
  },
  "home": {
    "hero": { /* ... */ },
    "search": { /* ... */ }
  },
  "profile": {
    "edit": { /* ... */ },
    "settings": { /* ... */ }
  }
}
```

## Testing

1. Open the application in the browser
2. Click the language switcher button (shows "EN" or "عربي")
3. Verify that:
   - All text changes to the selected language
   - Text direction changes (RTL for Arabic, LTR for English)
   - Language preference persists on page reload

## Next Steps

To add localization to other pages:
1. Extract all hardcoded text
2. Add translation keys to both JSON files
3. Import `TranslateModule` in the component
4. Replace text with `{{ 'key' | translate }}` pipe
5. Test in both languages

## Completed Features
- ✅ Basic i18n infrastructure
- ✅ Language service with persistence
- ✅ Language switcher component
- ✅ Home page fully localized
- ✅ RTL/LTR direction support

## Pending Features
- ⏳ Localize remaining pages (login, register, profile, etc.)
- ⏳ Localize navbar items
- ⏳ Localize form validation messages
- ⏳ Add language switcher for authenticated users
