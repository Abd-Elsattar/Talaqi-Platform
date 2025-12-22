// My Found Items component: loads and manages user's found items list.
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FoundItemService } from '../../../../core/services/found-item.service';
import { FoundItemDto, FoundItemStatus, UpdateFoundItemDto } from '../../../../core/models/item';
import { ImageUrlService } from '../../../../core/services/image-url.service';
import { CategoryTranslatePipe } from '../../../../shared/pipes/category-translate.pipe';
import { LocationTranslatePipe } from '../../../../shared/pipes/location-translate.pipe';

@Component({
  selector: 'app-my-found-items',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TranslateModule, CategoryTranslatePipe, LocationTranslatePipe],
  templateUrl: './my-found-items.html',
  styleUrl: './my-found-items.css',
})
export class MyFoundItems implements OnInit {
  FoundItemStatus = FoundItemStatus;
  
  async onStatusChange(item: FoundItemDto, event: any) {
    const newStatus = event.target ? event.target.value : event;
    if (item.status === newStatus) return;
    const result = await Swal.fire({
      title: this.translate.instant('myFoundItems.statusChangeConfirm.title'),
      text: this.translate.instant('myFoundItems.statusChangeConfirm.text', { status: this.getStatusText(newStatus) }),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('myFoundItems.statusChangeConfirm.confirmButton'),
      cancelButtonText: this.translate.instant('myFoundItems.statusChangeConfirm.cancelButton'),
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-secondary',
      },
    });
    if (!result.isConfirmed) return;
    const update: UpdateFoundItemDto = { status: newStatus };
    this.foundItemService.update(item.id, update).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          item.status = res.data.status;
          Swal.fire({
            title: this.translate.instant('myFoundItems.statusChangeSuccess.title'),
            text: this.translate.instant('myFoundItems.statusChangeSuccess.text'),
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
        }
      },
      error: (err) => {
        Swal.fire({
          title: this.translate.instant('myFoundItems.statusChangeError.title'),
          text: this.translate.instant('myFoundItems.statusChangeError.text'),
          icon: 'error',
        });
        console.error('Status update failed', err);
      },
    });
  }
  //#region Injected Services
  private foundItemService = inject(FoundItemService);
  private router = inject(Router);
  private imageUrlService = inject(ImageUrlService);
  private translate = inject(TranslateService);
  //#endregion

  foundItems: FoundItemDto[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  get totalItems(): number {
    return this.foundItems.length;
  }

  get activeItemsCount(): number {
    return this.foundItems.filter((i) => i.status === FoundItemStatus.Available).length;
  }

  get closedItemsCount(): number {
    return this.foundItems.filter((i) => i.status === FoundItemStatus.Closed).length;
  }

  get foundStatusCount(): number {
    return this.foundItems.filter((i) => i.status === FoundItemStatus.Returned).length;
  }

  get totalMatches(): number {
    // Sum matchCount if available on DTO, else 0
    return this.foundItems.reduce((sum, i) => sum + (Number((i as any).matchCount) || 0), 0);
  }

  ngOnInit() {
    this.loadMyFoundItems();
  }

  loadMyFoundItems() {
    this.isLoading = true;
    this.errorMessage = null;

    this.foundItemService.getMyItems().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.foundItems = response.data || [];
        } else {
          this.errorMessage = response.message || this.translate.instant('myFoundItems.errorMessage');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = this.translate.instant('myFoundItems.errorMessage');
        console.error('Error loading found items:', error);
      },
    });
  }

  viewDetails(id: string) {
    this.router.navigate(['/found-items', id]);
  }

  editItem(id: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/report-found-item'], {
      queryParams: { id: id, mode: 'edit' },
    });
  }

  deleteItem(id: string, title: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    Swal.fire({
      title: this.translate.instant('myFoundItems.deleteDialog.title'),
      text: this.translate.instant('myFoundItems.deleteDialog.text', { title }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.translate.instant('myFoundItems.deleteDialog.confirmButton'),
      cancelButtonText: this.translate.instant('myFoundItems.deleteDialog.cancelButton'),
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.foundItemService.delete(id).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              Swal.fire({
                title: this.translate.instant('myFoundItems.deleteDialog.successTitle'),
                text: this.translate.instant('myFoundItems.deleteDialog.successText'),
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
              });
              this.foundItems = this.foundItems.filter((item) => item.id !== id);
            } else {
              Swal.fire({
                title: this.translate.instant('myFoundItems.deleteDialog.errorTitle'),
                text: response.message || this.translate.instant('myFoundItems.deleteDialog.errorText'),
                icon: 'error',
              });
            }
          },
          error: (error) => {
            console.error('Delete error:', error);
            Swal.fire({
              title: this.translate.instant('myFoundItems.deleteDialog.errorTitle'),
              text: this.translate.instant('myFoundItems.deleteDialog.errorText'),
              icon: 'error',
            });
          },
        });
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'badge-success';
      case 'found':
        return 'badge-primary';
      case 'closed':
        return 'badge-secondary';
      case 'expired':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getStatusText(status: string): string {
    const statusKey = status.toLowerCase();
    const translationKey = `myFoundItems.status.${statusKey}`;
    return this.translate.instant(translationKey);
  }

  //#region Helpers
  getItemImageUrl(item: FoundItemDto): string {
    return this.imageUrlService.resolve(item.imageUrl || undefined);
  }

  getItemLocation(item: FoundItemDto): string {
    return item.location?.address || this.translate.instant('myFoundItems.notSpecified');
  }
  //#endregion
}
