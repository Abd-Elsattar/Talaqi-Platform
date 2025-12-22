// Contact Us component: handles contact form submission and validation.
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css',
})
export class ContactUsComponent {
  contactMethods = [
    {
      icon: 'bi-envelope-fill',
      titleKey: 'contactUs.contactMethods.email.title',
      descKey: 'contactUs.contactMethods.email.description',
      value: 'talaqiteam@gmail.com',
      link: 'mailto:talaqiteam@gmail.com',
      isTranslatedValue: false,
    },
    {
      icon: 'bi-telephone-fill',
      titleKey: 'contactUs.contactMethods.phone.title',
      descKey: 'contactUs.contactMethods.phone.description',
      value: '01007460135',
      link: 'tel:+201007460135',
      isTranslatedValue: false,
    },
    {
      icon: 'bi-geo-alt-fill',
      titleKey: 'contactUs.contactMethods.location.title',
      descKey: 'contactUs.contactMethods.location.description',
      valueKey: 'contactUs.contactMethods.location.value',
      link: '#',
      isTranslatedValue: true,
    },
    {
      icon: 'bi-clock-fill',
      titleKey: 'contactUs.contactMethods.workingHours.title',
      descKey: 'contactUs.contactMethods.workingHours.description',
      valueKey: 'contactUs.contactMethods.workingHours.value',
      link: '#',
      isTranslatedValue: true,
    },
  ];
  // Form removed: contactMethods remain for display
}
