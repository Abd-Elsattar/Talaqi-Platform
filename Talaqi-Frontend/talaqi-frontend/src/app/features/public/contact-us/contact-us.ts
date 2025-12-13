// Contact Us component: handles contact form submission and validation.
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css',
})
export class ContactUsComponent {
  contactMethods = [
    {
      icon: 'bi-envelope-fill',
      title: 'البريد الإلكتروني',
      description: 'أرسل لنا بريداً إلكترونياً',
      value: 'talaqiteam@gmail.com',
      link: 'mailto:talaqiteam@gmail.com',
    },
    {
      icon: 'bi-telephone-fill',
      title: 'الهاتف',
      description: 'اتصل بنا مباشرة',
      value: '01007460135',
      link: 'tel:+201007460135',
    },
    {
      icon: 'bi-geo-alt-fill',
      title: 'الموقع',
      description: 'زرنا في مقرنا',
      value: 'المنصورة، مصر',
      link: '#',
    },
    {
      icon: 'bi-clock-fill',
      title: 'ساعات العمل',
      description: 'وقت الدعم المتاح',
      value: 'السبت - الخميس: 9 ص - 6 م',
      link: '#',
    },
  ];
  // Form removed: contactMethods remain for display
}
