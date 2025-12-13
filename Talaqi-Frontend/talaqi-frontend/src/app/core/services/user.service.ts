// UserService: Manages user profiles and account data.
// Exposes APIs to fetch/update profile details, preferences, and related
// resources used by profile and admin features.

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { ApiResponse } from '../models/api-response';
import { UserProfileDto, UpdateUserProfileDto } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/users`;

    getProfile(): Observable<ApiResponse<UserProfileDto>> {
        return this.http.get<ApiResponse<UserProfileDto>>(`${this.apiUrl}/profile`);
    }

    updateProfile(data: UpdateUserProfileDto): Observable<ApiResponse<UserProfileDto>> {
        return this.http.put<ApiResponse<UserProfileDto>>(`${this.apiUrl}/profile`, data);
    }

    uploadProfilePicture(file: File): Observable<{ imageUrl: string; message: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ imageUrl: string; message: string }>(
            `${this.apiUrl}/profile-picture`,
            formData
        );
    }

    deleteAccount(): Observable<ApiResponse<null>> {
        return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/account`);
    }
}
