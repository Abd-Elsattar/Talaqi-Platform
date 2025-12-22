import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule, TranslateModule],
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
    { label: 'footer.links.home', route: '/home' },
    { label: 'footer.links.login', route: '/login' },
    { label: 'footer.links.register', route: '/register' },
  ];

  helpLinks = [
    { label: 'footer.links.howItWorks', route: '/how-it-works' },
    { label: 'footer.links.faq', route: '/faq' },
    { label: 'footer.links.contact', route: '/contact-us' },
  ];

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
