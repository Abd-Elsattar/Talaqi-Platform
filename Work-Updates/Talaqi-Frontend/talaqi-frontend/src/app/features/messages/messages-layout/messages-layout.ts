import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, Event } from '@angular/router';
import { ChatListComponent } from '../chat-list/chat-list';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ChatListComponent],
  templateUrl: './messages-layout.html',
  styleUrl: './messages-layout.css'
})
export class MessagesLayoutComponent implements OnInit, OnDestroy {
  isChatOpen = false;
  private routerSub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkRoute();
    this.routerSub = this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkRoute();
    });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  private checkRoute() {
    this.isChatOpen = this.router.url.includes('/chat/');
  }
}
