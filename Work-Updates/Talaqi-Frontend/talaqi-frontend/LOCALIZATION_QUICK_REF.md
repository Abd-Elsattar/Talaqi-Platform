# Quick Reference - Localization

## How to Localize a New Page

### Step 1: Add Translations
Add text to both translation files:

**`src/assets/i18n/ar.json`**:
```json
{
  "pageName": {
    "title": "العنوان بالعربية",
    "button": "زر",
    "message": "رسالة"
  }
}
```

**`src/assets/i18n/en.json`**:
```json
{
  "pageName": {
    "title": "Title in English",
    "button": "Button",
    "message": "Message"
  }
}
```

### Step 2: Import TranslateModule in Component
```typescript
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, ...],
  // ...
})
```

### Step 3: Use in Template
```html
<!-- Text -->
<h1>{{ 'pageName.title' | translate }}</h1>

<!-- Attributes -->
<button [title]="'pageName.button' | translate">
  {{ 'pageName.button' | translate }}
</button>

<!-- Placeholders -->
<input [placeholder]="'pageName.message' | translate">
```

### Step 4: Use in TypeScript (Optional)
```typescript
import { TranslateService } from '@ngx-translate/core';

export class MyComponent {
  private translate = inject(TranslateService);

  showMessage() {
    const msg = this.translate.instant('pageName.message');
    alert(msg);
  }
}
```

## Translation Key Examples from Home Page

```typescript
// Hero slides
'home.hero.slide1.title'
'home.hero.slide1.description'
'home.hero.slide1.primaryButton'

// Actions
'home.actions.reportLost'
'home.actions.reportFound'

// Search
'home.search.placeholder'
'home.search.dateFrom'
'home.search.dateTo'
'home.search.searchButton'
'home.search.clearFilter'

// Status
'home.status.lost'
'home.status.found'

// Messages
'home.loading.text'
'home.empty.noLostItems'
'home.alerts.dateRangeError'
```

## Language Switcher Usage

Already integrated in navbar! To add elsewhere:

```typescript
import { LanguageSwitcherComponent } from './path/to/language-switcher';

@Component({
  imports: [LanguageSwitcherComponent],
})
```

```html
<app-language-switcher></app-language-switcher>
```

## Testing Checklist

- [ ] All hardcoded text replaced with translation keys
- [ ] Translations added to both ar.json and en.json
- [ ] Component imports TranslateModule
- [ ] Test in Arabic (RTL)
- [ ] Test in English (LTR)
- [ ] Language persists after page reload
- [ ] No console errors
