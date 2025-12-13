// LostItemService: CRUD operations for items reported as lost.
// Provides endpoints to create, update, search, and paginate lost items,
// supporting user submissions and admin moderation flows.

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { ApiResponse } from '../models/api-response';
import { LostItemDto, CreateLostItemDto, UpdateLostItemDto, ItemCategory } from '../models/item';
import { PaginatedResponse } from '../models/pagination';

@Injectable({
    providedIn: 'root'
})
export class LostItemService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/lostitems`;

    getAll(pageNumber: number = 1, pageSize: number = 10, category?: ItemCategory): Observable<ApiResponse<PaginatedResponse<LostItemDto>>> {
        let params = new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        if (category) {
            params = params.set('category', category);
        }

        return this.http.get<ApiResponse<PaginatedResponse<LostItemDto>>>(this.apiUrl, { params });
    }

    getById(id: string): Observable<ApiResponse<LostItemDto>> {
        return this.http.get<ApiResponse<LostItemDto>>(`${this.apiUrl}/${id}`);
    }

    getMyItems(): Observable<ApiResponse<LostItemDto[]>> {
        return this.http.get<ApiResponse<LostItemDto[]>>(`${this.apiUrl}/my-items`);
    }

    getFeed(count: number = 20): Observable<ApiResponse<LostItemDto[]>> {
        const params = new HttpParams().set('count', count.toString());
        return this.http.get<ApiResponse<LostItemDto[]>>(`${this.apiUrl}/feed`, { params });
    }

    create(data: CreateLostItemDto): Observable<ApiResponse<LostItemDto>> {
        return this.http.post<ApiResponse<LostItemDto>>(this.apiUrl, data);
    }

    update(id: string, data: UpdateLostItemDto): Observable<ApiResponse<LostItemDto>> {
        return this.http.put<ApiResponse<LostItemDto>>(`${this.apiUrl}/${id}`, data);
    }

    delete(id: string): Observable<ApiResponse<null>> {
        return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
    }
}
