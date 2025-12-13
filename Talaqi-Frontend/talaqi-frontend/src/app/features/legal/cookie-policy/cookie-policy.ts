// Cookie Policy component: renders cookie policy content.
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cookie-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-policy.html',
  styleUrl: './cookie-policy.css',
})
export class CookiePolicyComponent {
  // Use a dynamic last-updated date so template shows accurate info
  lastUpdated = new Date();
}
