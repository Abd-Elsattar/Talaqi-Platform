// Report Found Item component: handles form and submission for found items.
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FoundItemService } from '../../../../core/services/found-item.service';
import { UploadService } from '../../../../core/services/upload.service';
import { ImageUrlService } from '../../../../core/services/image-url.service';
import { CreateFoundItemDto, ItemCategory, UpdateFoundItemDto } from '../../../../core/models/item';
import { environment } from '../../../../../environments/environment';
import { MapPickerComponent } from '../../../../shared/map-picker/map-picker';

@Component({
  selector: 'app-report-found-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MapPickerComponent, TranslateModule],
  templateUrl: './report-found-item.html',
  styleUrl: './report-found-item.css',
})
export class ReportFoundItem implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private foundItemService = inject(FoundItemService);
  private uploadService = inject(UploadService);
  private imageUrlService = inject(ImageUrlService);
  private translate = inject(TranslateService);

  // ===== Template-bound state =====
  reportForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  isSubmitting = false;
  isUploadingImage = false;
  isDetectingLocation = false;
  locationDetected = false;
  isDefaultImage = false;

  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;
  uploadedImageUrl: string | null = null;

  // ===== Edit mode =====
  isEditMode = false;
  editItemId: string | null = null;
  isLoadingItem = false;

  // ===== Categories =====
  get categories(): { value: ItemCategory; label: string }[] {
    return [
      { value: 'PersonalBelongings', label: this.translate.instant('reportFoundItem.category.personalBelongings') },
      { value: 'People', label: this.translate.instant('reportFoundItem.category.people') },
      { value: 'Pets', label: this.translate.instant('reportFoundItem.category.pets') },
    ];
  }

  constructor() {
    const contactInfoValidator = (control: AbstractControl) => {
      const value = (control.value || '').toString().trim();
      if (!value) return null;
      const emailValid = Validators.email(control) === null;
      const phonePattern = /^(?:\+?\d[\d\s\-]{6,14})$/;
      const phoneValid = phonePattern.test(value);
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
      dateFound: ['', Validators.required],
      contactInfo: ['', [Validators.required, contactInfoValidator]],
      legalResponsibility: [false, Validators.requiredTrue],
    });
  }
  // ================= LOCATION FIELD VALIDATION =================
  isLocationFieldInvalid(fieldName: string): boolean {
    const field = this.reportForm.get('location')?.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty || this.isSubmitting));
  }

  // ================= Lifecycle =================
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const id = params['id'];
      const mode = params['mode'];

      if (id && mode === 'edit') {
        this.isEditMode = true;
        this.editItemId = id;
        this.loadItemForEdit(id);
      } else {
        this.reportForm.patchValue({ dateFound: this.maxDate });
      }
    });
  }

  get maxDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  get isLocationReady(): boolean {
    const loc = this.reportForm.get('location') as FormGroup;
    return (
      this.locationDetected &&
      !!loc.get('address')?.value &&
      !!loc.get('city')?.value &&
      !!loc.get('governorate')?.value
    );
  }

  // ================= Load Edit =================
  loadItemForEdit(id: string): void {
    this.isLoadingItem = true;

    this.foundItemService.getById(id).subscribe({
      next: (res) => {
        this.isLoadingItem = false;
        if (!res.isSuccess || !res.data) {
          this.errorMessage = this.translate.instant('reportFoundItem.errors.loadItemFailed');
          return;
        }

        const item = res.data;
        const dateFound = item.dateFound
          ? new Date(item.dateFound).toISOString().split('T')[0]
          : '';

        this.reportForm.patchValue({
          category: item.category,
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl || '',
          location: {
            address: item.location?.address || '',
            latitude: item.location?.latitude || null,
            longitude: item.location?.longitude || null,
            city: item.location?.city || '',
            governorate: item.location?.governorate || '',
          },
          dateFound,
          contactInfo: item.contactInfo,
          legalResponsibility: true,
        });

        if (item.imageUrl) {
          const resolved = this.imageUrlService.resolve(item.imageUrl);
          this.imagePreviewUrl = resolved;
          this.uploadedImageUrl = resolved;
        }
      },
      error: () => {
        this.isLoadingItem = false;
        this.errorMessage = this.translate.instant('reportFoundItem.errors.loadItemError');
      },
    });
  }

  // ================= Image Handling =================
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.handleFile(input.files[0]);
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files?.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  private handleFile(file: File): void {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      this.errorMessage = this.translate.instant('reportFoundItem.errors.imageFormat');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = this.translate.instant('reportFoundItem.errors.imageSize');
      return;
    }

    this.selectedImage = file;
    const reader = new FileReader();
    reader.onload = (e) => (this.imagePreviewUrl = e.target?.result as string);
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
        this.errorMessage = this.translate.instant('reportFoundItem.errors.uploadFailed');
      },
    });
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreviewUrl = null;
    this.uploadedImageUrl = null;
    this.reportForm.patchValue({ imageUrl: '' });
  }

  // ================= Location =================
  detectLocation(): void {
    if (!navigator.geolocation) {
      this.errorMessage = this.translate.instant('reportFoundItem.errors.locationNotSupported');
      return;
    }

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
        this.errorMessage = this.translate.instant('reportFoundItem.errors.locationDetectionFailed');
      }
    );
  }

  clearLocation(): void {
    this.reportForm.patchValue({
      location: {
        latitude: null,
        longitude: null,
        address: '',
        city: '',
        governorate: '',
      },
    });
    this.locationDetected = false;
  }

  onLocationSelected(sel: {
    latitude: number;
    longitude: number;
    address: string | null;
    city: string | null;
    governorate: string | null;
  }): void {
    this.reportForm.patchValue({
      location: {
        latitude: sel.latitude,
        longitude: sel.longitude,
        address: sel.address || '',
        city: sel.city || '',
        governorate: sel.governorate || '',
      },
    });
    this.locationDetected = true;
  }

  areCoordinatesInvalid(): boolean {
    const loc = this.reportForm.get('location') as FormGroup;
    return !!(loc.get('latitude')?.invalid && (loc.get('latitude')?.touched || this.isSubmitting));
  }

  // ================= Submit =================
  onSubmit(): void {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      this.errorMessage = this.translate.instant('reportFoundItem.errors.completeRequired');
      return;
    }

    this.isSubmitting = true;
    const v = this.reportForm.value;

    const dto: CreateFoundItemDto = {
      category: v.category,
      title: v.title,
      description: v.description,
      imageUrl: v.imageUrl,
      location: v.location,
      dateFound: new Date(v.dateFound).toISOString(),
      contactInfo: v.contactInfo,
    };

    this.foundItemService.create(dto).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/home']);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = this.translate.instant('reportFoundItem.errors.submitFailed');
      },
    });
  }

  // ================= Validation helpers =================
  isFieldInvalid(name: string): boolean {
    const f = this.reportForm.get(name);
    return !!(f && f.invalid && (f.touched || f.dirty));
  }

  getFieldError(name: string): string {
    const f = this.reportForm.get(name);
    if (f?.hasError('required')) return this.translate.instant('reportFoundItem.errors.required');
    if (f?.hasError('maxlength'))
      return this.translate.instant('reportFoundItem.errors.maxlength', { max: f.getError('maxlength').requiredLength });
    if (name === 'contactInfo' && f?.hasError('contactInvalid'))
      return this.translate.instant('reportFoundItem.errors.contactInvalid');
    return '';
  }

  isImageInvalid(): boolean {
    const c = this.reportForm.get('imageUrl');
    return !!(c && c.invalid && (c.touched || this.isSubmitting));
  }

  getImageError(): string {
    return this.translate.instant('reportFoundItem.errors.imageRequired');
  }
}
