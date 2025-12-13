// Report Found Item component: handles form and submission for found items.
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor, DecimalPipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FoundItemService } from '../../../../core/services/found-item.service';
import { UploadService } from '../../../../core/services/upload.service';
import { ImageUrlService } from '../../../../core/services/image-url.service';
import { CreateFoundItemDto, ItemCategory, UpdateFoundItemDto } from '../../../../core/models/item';
import { environment } from '../../../../../environments/environment';
import { MapPickerComponent } from '../../../../shared/map-picker/map-picker';

@Component({
  selector: 'app-report-found-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MapPickerComponent],
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

  reportForm: FormGroup;
  isSubmitting = false;
  isUploadingImage = false;
  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;
  uploadedImageUrl: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isDetectingLocation = false;
  locationDetected = false;
  isDefaultImage = false;
  // Derived UI state
  get isLocationReady(): boolean {
    const loc = this.reportForm.get('location') as FormGroup;
    const address = (loc.get('address')?.value || '').toString().trim();
    const city = (loc.get('city')?.value || '').toString().trim();
    const governorate = (loc.get('governorate')?.value || '').toString().trim();
    return this.locationDetected && !!address && !!city && !!governorate;
  }

  // Edit mode
  isEditMode = false;
  editItemId: string | null = null;
  isLoadingItem = false;

  // Category options with Arabic labels
  categories: { value: ItemCategory; label: string }[] = [
    { value: 'PersonalBelongings', label: 'متعلقات شخصية' },
    { value: 'People', label: 'أشخاص' },
    { value: 'Pets', label: 'حيوانات أليفة' },
  ];

  constructor() {
    // Validator: accept either a valid email or a phone number
    const contactInfoValidator = (control: AbstractControl) => {
      const value = (control.value || '').toString().trim();
      if (!value) return null; // required handled separately
      const emailValid = Validators.email(control) === null;
      const phonePattern = /^(?:\+?\d[\d\s\-]{6,14})$/; // simple international/local phone
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

  ngOnInit() {
    // Check for edit mode
    this.route.queryParams.subscribe((params) => {
      const id = params['id'];
      const mode = params['mode'];

      if (id && mode === 'edit') {
        this.isEditMode = true;
        this.editItemId = id;
        this.loadItemForEdit(id);
      } else {
        // Set default date to today for new items
        const today = new Date().toISOString().split('T')[0];
        this.reportForm.patchValue({ dateFound: today });
      }
    });
  }

  loadItemForEdit(id: string) {
    this.isLoadingItem = true;
    this.foundItemService.getById(id).subscribe({
      next: (response) => {
        this.isLoadingItem = false;
        if (response.isSuccess && response.data) {
          const item = response.data;

          // Convert date to YYYY-MM-DD format
          const dateFound = item.dateFound
            ? new Date(item.dateFound).toISOString().split('T')[0]
            : '';

          // Populate form
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
            dateFound: dateFound,
            contactInfo: item.contactInfo,
            legalResponsibility: true,
          });

          // Set image preview if exists (normalize to absolute)
          if (item.imageUrl) {
            const resolved = this.imageUrlService.resolve(item.imageUrl);
            this.imagePreviewUrl = resolved;
            this.uploadedImageUrl = resolved;
            this.isDefaultImage = false;
          } else {
            // Use default placeholder image if no image exists
            const defaultImage = '/images/lost-and-found-.png';
            this.imagePreviewUrl = defaultImage;
            this.uploadedImageUrl = defaultImage;
            this.reportForm.patchValue({ imageUrl: defaultImage });
            this.isDefaultImage = true;
          }
        } else {
          this.errorMessage = 'فشل في تحميل بيانات العنصر';
        }
      },
      error: (error) => {
        this.isLoadingItem = false;
        console.error('Error loading item:', error);
        this.errorMessage = 'حدث خطأ أثناء تحميل بيانات العنصر';
      },
    });
  }

  get maxDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  private handleFile(file: File): void {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      this.errorMessage = 'يرجى اختيار صورة بصيغة JPG، PNG أو GIF';
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.errorMessage = 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت';
      return;
    }

    this.errorMessage = null;
    this.isDefaultImage = false;

    // Process image: fit entirely into 4:3 white background
    this.fitContainOnWhiteBackground(file, 4, 3, 1200)
      .then((cropped) => {
        this.selectedImage = cropped;
        // Preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreviewUrl = e.target?.result as string;
        };
        reader.readAsDataURL(cropped);
        // Upload image immediately
        this.uploadImage();
      })
      .catch((err) => {
        console.error('Image crop failed:', err);
        // Fallback to original file
        this.selectedImage = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreviewUrl = e.target?.result as string;
        };
        reader.readAsDataURL(file);
        this.uploadImage();
      });
  }

  // Fit the full image inside a fixed 4:3 canvas with white background (no cropping)
  private fitContainOnWhiteBackground(
    file: File,
    aspectW: number = 4,
    aspectH: number = 3,
    maxWidth: number = 1200
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const targetAspect = aspectW / aspectH;
          // Output dimensions: scale canvas width (4:3) up to maxWidth
          const outWidth = Math.min(maxWidth, img.width);
          const outHeight = Math.round(outWidth / targetAspect);

          const canvas = document.createElement('canvas');
          canvas.width = outWidth;
          canvas.height = outHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas context not available'));

          // Fill white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, outWidth, outHeight);

          // Compute scale to fit (contain) while keeping full image visible
          const scale = Math.min(outWidth / img.width, outHeight / img.height);
          const drawWidth = Math.round(img.width * scale);
          const drawHeight = Math.round(img.height * scale);
          const dx = Math.round((outWidth - drawWidth) / 2);
          const dy = Math.round((outHeight - drawHeight) / 2);

          // High-quality scaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, img.width, img.height, dx, dy, drawWidth, drawHeight);

          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error('Failed to create blob'));
              const croppedFile = new File([blob], this.makeDerivedFilename(file.name, 'cropped'), {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(croppedFile);
            },
            'image/jpeg',
            0.9
          );
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = (e) => reject(e);
      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result as string;
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  private makeDerivedFilename(name: string, suffix: string): string {
    const dot = name.lastIndexOf('.');
    const base = dot > 0 ? name.substring(0, dot) : name;
    return `${base}.${suffix}.jpg`;
  }

  private uploadImage(): void {
    if (!this.selectedImage) return;

    this.isUploadingImage = true;
    this.errorMessage = null;

    console.log('Starting image upload with file:', {
      name: this.selectedImage.name,
      size: this.selectedImage.size,
      type: this.selectedImage.type,
    });

    this.uploadService.uploadImage(this.selectedImage).subscribe({
      next: (response: any) => {
        this.isUploadingImage = false;

        console.log('Raw upload response:', JSON.stringify(response, null, 2));

        try {
          // The API returns: { imageUrl: "..." }
          if (response && typeof response === 'object' && 'imageUrl' in response) {
            const imageUrl = response.imageUrl;
            if (imageUrl && typeof imageUrl === 'string') {
              console.log('✓ Image uploaded successfully:', imageUrl);
              const resolved = this.imageUrlService.resolve(imageUrl);
              this.uploadedImageUrl = resolved;
              this.reportForm.patchValue({ imageUrl: resolved });
              return;
            }
          }

          // If we reach here, response structure is unexpected
          console.warn('Unexpected response structure:', response);
          this.errorMessage = 'فشل تحميل الصورة - بنية الاستجابة غير متوقعة';
        } catch (e) {
          console.error('Error processing upload response:', e);
          this.errorMessage = 'خطأ في معالجة استجابة تحميل الصورة';
        }
      },
      error: (error: any) => {
        this.isUploadingImage = false;
        console.error('Upload error - Full details:', {
          status: error?.status,
          statusText: error?.statusText,
          message: error?.message,
          error: error?.error,
          url: error?.url,
          fullError: error,
        });

        let errorMsg = 'فشل تحميل الصورة. ';

        if (!error) {
          errorMsg += 'خطأ غير معروف.';
        } else if (error.status === 0) {
          errorMsg += 'لا يمكن الاتصال بالخادم على ' + environment.apiUrl;
        } else if (error.status === 400) {
          errorMsg += error.error?.message || 'البيانات المرسلة غير صحيحة.';
        } else if (error.status === 401) {
          errorMsg += 'يرجى تسجيل الدخول أولاً.';
        } else if (error.status === 413) {
          errorMsg += 'حجم الصورة كبير جداً (الحد الأقصى 5 ميجابايت).';
        } else if (error.status === 415) {
          errorMsg += 'نوع الملف غير مدعوم. استخدم JPG, PNG أو GIF.';
        } else if (error.status >= 500) {
          errorMsg += 'خطأ في الخادم: ' + (error.error?.message || 'خطأ غير معروف');
        } else {
          errorMsg += `خطأ ${error.status}: ${
            error.error?.message || error.message || 'غير معروف'
          }`;
        }

        this.errorMessage = errorMsg;
      },
    });
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreviewUrl = null;
    this.uploadedImageUrl = null;
    this.reportForm.patchValue({ imageUrl: '' });
  }

  onSubmit(): void {
    if (this.reportForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.reportForm.controls).forEach((key) => {
        this.reportForm.get(key)?.markAsTouched();
      });

      const locationGroup = this.reportForm.get('location') as FormGroup;
      Object.keys(locationGroup.controls).forEach((key) => {
        locationGroup.get(key)?.markAsTouched();
      });

      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formValue = this.reportForm.value;

    console.log('Form value before submission:', formValue);
    console.log('Uploaded image URL:', this.uploadedImageUrl);

    // Convert date string (YYYY-MM-DD) to ISO datetime string
    const dateFoundString = formValue.dateFound;
    const dateFoundDateTime = dateFoundString
      ? new Date(dateFoundString).toISOString()
      : new Date().toISOString();

    if (this.isEditMode && this.editItemId) {
      // Update existing item
      const updateDto: UpdateFoundItemDto = {
        category: formValue.category,
        title: formValue.title,
        description: formValue.description,
        imageUrl: this.imageUrlService.resolve(formValue.imageUrl || undefined) || undefined,
        location: {
          address: formValue.location.address,
          latitude: formValue.location.latitude || undefined,
          longitude: formValue.location.longitude || undefined,
          city: formValue.location.city || undefined,
          governorate: formValue.location.governorate || undefined,
        },
        dateFound: dateFoundDateTime,
        contactInfo: formValue.contactInfo,
      };

      console.log('Updating found item with DTO:', updateDto);

      this.foundItemService.update(this.editItemId, updateDto).subscribe({
        next: (response) => {
          console.log('Found item update response:', response);
          if (response.isSuccess) {
            this.successMessage = response.message || 'تم تحديث العنصر الموجود بنجاح!';
            this.isSubmitting = false;

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Navigate to my-found-items after 2 seconds
            setTimeout(() => {
              this.router.navigate(['/my-found-items']);
            }, 2000);
          } else {
            this.errorMessage = response.message || 'فشل تحديث العنصر الموجود';
            this.isSubmitting = false;
          }
        },
        error: (error) => {
          console.error('Update error details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error,
            url: error.url,
          });
          this.errorMessage =
            error.error?.message || 'حدث خطأ أثناء تحديث العنصر. يرجى المحاولة مرة أخرى';
          this.isSubmitting = false;
        },
      });
    } else {
      // Create new item
      const createDto: CreateFoundItemDto = {
        category: formValue.category,
        title: formValue.title,
        description: formValue.description,
        imageUrl: this.imageUrlService.resolve(formValue.imageUrl || undefined) || undefined,
        location: {
          address: formValue.location.address,
          latitude: formValue.location.latitude || undefined,
          longitude: formValue.location.longitude || undefined,
          city: formValue.location.city || undefined,
          governorate: formValue.location.governorate || undefined,
        },
        dateFound: dateFoundDateTime,
        contactInfo: formValue.contactInfo,
      };

      console.log('Creating found item with DTO:', createDto);

      this.foundItemService.create(createDto).subscribe({
        next: (response) => {
          console.log('Found item creation response:', response);
          if (response.isSuccess) {
            this.successMessage = response.message || 'تم الإبلاغ عن العنصر الموجود بنجاح!';
            this.isSubmitting = false;

            // Reset form
            this.reportForm.reset();
            this.removeImage();
            this.locationDetected = false;

            // Set default date again
            const today = new Date().toISOString().split('T')[0];
            this.reportForm.patchValue({ dateFound: today });

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Navigate to home after 2 seconds
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 2000);
          } else {
            this.errorMessage = response.message || 'فشل الإبلاغ عن العنصر الموجود';
            this.isSubmitting = false;
          }
        },
        error: (error) => {
          console.error('Submit error details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error,
            url: error.url,
          });
          this.errorMessage =
            error.error?.message || 'حدث خطأ أثناء الإبلاغ عن العنصر. يرجى المحاولة مرة أخرى';
          this.isSubmitting = false;
        },
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.reportForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  isLocationFieldInvalid(fieldName: string): boolean {
    const field = this.reportForm.get('location')?.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  getFieldError(fieldName: string): string {
    const field = this.reportForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'هذا الحقل مطلوب';
    }
    if (field?.hasError('maxlength')) {
      return `يجب أن لا يتجاوز ${field.getError('maxlength').requiredLength} حرف`;
    }
    if (fieldName === 'contactInfo' && field?.hasError('contactInvalid')) {
      return 'يرجى إدخال رقم هاتف أو بريد إلكتروني صالح';
    }
    return '';
  }

  // Coordinates validation helper for live feedback
  areCoordinatesInvalid(): boolean {
    const loc = this.reportForm.get('location') as FormGroup;
    const lat = loc.get('latitude');
    const lon = loc.get('longitude');
    const invalid = !!(lat && lon && (lat.invalid || lon.invalid));
    const interacted =
      this.isSubmitting ||
      !!(lat && (lat.touched || lat.dirty)) ||
      !!(lon && (lon.touched || lon.dirty));
    return invalid && interacted;
  }

  detectLocation(): void {
    if (!navigator.geolocation) {
      this.errorMessage = 'متصفحك لا يدعم تحديد الموقع الجغرافي';
      return;
    }

    this.isDetectingLocation = true;
    this.errorMessage = null;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // First, update coordinates
        this.reportForm.patchValue({
          location: {
            latitude: latitude,
            longitude: longitude,
          },
        });

        this.locationDetected = true;
        console.log('Location detected:', { latitude, longitude });

        // Reverse geocoding to get address details (high zoom for more details)
        this.reverseGeocode(latitude, longitude, 18);
      },
      (error) => {
        this.isDetectingLocation = false;
        console.error('Geolocation error:', error);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.errorMessage =
              'تم رفض الإذن للوصول إلى موقعك. يرجى السماح بالوصول للموقع في إعدادات المتصفح';
            break;
          case error.POSITION_UNAVAILABLE:
            this.errorMessage = 'معلومات الموقع غير متوفرة';
            break;
          case error.TIMEOUT:
            this.errorMessage = 'انتهت مهلة طلب تحديد الموقع';
            break;
          default:
            this.errorMessage = 'حدث خطأ أثناء تحديد الموقع';
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  clearLocation(): void {
    this.reportForm.patchValue({
      location: {
        latitude: null,
        longitude: null,
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

    const loc = this.reportForm.get('location') as FormGroup;
    loc.get('latitude')?.markAsTouched();
    loc.get('longitude')?.markAsTouched();
    loc.get('address')?.markAsTouched();
    loc.get('city')?.markAsTouched();
    loc.get('governorate')?.markAsTouched();
  }

  private reverseGeocode(latitude: number, longitude: number, zoom: number = 16): void {
    // Using Nominatim (OpenStreetMap) for reverse geocoding
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=ar&zoom=${zoom}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.isDetectingLocation = false;

        if (data && data.address) {
          const address = data.address;

          // Extract address components
          const roadOrStreet =
            address.road || address.street || address.neighbourhood || address.residential || '';
          const district = address.suburb || address.district || address.city_district || '';
          // Prefer specific city fields, fallback to town/village/county
          const city =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            address.county ||
            '';
          // Governorate/State mapping (common for Egypt and similar locales)
          const governorate =
            address.state || address.region || address.province || address.state_district || '';

          // Build full address with house number if available
          const houseNumber = address.house_number || '';
          const streetLine = [houseNumber, roadOrStreet].filter((x) => x && x.trim()).join(' ');
          const fullAddress = [streetLine, district].filter((x) => x && x.trim()).join(', ');

          // Update form with detected location details
          this.reportForm.patchValue({
            location: {
              address: (fullAddress || data.display_name || 'تم تحديد الموقع').trim(),
              city: (city || '').trim(),
              governorate: (governorate || '').trim(),
            },
          });

          console.log('Address detected:', { address: fullAddress, city, governorate });

          // If critical fields missing, try a second pass with deeper zoom
          if ((!city || !governorate) && zoom < 18) {
            this.reverseGeocode(latitude, longitude, 18);
          }
        } else {
          this.reportForm.patchValue({
            location: {
              address: 'تم تحديد الموقع بنجاح - يتعذر جلب التفاصيل حالياً',
            },
          });
        }
      })
      .catch((error) => {
        this.isDetectingLocation = false;
        console.error('Reverse geocoding error:', error);
        // Still mark location as detected even if reverse geocoding fails
        this.reportForm.patchValue({
          location: {
            address: 'تم تحديد الموقع - يتعذر جلب التفاصيل حالياً',
          },
        });
      });
  }
  // ================= IMAGE VALIDATION =================

  isImageInvalid(): boolean {
    const control = this.reportForm.get('imageUrl');
    return !!(control && control.invalid && (control.touched || this.isSubmitting));
  }

  getImageError(): string {
    const control = this.reportForm.get('imageUrl');
    if (!control) return '';

    if (control.hasError('required')) {
      return 'هذا الحقل مطلوب';
    }

    return '';
  }
}
