// UploadService: Handles file uploads to the backend (images and attachments).
// Wraps multipart/form-data requests, progress tracking, and returns stored
// file metadata/URLs used across items and profiles.

import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/upload`;

    uploadImage(file: File): Observable<{ imageUrl: string }> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<{ imageUrl: string }>(
            `${this.apiUrl}/image`,
            formData
        );
    }

    /**
     * Validate file before upload
     */
    validateFile(file: File): { valid: boolean; error?: string } {
        // Check file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            return { valid: false, error: 'يرجى اختيار صورة بصيغة JPG، PNG أو GIF' };
        }

        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return { valid: false, error: 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت' };
        }

        return { valid: true };
    }

    /**
     * Create a preview URL for an image file
     */
    createPreviewUrl(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve(e.target?.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}
