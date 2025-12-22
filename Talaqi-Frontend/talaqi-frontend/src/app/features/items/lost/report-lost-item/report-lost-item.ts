// Report Lost Item component: handles form and submission for lost items.
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgFor, DecimalPipe } from '@angular/common';
import { MapPickerComponent } from '../../../../shared/map-picker/map-picker';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LostItemService } from '../../../../core/services/lost-item.service';
import { UploadService } from '../../../../core/services/upload.service';
import { ImageUrlService } from '../../../../core/services/image-url.service';
import { CreateLostItemDto, ItemCategory, UpdateLostItemDto } from '../../../../core/models/item';
import { environment } from '../../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-report-lost-item',
  standalone: true,
  imports: [CommonModule, NgFor, DecimalPipe, ReactiveFormsModule, RouterLink, MapPickerComponent, TranslateModule],
  templateUrl: './report-lost-item.html',
  styleUrl: './report-lost-item.css',
})
export class ReportLostItem implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private lostItemService = inject(LostItemService);
  private uploadService = inject(UploadService);
  private imageUrlService = inject(ImageUrlService);
  private translate = inject(TranslateService);

  reportForm: FormGroup;
  isSubmitting = false;
  isUploadingImage = false;
  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;
  uploadedImageUrl: string | null = null;

  // متروك فقط لتفادي كسر الـ HTML
  successMessage: string | null = null;

  errorMessage: string | null = null;
  isDetectingLocation = false;
  locationDetected = false;
  isDefaultImage = false;

  get isLocationReady(): boolean {
    const loc = this.reportForm.get('location') as FormGroup;
    return (
      this.locationDetected &&
      !!loc.get('address')?.value &&
      !!loc.get('city')?.value &&
      !!loc.get('governorate')?.value
    );
  }

  isEditMode = false;
  editItemId: string | null = null;
  isLoadingItem = false;

  get categories(): { value: ItemCategory; label: string }[] {
    return [
      { value: 'PersonalBelongings', label: this.translate.instant('reportLostItem.category.personalBelongings') },
      { value: 'People', label: this.translate.instant('reportLostItem.category.people') },
      { value: 'Pets', label: this.translate.instant('reportLostItem.category.pets') },
    ];
  }

  constructor() {
    const contactInfoValidator = (control: AbstractControl) => {
      const value = (control.value || '').toString().trim();
      if (!value) return null;
      const emailValid = Validators.email(control) === null;
      const phoneValid = /^(?:\+?\d[\d\s\-]{6,14})$/.test(value);
      return emailValid || phoneValid ? null : { contactInvalid: true };
    };

    this.reportForm = this.fb.group({
      category: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      location: this.fb.group({
        address: ['', Validators.required],
        latitude: [null, Validators.required],
        longitude: [null, Validators.required],
        city: ['', Validators.required],
        governorate: ['', Validators.required],
      }),
      dateLost: ['', Validators.required],
      contactInfo: ['', [Validators.required, contactInfoValidator]],
      legalResponsibility: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['id'] && params['mode'] === 'edit') {
        this.isEditMode = true;
        this.editItemId = params['id'];
        this.loadItemForEdit(params['id']);
      } else {
        this.reportForm.patchValue({
          dateLost: new Date().toISOString().split('T')[0],
        });
      }
    });
  }
  get maxDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  loadItemForEdit(id: string): void {
    this.isLoadingItem = true;
    this.lostItemService.getById(id).subscribe({
      next: (res) => {
        this.isLoadingItem = false;
        if (res.isSuccess && res.data) {
          const item = res.data;
          this.reportForm.patchValue({
            category: item.category,
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl || '',
            location: item.location,
            dateLost: item.dateLost ? new Date(item.dateLost).toISOString().split('T')[0] : '',
            contactInfo: item.contactInfo,
            legalResponsibility: true,
          });

          if (item.imageUrl) {
            const resolved = this.imageUrlService.resolve(item.imageUrl);
            this.imagePreviewUrl = resolved;
            this.uploadedImageUrl = resolved;
          }
        }
      },
      error: () => {
        this.isLoadingItem = false;
        this.errorMessage = this.translate.instant('reportLostItem.errors.loadItemFailed');
      },
    });
  }

  // ================= IMAGE =================

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.handleFile(input.files[0]);
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files?.length) this.handleFile(event.dataTransfer.files[0]);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  private handleFile(file: File): void {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      this.errorMessage = this.translate.instant('reportLostItem.errors.imageFormat');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = this.translate.instant('reportLostItem.errors.imageSize');
      return;
    }

    this.selectedImage = file;
    const reader = new FileReader();
    reader.onload = () => (this.imagePreviewUrl = reader.result as string);
    reader.readAsDataURL(file);
    this.uploadImage();
  }

  private uploadImage(): void {
    if (!this.selectedImage) return;

    this.isUploadingImage = true;
    this.uploadService.uploadImage(this.selectedImage).subscribe({
      next: (res: any) => {
        this.isUploadingImage = false;
        if (res?.imageUrl) {
          const resolved = this.imageUrlService.resolve(res.imageUrl);
          this.uploadedImageUrl = resolved;
          this.reportForm.patchValue({ imageUrl: resolved });
        }
      },
      error: () => {
        this.isUploadingImage = false;
        this.errorMessage = this.translate.instant('reportLostItem.errors.uploadFailed');
      },
    });
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreviewUrl = null;
    this.uploadedImageUrl = null;
    this.reportForm.patchValue({ imageUrl: '' });
  }

  // ================= SUBMIT =================

  onSubmit(): void {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      this.errorMessage = this.translate.instant('reportLostItem.errors.completeRequired');
      return;
    }

    this.isSubmitting = true;
    const v = this.reportForm.value;
    const dateLost = new Date(v.dateLost).toISOString();

    const onSuccess = (msg: string, nav: string) => {
      this.isSubmitting = false;
      Swal.fire({
        icon: 'success',
        title: this.translate.instant('reportLostItem.success'),
        text: msg,
        confirmButtonText: this.translate.instant('lostItemDetail.closeModal'),
      }).then(() => this.router.navigate([nav]));
    };

    if (this.isEditMode && this.editItemId) {
      const dto: UpdateLostItemDto = {
        ...v,
        dateLost,
        imageUrl: this.imageUrlService.resolve(v.imageUrl),
      };

      this.lostItemService.update(this.editItemId, dto).subscribe({
        next: (res) =>
          res.isSuccess
            ? onSuccess(res.message || this.translate.instant('reportLostItem.messages.reportUpdated'), '/my-lost-items')
            : (this.errorMessage = res.message),
        error: () => {
          this.isSubmitting = false;
          this.errorMessage = this.translate.instant('reportLostItem.errors.updateFailed');
        },
      });
    } else {
      const dto: CreateLostItemDto = {
        ...v,
        dateLost,
        imageUrl: this.imageUrlService.resolve(v.imageUrl),
      };

      this.lostItemService.create(dto).subscribe({
        next: (res) =>
          res.isSuccess
            ? onSuccess(res.message || this.translate.instant('reportLostItem.messages.reportSubmitted'), '/home')
            : (this.errorMessage = res.message),
        error: () => {
          this.isSubmitting = false;
          this.errorMessage = this.translate.instant('reportLostItem.errors.submitFailed');
        },
      });
    }
  }

  // ================= VALIDATION HELPERS =================

  isFieldInvalid(name: string): boolean {
    const c = this.reportForm.get(name);
    return !!(c && c.invalid && (c.touched || c.dirty));
  }

  isLocationFieldInvalid(name: string): boolean {
    const c = this.reportForm.get('location')?.get(name);
    return !!(c && c.invalid && (c.touched || c.dirty));
  }

  getFieldError(name: string): string {
    const c = this.reportForm.get(name);
    if (c?.hasError('required')) return this.translate.instant('reportLostItem.errors.required');
    if (c?.hasError('maxlength')) return this.translate.instant('reportLostItem.errors.maxlength');
    if (name === 'contactInfo' && c?.hasError('contactInvalid')) return this.translate.instant('reportLostItem.errors.contactInvalid');
    return '';
  }

  areCoordinatesInvalid(): boolean {
    const loc = this.reportForm.get('location') as FormGroup;
    return !!(loc.get('latitude')?.invalid || loc.get('longitude')?.invalid);
  }

  detectLocation(): void {
    if (!navigator.geolocation) return;
    this.isDetectingLocation = true;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.isDetectingLocation = false;
        this.locationDetected = true;
        this.reportForm.patchValue({
          location: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
        });
      },
      () => {
        this.isDetectingLocation = false;
        this.errorMessage = this.translate.instant('reportLostItem.errors.locationDetectionFailed');
      }
    );
  }

  clearLocation(): void {
    this.locationDetected = false;
    this.reportForm.patchValue({
      location: {
        latitude: null,
        longitude: null,
        address: '',
        city: '',
        governorate: '',
      },
    });
  }

  onLocationSelected(loc: any): void {
    this.locationDetected = true;
    this.reportForm.patchValue({ location: loc });
  }

  isImageInvalid(): boolean {
    const c = this.reportForm.get('imageUrl');
    return !!(c && c.invalid && (c.touched || this.isSubmitting));
  }

  getImageError(): string {
    return this.translate.instant('reportLostItem.errors.imageRequired');
  }
}
