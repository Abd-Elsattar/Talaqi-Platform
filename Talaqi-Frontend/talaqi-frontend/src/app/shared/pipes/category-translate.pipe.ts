import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryTranslate',
  standalone: true,
})
export class CategoryTranslatePipe implements PipeTransform {
  private categoryTranslations: Record<string, string> = {
    PersonalBelongings: 'ممتلكات شخصية',
    People: 'أشخاص',
    Pets: 'حيوانات أليفة',
  };

  transform(value: string): string {
    if (!value) return '';
    return this.categoryTranslations[value] || value;
  }
}
