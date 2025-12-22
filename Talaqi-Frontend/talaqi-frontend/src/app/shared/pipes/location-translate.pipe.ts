import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

@Pipe({
  name: 'locationTranslate',
  standalone: true,
  pure: false
})
export class LocationTranslatePipe implements PipeTransform {
  private languageService = inject(LanguageService);

  // Egyptian Governorates and Cities translations
  private locationTranslations: Record<string, string> = {
    // Governorates
    'القاهرة': 'Cairo',
    'الجيزة': 'Giza',
    'الإسكندرية': 'Alexandria',
    'الأقصر': 'Luxor',
    'أسوان': 'Aswan',
    'أسيوط': 'Asyut',
    'الإسماعيلية': 'Ismailia',
    'البحيرة': 'Beheira',
    'بني سويف': 'Beni Suef',
    'بورسعيد': 'Port Said',
    'جنوب سيناء': 'South Sinai',
    'دمياط': 'Damietta',
    'الدقهلية': 'Dakahlia',
    'سوهاج': 'Sohag',
    'السويس': 'Suez',
    'الشرقية': 'Sharqia',
    'شمال سيناء': 'North Sinai',
    'الغربية': 'Gharbia',
    'الفيوم': 'Faiyum',
    'القليوبية': 'Qalyubia',
    'قنا': 'Qena',
    'كفر الشيخ': 'Kafr El Sheikh',
    'مطروح': 'Matrouh',
    'المنوفية': 'Monufia',
    'المنيا': 'Minya',
    'الوادي الجديد': 'New Valley',
    'البحر الأحمر': 'Red Sea',

    // Major Cities
    'الزقازيق': 'Zagazig',
    'المنصورة': 'Mansoura',
    'طنطا': 'Tanta',
    'شبين الكوم': 'Shebin El Kom',
    'بنها': 'Benha',
    'كفر الدوار': 'Kafr El Dawwar',
    'دمنهور': 'Damanhur',
    'المحلة الكبرى': 'El Mahalla El Kubra',
    'العاشر من رمضان': '10th of Ramadan',
    'السادس من أكتوبر': '6th of October',
    'الشيخ زايد': 'Sheikh Zayed',
    'مدينة نصر': 'Nasr City',
    'مصر الجديدة': 'Heliopolis',
    'المعادي': 'Maadi',
    'الزمالك': 'Zamalek',
    'المهندسين': 'Mohandessin',
    'الدقي': 'Dokki',
    'العجوزة': 'Agouza',
    '6 أكتوبر': '6th October',
    'الرحاب': 'Rehab',
    'التجمع الخامس': 'Fifth Settlement',
    'القاهرة الجديدة': 'New Cairo',
    'مدينتي': 'Madinaty',
    'الشروق': 'El Shorouk',
    'العبور': 'El Obour',
    'بدر': 'Badr',
    'الهرم': 'Haram',
    'فيصل': 'Faisal',
    'شرم الشيخ': 'Sharm El Sheikh',
    'الغردقة': 'Hurghada',
    'مرسى علم': 'Marsa Alam',
    'دهب': 'Dahab',
    'رأس غارب': 'Ras Gharib',
    'العريش': 'Arish',
    'رفح': 'Rafah',
  };

  transform(value: string | undefined): string {
    if (!value) return '';
    
    // If current language is Arabic, return as is
    if (this.languageService.isRtl()) {
      return value;
    }
    
    // If English, translate from Arabic to English
    return this.locationTranslations[value] || value;
  }
}
