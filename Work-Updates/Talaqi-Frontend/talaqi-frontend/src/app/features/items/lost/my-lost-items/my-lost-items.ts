// My Lost Items component: loads and manages user's lost items list.
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LostItemService } from '../../../../core/services/lost-item.service';
import { LostItemDto, LostItemStatus } from '../../../../core/models/item';
import { ImageUrlService } from '../../../../core/services/image-url.service';
import { CategoryTranslatePipe } from '../../../../shared/pipes/category-translate.pipe';
import { LocationTranslatePipe } from '../../../../shared/pipes/location-translate.pipe';

@Component({
  selector: 'app-my-lost-items',
  standalone: true,
  imports: [CommonModule, TranslateModule, CategoryTranslatePipe, LocationTranslatePipe],
  templateUrl: './my-lost-items.html',
  styleUrl: './my-lost-items.css',
})
export class MyLostItems implements OnInit {
  LostItemStatus = LostItemStatus;
  //#region Injected Services
  private lostItemService = inject(LostItemService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  imageUrlService = inject(ImageUrlService);
  //#endregion

  items: LostItemDto[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit() {
    this.loadMyLostItems();
  }

  loadMyLostItems() {
    this.isLoading = true;
    this.errorMessage = null;

    this.lostItemService.getMyItems().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.isSuccess && res.data) {
          this.items = res.data;
        } else {
          this.errorMessage = res.message || this.translate.instant('myLostItems.errorMessage');
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading my items:', err);
        this.errorMessage = this.translate.instant('myLostItems.errorMessage');
      },
    });
  }

  //#region Helpers
  getItemImageUrl(imageUrl?: string): string {
    return this.imageUrlService.resolve(imageUrl);
  }

  getStatusLabel(status: string): string {
    const statusKey = status.toLowerCase();
    return this.translate.instant(`myLostItems.status.${statusKey}`);
  }

  getStatusBadgeClass(status: string): string {
    const classMap: { [key: string]: string } = {
      Active: 'badge bg-success',
      Found: 'badge bg-primary',
      Closed: 'badge bg-secondary',
      Expired: 'badge bg-danger',
    };
    return classMap[status] || 'badge bg-info';
  }

  viewItem(itemId: string) {
    this.router.navigate(['/lost-items', itemId]);
  }

  editItem(itemId: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/report-lost-item'], {
      queryParams: { id: itemId, mode: 'edit' },
    });
  }

  deleteItem(itemId: string, title: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    Swal.fire({
      title: this.translate.instant('myLostItems.deleteConfirm.title'),
      text: this.translate.instant('myLostItems.deleteConfirm.text', { title }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.translate.instant('myLostItems.deleteConfirm.confirmButton'),
      cancelButtonText: this.translate.instant('myLostItems.deleteConfirm.cancelButton'),
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.lostItemService.delete(itemId).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              Swal.fire({
                title: this.translate.instant('myLostItems.deleteSuccess.title'),
                text: this.translate.instant('myLostItems.deleteSuccess.text'),
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
              });
              this.items = this.items.filter((item) => item.id !== itemId);
            } else {
              Swal.fire({
                title: this.translate.instant('myLostItems.deleteError.title'),
                text: res.message || this.translate.instant('myLostItems.deleteError.text'),
                icon: 'error',
              });
            }
          },
          error: (err) => {
            console.error('Delete error:', err);
            Swal.fire({
              title: this.translate.instant('myLostItems.deleteError.title'),
              text: this.translate.instant('myLostItems.deleteError.errorOccurred'),
              icon: 'error',
            });
          },
        });
      }
    });
  }

  reportNewItem() {
    this.router.navigate(['/report-lost-item']);
  }

  async changeStatus(item: any, newStatus: LostItemStatus) {
    // Prevent re-activating an item that was marked Found or Closed
    if (
      (item.status === LostItemStatus.Found || item.status === LostItemStatus.Closed) &&
      newStatus === LostItemStatus.Active
    ) {
      Swal.fire({
        title: this.translate.instant('myLostItems.statusChangeNotAllowed.title'),
        text: this.translate.instant('myLostItems.statusChangeNotAllowed.text'),
        icon: 'warning',
        confirmButtonText: this.translate.instant('myLostItems.statusChangeNotAllowed.confirmButton'),
        customClass: { confirmButton: 'btn btn-primary' },
      });
      return;
    }

    if (item.status === newStatus) return;
    const result = await Swal.fire({
      title: this.translate.instant('myLostItems.statusChangeConfirm.title'),
      text: this.translate.instant('myLostItems.statusChangeConfirm.text', { status: this.getStatusLabel(newStatus) }),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('myLostItems.statusChangeConfirm.confirmButton'),
      cancelButtonText: this.translate.instant('myLostItems.statusChangeConfirm.cancelButton'),
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-secondary',
      },
    });
    if (!result.isConfirmed) return;
    const update: any = {
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      location: item.location,
      contactInfo: item.contactInfo,
      status: newStatus,
    };
    this.lostItemService.update(item.id, update).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          item.status = res.data.status;
          Swal.fire({
            title: this.translate.instant('myLostItems.statusChangeSuccess.title'),
            text: this.translate.instant('myLostItems.statusChangeSuccess.text'),
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
        }
      },
      error: (err) => {
        Swal.fire({
          title: this.translate.instant('myLostItems.statusChangeError.title'),
          text: this.translate.instant('myLostItems.statusChangeError.text'),
          icon: 'error',
        });
        console.error('Status update failed', err);
      },
    });
  }

  // Stats computed properties
  get activeItemsCount(): number {
    return this.items.filter((i) => i.status === 'Active').length;
  }

  get foundItemsCount(): number {
    return this.items.filter((i) => i.status === 'Found').length;
  }

  get totalMatches(): number {
    return this.items.reduce((sum, item) => sum + (item.matchCount || 0), 0);
  }
  //#endregion
}
