// Found Item Detail component: displays a specific found item's information.
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { FoundItemService } from '../../../../core/services/found-item.service';
import { TokenService } from '../../../../core/services/token.service';
import { FoundItemDto } from '../../../../core/models/item';
import { ImageUrlService } from '../../../../core/services/image-url.service';

@Component({
  selector: 'app-found-item-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './found-item-detail.html',
  styleUrl: './found-item-detail.css',
})
export class FoundItemDetail implements OnInit {
  //#region Injected Services
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private foundItemService = inject(FoundItemService);
  private tokenService = inject(TokenService);
  private translate = inject(TranslateService);
  // Public so template can call resolve directly if needed
  imageUrlService = inject(ImageUrlService);
  //#endregion

  foundItem: FoundItemDto | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  isOwner = false;
  modalImageUrl: string | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFoundItem(id);
    }
  }

  loadFoundItem(id: string) {
    this.isLoading = true;
    this.errorMessage = null;

    this.foundItemService.getById(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess && response.data) {
          this.foundItem = response.data;
          this.checkOwnership();
        } else {
          this.errorMessage = this.translate.instant('foundItemDetail.errorNotFound');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = this.translate.instant('foundItemDetail.errorLoadFailed');
        console.error('Error loading found item:', error);
      },
    });
  }

  checkOwnership() {
    const currentUser = this.tokenService.getCurrentUser();
    if (currentUser && this.foundItem) {
      this.isOwner = currentUser.id === this.foundItem.userId;
    }
  }

  deleteItem() {
    if (!this.foundItem) return;

    Swal.fire({
      title: this.translate.instant('foundItemDetail.deleteConfirm.title'),
      text: this.translate.instant('foundItemDetail.deleteConfirm.text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.translate.instant('foundItemDetail.deleteConfirm.confirmButton'),
      cancelButtonText: this.translate.instant('foundItemDetail.deleteConfirm.cancelButton'),
    }).then((result) => {
      if (result.isConfirmed && this.foundItem) {
        this.foundItemService.delete(this.foundItem.id).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              Swal.fire({
                title: this.translate.instant('foundItemDetail.deleteConfirm.successTitle'),
                text: this.translate.instant('foundItemDetail.deleteConfirm.successText'),
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
              }).then(() => {
                this.router.navigate(['/found-items']);
              });
            }
          },
          error: (error) => {
            Swal.fire({
              title: this.translate.instant('foundItemDetail.deleteConfirm.errorTitle'),
              text: this.translate.instant('foundItemDetail.deleteConfirm.errorText'),
              icon: 'error',
            });
          },
        });
      }
    });
  }

  getStatusBadgeClass(): string {
    if (!this.foundItem) return 'badge-secondary';
    switch (this.foundItem.status.toLowerCase()) {
      case 'active':
        return 'badge-success';
      case 'found':
        return 'badge-primary';
      case 'closed':
        return 'badge-secondary';
      default:
        return 'badge-secondary';
    }
  }

  getStatusText(): string {
    if (!this.foundItem) return '';
    const status = this.foundItem.status.toLowerCase();
    const translationKey = `foundItemDetail.status.${status}`;
    const translated = this.translate.instant(translationKey);
    // If translation key not found, return original status
    return translated !== translationKey ? translated : this.foundItem.status;
  }

  openImageModal(url: string) {
    this.modalImageUrl = url;
    document.body.style.overflow = 'hidden';
  }

  closeImageModal() {
    this.modalImageUrl = null;
    document.body.style.overflow = '';
  }
}
