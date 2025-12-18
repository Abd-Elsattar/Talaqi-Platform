import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportService } from '../../../core/services/report.service';
import { ReportDto } from '../../../core/models/report';

@Component({
  selector: 'app-user-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './user-reports.html',
  styleUrls: ['./user-reports.css']
})
export class UserReportsComponent implements OnInit {
  private reportService = inject(ReportService);
  
  reports: ReportDto[] = [];
  loading = true;
  page = 1;
  pageSize = 20;

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.loading = true;
    this.reportService.getMyReports(this.page, this.pageSize).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.reports = response.data || [];
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 0: return 'bg-warning text-dark'; // Pending
      case 1: return 'bg-info text-white'; // UnderReview
      case 2: return 'bg-success text-white'; // Resolved
      case 3: return 'bg-danger text-white'; // Rejected
      default: return 'bg-secondary text-white';
    }
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0: return 'قيد الانتظار';
      case 1: return 'قيد المراجعة';
      case 2: return 'تم الحل';
      case 3: return 'مرفوض';
      default: return 'غير معروف';
    }
  }
  
  getReasonLabel(reason: number): string {
      // Assuming enum values, map to Arabic
      // Spam = 0, Harassment = 1, InappropriateContent = 2, Fraud = 3, Other = 4
      const reasons = ['محتوى مزعج', 'مضايقة', 'محتوى غير لائق', 'احتيال', 'أخرى'];
      return reasons[reason] || 'أخرى';
  }
}
