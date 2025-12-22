import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'categoryTranslate',
  standalone: true,
})
export class CategoryTranslatePipe implements PipeTransform {
  private translate = inject(TranslateService);

  private categoryKeys: Record<string, string> = {
    PersonalBelongings: 'categories.personalBelongings',
    People: 'categories.people',
    Pets: 'categories.pets',
  };

  transform(value: string): string {
    if (!value) return '';
    const translationKey = this.categoryKeys[value];
    if (translationKey) {
      return this.translate.instant(translationKey);
    }
    return value;
  }
}
