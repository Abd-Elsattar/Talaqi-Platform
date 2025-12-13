// FoundItemService: CRUD operations for items reported as found.
// Exposes APIs to create, update, list, and manage found items, including
// pagination and filtering used by admin and public features.

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { ApiResponse } from '../models/api-response';
import { FoundItemDto, CreateFoundItemDto, UpdateFoundItemDto } from '../models/item';

@Injectable({
    providedIn: 'root'
})
export class FoundItemService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/founditems`;

    getById(id: string): Observable<ApiResponse<FoundItemDto>> {
        return this.http.get<ApiResponse<FoundItemDto>>(`${this.apiUrl}/${id}`);
    }

    getMyItems(): Observable<ApiResponse<FoundItemDto[]>> {
        return this.http.get<ApiResponse<FoundItemDto[]>>(`${this.apiUrl}/my-items`);
    }

    create(data: CreateFoundItemDto): Observable<ApiResponse<FoundItemDto>> {
        return this.http.post<ApiResponse<FoundItemDto>>(this.apiUrl, data);
    }

    update(id: string, data: UpdateFoundItemDto): Observable<ApiResponse<FoundItemDto>> {
        return this.http.put<ApiResponse<FoundItemDto>>(`${this.apiUrl}/${id}`, data);
    }

    delete(id: string): Observable<ApiResponse<null>> {
        return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
    }
}
