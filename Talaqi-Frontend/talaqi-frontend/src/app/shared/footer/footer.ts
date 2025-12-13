import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  socialLinks = [
    {
      name: 'Facebook',
      icon: 'bi-facebook',
      url: 'https://www.facebook.com/profile.php?id=61584479934710',
    },
    { name: 'Twitter', icon: 'bi-twitter-x', url: 'https://x.com/Talaqiteam' },
    { name: 'Instagram', icon: 'bi-instagram', url: 'https://www.instagram.com/talaqinode/' },
    {
      name: 'LinkedIn',
      icon: 'bi-linkedin',
      url: 'https://www.linkedin.com/in/talaqi-team-015996392/',
    },
  ];

  quickLinks = [
    { label: 'الرئيسية', route: '/home' },
    { label: 'تسجيل الدخول', route: '/login' },
    { label: 'إنشاء حساب', route: '/register' },
  ];

  helpLinks = [
    { label: 'كيف يعمل؟', route: '/how-it-works' },
    { label: 'الأسئلة الشائعة', route: '/faq' },
    { label: 'اتصل بنا', route: '/contact-us' },
  ];

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
