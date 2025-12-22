import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

import { AdminService } from '../../../../core/services/admin.service';
import { ImageUrlService } from '../../../../core/services/image-url.service';
import { PaginatedResponse } from '../../../../core/models/pagination';

@Component({
  selector: 'app-admin-items',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './admin-items.component.html',
  styleUrls: ['./admin-items.component.css']
})
export class AdminItemsComponent implements OnInit {
  private adminService = inject(AdminService);
  private imageUrlService = inject(ImageUrlService);
  private translate = inject(TranslateService);

  activeTab: 'lost' | 'found' = 'lost';
  items: any[] = [];
  itemsPage = 1;
  itemsPageSize = 20;
  totalItems = 0;
  loadingItems = false;
  searchTerm = '';
  filterCategory = '';
  filterStatus = '';
  selectedItem: any = null;
  showItemModal = false;

  Math = Math;

  ngOnInit() {
    this.loadItems();
  }

  switchTab(tab: 'lost' | 'found'): void {
    this.activeTab = tab;
    this.itemsPage = 1;
    this.loadItems();
  }

  loadItems(): void {
    this.loadingItems = true;
    this.adminService.getItems(this.activeTab, this.itemsPage, this.itemsPageSize).subscribe({
      next: (res: PaginatedResponse<any>) => {
        this.loadingItems = false;
        this.items = res.items;
        this.totalItems = res.totalCount;
      },
      error: () => {
        this.loadingItems = false;
        Swal.fire(this.translate.instant('adminPanel.messages.error'), this.translate.instant('adminPanel.messages.itemsLoadError'), 'error');
      },
    });
  }

  get filteredItems(): any[] {
    let filtered = this.items;

    if (this.searchTerm) {
      const s = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        i =>
          i.title?.toLowerCase().includes(s) ||
          i.description?.toLowerCase().includes(s)
      );
    }

    if (this.filterCategory) {
      filtered = filtered.filter(i => i.category === +this.filterCategory);
    }

    if (this.filterStatus) {
      filtered = filtered.filter(i => i.status === +this.filterStatus);
    }

    return filtered;
  }

  viewItemDetails(item: any): void {
    this.selectedItem = item;
    this.showItemModal = true;
  }

  closeItemModal(): void {
    this.showItemModal = false;
    this.selectedItem = null;
  }

  getItemImageUrl(item: any): string {
    let imageUrl: string | null = null;

    if (item?.imageUrl) {
      imageUrl = item.imageUrl;
    } else if (Array.isArray(item?.images) && item.images.length > 0) {
      imageUrl = typeof item.images[0] === 'string'
        ? item.images[0]
        : item.images[0]?.url || item.images[0]?.imageUrl;
    } else if (Array.isArray(item?.imageUrls) && item.imageUrls.length > 0) {
      imageUrl = item.imageUrls[0];
    }

    return this.imageUrlService.resolve(imageUrl || undefined)
      || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  getCategoryName(category: number | string): string {
    const map: Record<number, string> = {
      1: this.translate.instant('adminPanel.items.filters.categoryPersonal'),
      2: this.translate.instant('adminPanel.items.filters.categoryPeople'),
      3: this.translate.instant('adminPanel.items.filters.categoryPets'),
    };
    return map[Number(category)] || this.translate.instant('adminPanel.common.unknown');
  }

  getStatusName(status: number | string): string {
    const map: Record<number, string> = {
      1: this.translate.instant('adminPanel.items.filters.statusActive'),
      2: this.translate.instant('adminPanel.items.filters.statusFound'),
      3: this.translate.instant('adminPanel.items.filters.statusClosed'),
    };
    return map[Number(status)] || this.translate.instant('adminPanel.common.unknown');
  }

  getStatusBadgeClass(status: number | string): string {
    switch (Number(status)) {
      case 1: return 'bg-warning';
      case 2: return 'bg-success';
      case 3: return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }

  get totalItemsPages(): number {
    return Math.ceil(this.totalItems / this.itemsPageSize);
  }

  nextItemsPage(): void {
    if (this.itemsPage < this.totalItemsPages) {
      this.itemsPage++;
      this.loadItems();
    }
  }

  prevItemsPage(): void {
    if (this.itemsPage > 1) {
      this.itemsPage--;
      this.loadItems();
    }
  }
}
