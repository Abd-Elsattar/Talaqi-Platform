// MatchService: Handles AI/heuristic matching between lost and found items.
// Fetches suggested matches, triggers re-matching, and provides APIs for
// reviewing and confirming matches in admin and user interfaces.

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { ApiResponse } from '../models/api-response';
import { MatchDto, UpdateMatchStatusDto } from '../models/match';

@Injectable({
    providedIn: 'root'
})
export class MatchService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/matches`;

    getMyMatches(): Observable<ApiResponse<MatchDto[]>> {
        return this.http.get<ApiResponse<MatchDto[]>>(`${this.apiUrl}/my-matches`);
    }

    getById(id: string): Observable<ApiResponse<MatchDto>> {
        return this.http.get<ApiResponse<MatchDto>>(`${this.apiUrl}/${id}`);
    }

    updateStatus(id: string, data: UpdateMatchStatusDto): Observable<ApiResponse<MatchDto>> {
        return this.http.put<ApiResponse<MatchDto>>(`${this.apiUrl}/${id}/status`, data);
    }
}
