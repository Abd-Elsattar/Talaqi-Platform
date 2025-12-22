// Home component: renders landing page content and sections.
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { TokenService } from '../../../core/services/token.service';
import { LostItemService } from '../../../core/services/lost-item.service';
import { FoundItemService } from '../../../core/services/found-item.service';
import { ImageUrlService } from '../../../core/services/image-url.service';
import { LanguageService } from '../../../core/services/language.service';
import { FoundItemDto, LostItemDto } from '../../../core/models/item';
import { User } from '../../../core/models/auth';
import { CategoryTranslatePipe } from '../../../shared/pipes/category-translate.pipe';
import { LocationTranslatePipe } from '../../../shared/pipes/location-translate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CategoryTranslatePipe, LocationTranslatePipe, TranslateModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  /* =======================
     Dependencies
     ======================= */
  private tokenService = inject(TokenService);
  private lostItemService = inject(LostItemService);
  private foundItemService = inject(FoundItemService);
  private imageUrlService = inject(ImageUrlService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  public languageService = inject(LanguageService);

  private userSubscription?: Subscription;

  /* =======================
     State
     ======================= */
  currentUser: User | null = null;

  lostItems: LostItemDto[] = [];
  foundItems: FoundItemDto[] = [];

  isLoadingItems = false;

  currentPage = 1;
  pageSize = 12;
  totalCount = 0;

  /* =======================
     Filters & Search
     ======================= */
  searchQuery = '';
  selectedCategory = '';
  searchLocation = '';
  quickFilter = '';

  dateFrom = '';
  dateTo = '';

  /* =======================
     Ads
     ======================= */
  ads = [
    {
      id: 1,
      imageUrl: 'https://picsum.photos/320/280?random=1',
      titleKey: 'home.ads.ad1.title',
      descriptionKey: 'home.ads.ad1.description',
      link: '#',
    },
    {
      id: 2,
      imageUrl: 'https://picsum.photos/320/280?random=2',
      titleKey: 'home.ads.ad2.title',
      descriptionKey: 'home.ads.ad2.description',
      link: '#',
    },
    {
      id: 3,
      imageUrl: 'https://picsum.photos/320/280?random=3',
      titleKey: 'home.ads.ad3.title',
      descriptionKey: 'home.ads.ad3.description',
      link: '#',
    },
  ];

  /* =======================
     Hero Slider
     ======================= */
  heroSlides = [
    {
      image: 'herosection/2.png',
      titleKey: 'home.hero.slide1.title',
      descriptionKey: 'home.hero.slide1.description',
      primaryButtonKey: 'home.hero.slide1.primaryButton',
      secondaryButtonKey: 'home.hero.slide1.secondaryButton',
    },
    {
      image: 'herosection/1.png',
      titleKey: 'home.hero.slide2.title',
      descriptionKey: 'home.hero.slide2.description',
      primaryButtonKey: 'home.hero.slide2.primaryButton',
      secondaryButtonKey: 'home.hero.slide2.secondaryButton',
    },
    {
      image: 'herosection/2.png',
      titleKey: 'home.hero.slide3.title',
      descriptionKey: 'home.hero.slide3.description',
      primaryButtonKey: 'home.hero.slide3.primaryButton',
      secondaryButtonKey: 'home.hero.slide3.secondaryButton',
    },
    {
      image: 'herosection/3.png',
      titleKey: 'home.hero.slide4.title',
      descriptionKey: 'home.hero.slide4.description',
      primaryButtonKey: 'home.hero.slide4.primaryButton',
      secondaryButtonKey: 'home.hero.slide4.secondaryButton',
    },
  ];

  currentSlideIndex = 0;
  private slideInterval: any;

  /* =======================
     Lifecycle
     ======================= */
  ngOnInit(): void {
    this.userSubscription = this.tokenService.currentUser$.subscribe((user) => {
      this.currentUser = user;

      this.startSlider();

      if (this.currentUser) {
        this.loadLostItems();
        this.loadFoundItems();
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.stopSlider();
  }

  /* =======================
     Auth Helpers
     ======================= */
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.router.navigate(['/login']);
  }

  /* =======================
     Navigation
     ======================= */
  viewItemDetails(id: string): void {
    this.router.navigate(['/lost-items', id]);
  }

  reportLost(): void {
    this.router.navigate(['/report-lost']);
  }

  reportFound(): void {
    this.router.navigate(['/report-found']);
  }

  /* =======================
     Hero Slider Logic
     ======================= */
  startSlider(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 7000);
  }

  stopSlider(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.heroSlides.length;
  }

  prevSlide(): void {
    this.currentSlideIndex =
      this.currentSlideIndex === 0 ? this.heroSlides.length - 1 : this.currentSlideIndex - 1;
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
    this.stopSlider();
    this.startSlider();
  }

  /* =======================
     Data Loading
     ======================= */
  loadLostItems(): void {
    this.isLoadingItems = true;

    this.lostItemService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.isLoadingItems = false;

        if (res.isSuccess && res.data) {
          this.lostItems = res.data.items;
          this.totalCount = res.data.totalCount;
        }
      },
      error: (err) => {
        this.isLoadingItems = false;
        console.error('Failed to load lost items:', err);
      },
    });
  }

  loadFoundItems(): void {
    this.foundItemService.getMyItems().subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.foundItems = res.data;
        }
      },
      error: (err) => console.error('Failed to load found items:', err),
    });
  }

  loadMore(): void {
    this.currentPage++;

    this.lostItemService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.lostItems = [...this.lostItems, ...res.data.items];
          this.totalCount = res.data.totalCount;
        }
      },
      error: (err) => {
        console.error('Load more failed:', err);
        this.currentPage--;
      },
    });
  }

  /* =======================
     Search & Filters
     ======================= */
  onSearchChange(): void {
    this.performSearch();
  }

  onDateChange(): void {
    if (this.dateFrom && this.dateTo) {
      if (new Date(this.dateFrom) > new Date(this.dateTo)) {
        const errorMessage = this.translate.instant('home.alerts.dateRangeError');
        alert(errorMessage);
        return;
      }
    }

    this.performSearch();
  }

  clearDateFilter(): void {
    this.dateFrom = '';
    this.dateTo = '';
    this.performSearch();
  }

  performSearch(): void {
    this.isLoadingItems = true;
    this.currentPage = 1;

    const category = this.selectedCategory || undefined;

    this.lostItemService.getAll(this.currentPage, this.pageSize, category as any).subscribe({
      next: (res) => {
        this.isLoadingItems = false;

        if (!res.isSuccess || !res.data) return;

        let items = res.data.items;

        if (this.searchQuery.trim()) {
          const q = this.searchQuery.toLowerCase();
          items = items.filter(
            (i) =>
              i.title.toLowerCase().includes(q) ||
              i.description.toLowerCase().includes(q) ||
              i.location.city?.toLowerCase().includes(q) ||
              i.location.governorate?.toLowerCase().includes(q) ||
              i.location.address?.toLowerCase().includes(q)
          );
        }

        if (this.searchLocation.trim()) {
          const loc = this.searchLocation.toLowerCase();
          items = items.filter(
            (i) =>
              i.location.city?.toLowerCase().includes(loc) ||
              i.location.governorate?.toLowerCase().includes(loc) ||
              i.location.address?.toLowerCase().includes(loc)
          );
        }

        if (this.dateFrom || this.dateTo) {
          items = items.filter((i) => {
            const date = new Date(i.dateLost);

            if (this.dateFrom && this.dateTo) {
              const from = new Date(this.dateFrom);
              const to = new Date(this.dateTo);
              to.setHours(23, 59, 59, 999);
              return date >= from && date <= to;
            }

            if (this.dateFrom) {
              return date >= new Date(this.dateFrom);
            }

            if (this.dateTo) {
              const to = new Date(this.dateTo);
              to.setHours(23, 59, 59, 999);
              return date <= to;
            }

            return true;
          });
        }

        this.lostItems = this.applySorting(items);
        this.totalCount = this.lostItems.length;
      },
      error: (err) => {
        this.isLoadingItems = false;
        console.error('Search failed:', err);
      },
    });
  }

  applySorting(items: LostItemDto[]): LostItemDto[] {
    switch (this.quickFilter) {
      case 'recent':
        return items.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'near':
        return items.sort((a, b) => (b.matchCount || 0) - (a.matchCount || 0));
      case 'matched':
        return items.filter((i) => i.matchCount > 0).sort((a, b) => b.matchCount - a.matchCount);
      default:
        return items.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }

  applyQuickFilter(filter: string): void {
    this.quickFilter = this.quickFilter === filter ? '' : filter;
    this.performSearch();
  }

  /* =======================
     Helpers
     ======================= */
  resolveImage(url?: string): string {
    return this.imageUrlService.resolve(url);
  }

  getItemLocation(item: LostItemDto | FoundItemDto): string {
    return item.location?.city || item.location?.address || this.translate.instant('home.item.location');
  }
}
