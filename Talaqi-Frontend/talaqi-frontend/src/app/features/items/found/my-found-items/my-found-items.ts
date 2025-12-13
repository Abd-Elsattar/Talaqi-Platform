// My Found Items component: loads and manages user's found items list.
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FoundItemService } from '../../../../core/services/found-item.service';
import { FoundItemDto, FoundItemStatus, UpdateFoundItemDto } from '../../../../core/models/item';
import { ImageUrlService } from '../../../../core/services/image-url.service';

@Component({
  selector: 'app-my-found-items',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './my-found-items.html',
  styleUrl: './my-found-items.css',
})
export class MyFoundItems implements OnInit {
  FoundItemStatus = FoundItemStatus;
  statusOptions = [
    { value: FoundItemStatus.Available, label: 'نشط' },
    { value: FoundItemStatus.Returned, label: 'تم العثور عليه' },
    { value: FoundItemStatus.Closed, label: 'مغلق' },
    { value: FoundItemStatus.Expired, label: 'منتهي الصلاحية' },
  ];
  async onStatusChange(item: FoundItemDto, event: any) {
    const newStatus = event.target ? event.target.value : event;
    if (item.status === newStatus) return;
    const result = await Swal.fire({
      title: 'تأكيد تغيير الحالة',
      text: `هل أنت متأكد أنك تريد تغيير حالة العنصر إلى "${this.getStatusText(newStatus)}"؟`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'تأكيد',
      cancelButtonText: 'إلغاء',
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
            title: 'تم التغيير!',
            text: 'تم تحديث حالة العنصر بنجاح.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
        }
      },
      error: (err) => {
        Swal.fire({
          title: 'خطأ!',
          text: 'حدث خطأ أثناء تحديث الحالة.',
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
          this.errorMessage = response.message || 'فشل في تحميل العناصر الموجودة';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'حدث خطأ أثناء تحميل العناصر الموجودة';
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
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف "${title}" نهائياً`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
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
                title: 'تم الحذف!',
                text: 'تم حذف العنصر بنجاح',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
              });
              this.foundItems = this.foundItems.filter((item) => item.id !== id);
            } else {
              Swal.fire({
                title: 'خطأ!',
                text: response.message || 'فشل حذف العنصر',
                icon: 'error',
              });
            }
          },
          error: (error) => {
            console.error('Delete error:', error);
            Swal.fire({
              title: 'خطأ!',
              text: 'حدث خطأ أثناء حذف العنصر',
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
    switch (status.toLowerCase()) {
      case 'available':
        return 'نشط';
      case 'returned':
        return 'تم العثور عليه';
      case 'closed':
        return 'مغلق';
      case 'expired':
        return 'منتهي الصلاحية';
      default:
        return status;
    }
  }

  //#region Helpers
  getItemImageUrl(item: FoundItemDto): string {
    return this.imageUrlService.resolve(item.imageUrl || undefined);
  }

  getItemLocation(item: FoundItemDto): string {
    return item.location?.address || 'غير محدد';
  }
  //#endregion
}
