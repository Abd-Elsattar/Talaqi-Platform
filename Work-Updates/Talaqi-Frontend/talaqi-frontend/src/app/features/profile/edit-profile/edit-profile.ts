// Edit Profile component: manages user profile updates and validation.
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import Swal from 'sweetalert2';
import { UserService } from '../../../core/services/user.service';
import { TokenService } from '../../../core/services/token.service';
import { UserProfileDto } from '../../../core/models/user';
import { ImageUrlService } from '../../../core/services/image-url.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private imageUrlService = inject(ImageUrlService);
  private translate = inject(TranslateService);

  isSubmitting = false;
  isLoading = true;
  currentProfile: UserProfileDto | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  uploadingImage = false;

  // Default profile picture path
  private defaultProfilePicture = 'images/Default User Icon.jpg';

  profileForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required'))
      return this.translate.instant('editProfile.errors.required');
    if (field.hasError('maxlength')) {
      const maxLength = field.getError('maxlength').requiredLength;
      return this.translate.instant('editProfile.errors.maxLength', {
        max: maxLength,
      });
    }
    if (field.hasError('pattern'))
      return this.translate.instant('editProfile.errors.invalidPhone');
    return '';
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.userService.getProfile().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.isSuccess && res.data) {
          this.currentProfile = res.data;
          this.profileForm.patchValue({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            phoneNumber: res.data.phoneNumber,
          });
          this.profileForm.markAsPristine();
          this.imagePreview = this.getProfilePictureUrl();
        }
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          title: this.translate.instant('editProfile.messages.uploadError.title'),
          text: this.translate.instant('editProfile.messages.uploadError.text'),
          icon: 'error',
          confirmButtonText: this.translate.instant('editProfile.messages.okay'),
        });
      },
    });
  }

  getProfilePictureUrl(): string {
    if (this.currentProfile?.profilePictureUrl) {
      return this.imageUrlService.resolve(this.currentProfile.profilePictureUrl);
    }
    return this.defaultProfilePicture;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          title: this.translate.instant('editProfile.messages.uploadError.title'),
          text: this.translate.instant('editProfile.errors.invalidImageType'),
          icon: 'error',
          confirmButtonText: this.translate.instant('editProfile.messages.okay'),
        });
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        Swal.fire({
          title: this.translate.instant('editProfile.messages.uploadError.title'),
          text: this.translate.instant('editProfile.errors.imageTooLarge'),
          icon: 'error',
          confirmButtonText: this.translate.instant('editProfile.messages.okay'),
        });
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture() {
    if (!this.selectedFile) return;

    this.uploadingImage = true;

    this.userService.uploadProfilePicture(this.selectedFile).subscribe({
      next: (res) => {
        this.uploadingImage = false;
        this.selectedFile = null;

        Swal.fire({
          title: this.translate.instant('editProfile.messages.uploadSuccess.title'),
          text: this.translate.instant('editProfile.messages.uploadSuccess.text'),
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });

        if (this.currentProfile) {
          this.currentProfile.profilePictureUrl = res.imageUrl;
          this.imagePreview = this.imageUrlService.resolve(res.imageUrl);

          // Update user in TokenService to sync across entire application
          const currentUser = this.tokenService.getCurrentUser();
          if (currentUser) {
            const updatedUser = {
              ...currentUser,
              profilePictureUrl: res.imageUrl,
            };
            this.tokenService.updateUser(updatedUser);
          }
        }
      },
      error: (err) => {
        this.uploadingImage = false;
        Swal.fire({
          title: this.translate.instant('editProfile.messages.uploadError.title'),
          text: this.translate.instant('editProfile.messages.uploadError.text'),
          icon: 'error',
          confirmButtonText: this.translate.instant('editProfile.messages.okay'),
        });
      },
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const updateData = {
      firstName: this.profileForm.get('firstName')?.value || '',
      lastName: this.profileForm.get('lastName')?.value || '',
      phoneNumber: this.profileForm.get('phoneNumber')?.value || '',
    };

    this.userService.updateProfile(updateData).subscribe({
      next: (res) => {
        this.isSubmitting = false;

        if (res.isSuccess) {
          if (this.currentProfile) {
            this.currentProfile.firstName = updateData.firstName;
            this.currentProfile.lastName = updateData.lastName;
            this.currentProfile.phoneNumber = updateData.phoneNumber;
          }

          // Update user in TokenService to sync across all pages
          const currentUser = this.tokenService.getCurrentUser();
          if (currentUser) {
            const updatedUser = {
              ...currentUser,
              firstName: updateData.firstName,
              lastName: updateData.lastName,
              phoneNumber: updateData.phoneNumber,
            };
            this.tokenService.updateUser(updatedUser);
          }

          this.profileForm.markAsPristine();

          Swal.fire({
            title: this.translate.instant('editProfile.messages.updateSuccess.title'),
            text: this.translate.instant('editProfile.messages.updateSuccess.text'),
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            this.loadProfile();
          });
        }
      },
      error: (err) => {
        this.isSubmitting = false;
      },
    });
  }

  get hasChanges(): boolean {
    return this.profileForm.dirty;
  }

  get canSave(): boolean {
    return this.profileForm.valid && this.hasChanges && !this.isSubmitting;
  }

  /**
   * Delete Account Handler
   */
  deleteAccount(): void {
    Swal.fire({
      icon: 'warning',
      title: this.translate.instant('editProfile.messages.deleteWarning.title'),
      text: this.translate.instant('editProfile.messages.deleteWarning.text'),
      showCancelButton: true,
      confirmButtonText: this.translate.instant('editProfile.messages.deleteWarning.confirmButton'),
      cancelButtonText: this.translate.instant('editProfile.messages.deleteWarning.cancelButton'),
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6C8DB5',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading
        Swal.fire({
          title: this.translate.instant('editProfile.messages.deleting.title'),
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Call delete service
        this.userService.deleteAccount().subscribe({
          next: (response) => {
            if (response.isSuccess) {
              // Clear token and navigate to home
              this.tokenService.clearTokens();

              Swal.fire({
                icon: 'success',
                title: this.translate.instant('editProfile.messages.deleteSuccess.title'),
                text: this.translate.instant('editProfile.messages.deleteSuccess.text'),
                showConfirmButton: false,
                timer: 2000,
              }).then(() => {
                this.router.navigate(['/']);
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: this.translate.instant('editProfile.messages.deleteFailed.title'),
                text: response.message || this.translate.instant('editProfile.messages.deleteFailed.text'),
                confirmButtonText: this.translate.instant('editProfile.messages.okay'),
              });
            }
          },
          error: (error) => {
            console.error('Delete account error:', error);
            Swal.fire({
              icon: 'error',
              title: this.translate.instant('editProfile.messages.connectionError.title'),
              text: this.translate.instant('editProfile.messages.connectionError.text'),
              confirmButtonText: this.translate.instant('editProfile.messages.okay'),
            });
          },
        });
      }
    });
  }
}
