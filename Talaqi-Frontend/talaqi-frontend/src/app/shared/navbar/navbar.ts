import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TokenService } from '../../core/services/token.service';
import { ImageUrlService } from '../../core/services/image-url.service';
import { User } from '../../core/models/auth';
import { ChatService } from '../../core/services/chat.service';
import { SignalRService } from '../../core/services/signalr.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private imageUrlService = inject(ImageUrlService);
  private elRef = inject(ElementRef);
  private chatService = inject(ChatService);
  private signalRService = inject(SignalRService);

  private userSubscription?: Subscription;
  private queryParamsSubscription?: Subscription;
  private unreadCountSubscription?: Subscription;
  private messageSubscription?: Subscription;

  currentUser: User | null = null;
  unreadCount = 0;

  isDropdownOpen = false;
  isReportDropdownOpen = false;
  isCollapsed = false;

  @ViewChild('collapseContent') collapseContent?: ElementRef<HTMLElement>;

  activeAdminSection: 'statistics' | 'users' | 'items' | 'reports' = 'statistics';

  defaultProfilePicture = 'images/Default User Icon.jpg';

  ngOnInit() {
    this.userSubscription = this.tokenService.currentUser$.subscribe(
      (user) => {
        this.currentUser = user;
        if (user) {
          // Initialize chat connection and count
          this.signalRService.startConnection();
          this.chatService.getConversations().subscribe(); // Triggers count update via tap
        }
      }
    );

    this.queryParamsSubscription = this.route.queryParams.subscribe((params) => {
      if (['statistics', 'users', 'items', 'reports'].includes(params['section']))
        this.activeAdminSection = params['section'];
    });

    this.unreadCountSubscription = this.chatService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });

    this.messageSubscription = this.signalRService.messageReceived$.subscribe(message => {
      if (message && message.senderId !== this.currentUser?.id) {
        // Increment unread count globally if we are not already viewing it?
        // For now, we increment. The chat component will mark it as read which decrements.
        this.chatService.incrementUnreadCount();
      }
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
    this.queryParamsSubscription?.unsubscribe();
    this.unreadCountSubscription?.unsubscribe();
    this.messageSubscription?.unsubscribe();
  }

  getProfilePictureUrl() {
    if (this.currentUser?.profilePictureUrl) {
      return this.imageUrlService.resolve(this.currentUser.profilePictureUrl);
    }
    return this.defaultProfilePicture;
  }

  isAdmin() {
    return this.tokenService.isAdmin();
  }

  navigateToAdminSection(section: 'statistics' | 'users' | 'items' | 'reports') {
    this.activeAdminSection = section;
    this.router.navigate(['/admin-panel'], { queryParams: { section } });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) this.isReportDropdownOpen = false;
    this.isCollapsed = false;
  }

  toggleReportDropdown() {
    this.isReportDropdownOpen = !this.isReportDropdownOpen;
    if (this.isReportDropdownOpen) this.isDropdownOpen = false;
    this.isCollapsed = false;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
    this.isReportDropdownOpen = false;
  }

  closeAll() {
    this.isDropdownOpen = false;
    this.isReportDropdownOpen = false;
    this.isCollapsed = false;
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      this.isDropdownOpen = false;
      this.isReportDropdownOpen = false;
    }

    // Focus first interactive element when opening for better accessibility
    if (this.isCollapsed) {
      queueMicrotask(() => {
        const container = this.collapseContent?.nativeElement;
        const firstFocusable = container?.querySelector<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex="0"]'
        );
        firstFocusable?.focus();
      });
    }
  }

  navigateToMyLostItems() {
    this.router.navigate(['/my-lost-items']);
  }

  isActive(route: string) {
    return this.router.url === route;
  }

  logout() {
    this.tokenService.clearTokens();
    this.closeAll();
    this.router.navigate(['/home']);
  }

  @HostListener('window:resize')
  onResize() {
    // Close mobile menu when resizing to desktop to avoid stuck state
    if (window.innerWidth >= 992) {
      this.isCollapsed = false;
    }
  }

  // Close when clicking outside of navbar content (desktop/mobile)
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    const navbarRoot = (this.elRef.nativeElement as HTMLElement) ?? null;
    if (!navbarRoot) return;
    const withinNavbar = target ? navbarRoot.contains(target) : false;
    if (!withinNavbar) {
      this.closeAll();
    }
  }

  // Focus trap when collapsed is open (mobile): keep tabbing inside
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (!this.isCollapsed) return;
    if (event.key !== 'Tab') return;
    const container = this.collapseContent?.nativeElement;
    if (!container) return;
    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex="0"], input, select, textarea'
      )
    ).filter((el) => el.offsetParent !== null);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (event.shiftKey) {
      if (active === first || !container.contains(active)) {
        last.focus();
        event.preventDefault();
      }
    } else {
      if (active === last || !container.contains(active)) {
        first.focus();
        event.preventDefault();
      }
    }
  }

  ngAfterViewInit() {
    // Close menus on route change for consistent UX
    this.router.events.subscribe(() => {
      this.closeAll();
    });
  }
}
