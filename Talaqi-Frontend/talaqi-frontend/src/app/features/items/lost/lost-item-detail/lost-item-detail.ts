// Lost Item Detail component: displays a specific lost item's information.
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryTranslatePipe } from '../../../../shared/pipes/category-translate.pipe';
import { LostItemService } from '../../../../core/services/lost-item.service';
import { TokenService } from '../../../../core/services/token.service';
import { LostItemDto } from '../../../../core/models/item';
import { ImageUrlService } from '../../../../core/services/image-url.service';

@Component({
  selector: 'app-lost-item-detail',
  standalone: true,
  imports: [CommonModule, CategoryTranslatePipe],
  templateUrl: './lost-item-detail.html',
  styleUrl: './lost-item-detail.css',
})
// Detail page for lost items
export class LostItemDetail implements OnInit {
  //#region Injected Services
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private lostItemService = inject(LostItemService);
  private tokenService = inject(TokenService);
  imageUrlService = inject(ImageUrlService);
  //#endregion

  item: LostItemDto | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  modalImageUrl: string | null = null;

  ngOnInit() {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.loadItem(itemId);
    } else {
      this.errorMessage = 'معرّف العنصر غير صحيح';
      this.isLoading = false;
    }
  }

  loadItem(id: string) {
    this.isLoading = true;
    this.errorMessage = null;

    this.lostItemService.getById(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.isSuccess && res.data) {
          this.item = res.data;
        } else {
          this.errorMessage = 'فشل في تحميل تفاصيل العنصر';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'حدث خطأ أثناء تحميل تفاصيل العنصر';
        console.error('Error loading item:', err);
      },
    });
  }

  //#region Helpers
  getItemImageUrl(imageUrl?: string): string {
    return this.imageUrlService.resolve(imageUrl);
  }

  getUserImageUrl(item?: LostItemDto | null): string {
    const candidate =
      item &&
      (item.userProfilePicture ||
        (item as any).userProfilePictureUrl ||
        (item as any).profilePictureUrl);
    const trimmed = (candidate || '').toString().trim();
    if (!trimmed) {
      return '/images/Default User Icon.jpg';
    }
    return this.imageUrlService.resolve(trimmed);
  }
  //#endregion

  goBack() {
    this.router.navigate(['/home']);
  }

  shareItem() {
    if (this.item) {
      const text = `تم العثور على عنصر مفقود: ${this.item.title}\n${this.item.description}\nالموقع: ${this.item.location?.city}`;
      if (navigator.share) {
        navigator.share({
          title: this.item.title,
          text: text,
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
          alert('تم نسخ التفاصيل إلى الحافظة');
        });
      }
    }
  }

  contactUser() {
    if (this.item && this.item.contactInfo) {
      window.open(`mailto:${this.item.contactInfo}`, '_blank');
    }
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
