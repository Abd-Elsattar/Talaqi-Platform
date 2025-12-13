// My Lost Items component: loads and manages user's lost items list.
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LostItemService } from '../../../../core/services/lost-item.service';
import { LostItemDto, LostItemStatus } from '../../../../core/models/item';
import { ImageUrlService } from '../../../../core/services/image-url.service';

@Component({
  selector: 'app-my-lost-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-lost-items.html',
  styleUrl: './my-lost-items.css',
})
export class MyLostItems implements OnInit {
  LostItemStatus = LostItemStatus;
  //#region Injected Services
  private lostItemService = inject(LostItemService);
  private router = inject(Router);
  imageUrlService = inject(ImageUrlService);
  //#endregion

  items: LostItemDto[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  emptyMessage = 'لم تقم بالإبلاغ عن أي عناصر مفقودة بعد';

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
          this.errorMessage = res.message || 'فشل في تحميل عناصرك المفقودة';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading my items:', err);
        this.errorMessage = 'حدث خطأ أثناء تحميل عناصرك المفقودة';
      },
    });
  }

  //#region Helpers
  getItemImageUrl(imageUrl?: string): string {
    return this.imageUrlService.resolve(imageUrl);
  }

  getCategoryLabel(category: string): string {
    const categoryMap: { [key: string]: string } = {
      PersonalBelongings: 'متعلقات شخصية',
      People: 'أشخاص',
      Pets: 'حيوانات أليفة',
    };
    return categoryMap[category] || category;
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      Active: 'نشط',
      Found: 'تم العثور عليه',
      Closed: 'مغلق',
      Expired: 'منتهي الصلاحية',
    };
    return statusMap[status] || status;
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
        this.lostItemService.delete(itemId).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              Swal.fire({
                title: 'تم الحذف!',
                text: 'تم حذف العنصر بنجاح',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
              });
              this.items = this.items.filter((item) => item.id !== itemId);
            } else {
              Swal.fire({
                title: 'خطأ!',
                text: res.message || 'فشل حذف العنصر',
                icon: 'error',
              });
            }
          },
          error: (err) => {
            console.error('Delete error:', err);
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
        title: 'غير مسموح',
        text: 'لا يمكن إعادة العنصر إلى حالة "نشط" بعد أن تم وضعه كـ "تم العثور عليه" أو "مغلق".',
        icon: 'warning',
        confirmButtonText: 'حسناً',
        customClass: { confirmButton: 'btn btn-primary' },
      });
      return;
    }

    if (item.status === newStatus) return;
    const result = await Swal.fire({
      title: 'تأكيد تغيير الحالة',
      text: `هل أنت متأكد أنك تريد تغيير حالة العنصر إلى "${this.getStatusLabel(newStatus)}"؟`,
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
