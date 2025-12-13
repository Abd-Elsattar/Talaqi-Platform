// AdminService: Handles admin-specific API operations and dashboards management.
// Provides methods to retrieve system stats, manage users/items, and perform
// privileged actions available only to administrators.

// Admin Service
// Provides methods to interact with admin-related API endpoints
// Includes user management and statistics retrieval
// Usage: inject AdminService in components or other services
// and call its methods to perform admin operations
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { PaginatedResponse } from '../models/pagination';
import { AdminUserDto, UpdateUserStatusDto } from '../models/user';
import { AdminStatisticsDto } from '../models/match';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/admin`;

    getUsers(pageNumber: number = 1, pageSize: number = 20): Observable<PaginatedResponse<AdminUserDto>> {
        const params = new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<PaginatedResponse<AdminUserDto>>(`${this.apiUrl}/users`, { params });
    }

    getStatistics(): Observable<AdminStatisticsDto> {
        return this.http.get<AdminStatisticsDto>(`${this.apiUrl}/statistics`);
    }

    getItems(type: 'lost' | 'found' = 'lost', pageNumber: number = 1, pageSize: number = 20): Observable<PaginatedResponse<any>> {
        const params = new HttpParams()
            .set('type', type)
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<PaginatedResponse<any>>(`${this.apiUrl}/items`, { params });
    }

    updateUserStatus(userId: string, data: UpdateUserStatusDto): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.apiUrl}/users/${userId}/status`, data);
    }
}
