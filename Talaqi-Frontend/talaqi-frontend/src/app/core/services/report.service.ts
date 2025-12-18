import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';
import { PaginatedResponse } from '../models/pagination';
import { CreateReportDto, ReportDto, ReportFilterDto, UpdateReportStatusDto } from '../models/report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reports`;

  createReport(dto: CreateReportDto): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(this.apiUrl, dto);
  }

  getReports(filter: ReportFilterDto): Observable<ApiResponse<ReportDto[]>> {
    let params = new HttpParams()
      .set('page', filter.page.toString())
      .set('pageSize', filter.pageSize.toString());

    if (filter.status !== undefined && filter.status !== null) params = params.set('status', filter.status.toString());
    if (filter.reason !== undefined && filter.reason !== null) params = params.set('reason', filter.reason.toString());
    if (filter.targetType !== undefined && filter.targetType !== null) params = params.set('targetType', filter.targetType.toString());
    if (filter.fromDate) params = params.set('fromDate', filter.fromDate);
    if (filter.toDate) params = params.set('toDate', filter.toDate);
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);

    return this.http.get<ApiResponse<ReportDto[]>>(this.apiUrl, { params });
  }

  getMyReports(page: number = 1, pageSize: number = 20): Observable<ApiResponse<ReportDto[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<ReportDto[]>>(`${this.apiUrl}/my-reports`, { params });
  }

  getReport(id: string): Observable<ApiResponse<ReportDto>> {
    return this.http.get<ApiResponse<ReportDto>>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string, dto: UpdateReportStatusDto): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/${id}/status`, dto);
  }
}
