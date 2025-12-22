import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReportService } from '../../../core/services/report.service';
import { ReportDto } from '../../../core/models/report';

@Component({
  selector: 'app-user-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, TranslateModule],
  templateUrl: './user-reports.html',
  styleUrls: ['./user-reports.css']
})
export class UserReportsComponent implements OnInit {
  private reportService = inject(ReportService);
  private translate = inject(TranslateService);
  
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
      case 0: return this.translate.instant('userReports.status.pending');
      case 1: return this.translate.instant('userReports.status.underReview');
      case 2: return this.translate.instant('userReports.status.resolved');
      case 3: return this.translate.instant('userReports.status.rejected');
      default: return this.translate.instant('userReports.status.unknown');
    }
  }
  
  getReasonLabel(reason: number): string {
      // Spam = 0, Harassment = 1, InappropriateContent = 2, FakeItem = 3, Scam = 4, Other = 5
      switch (reason) {
        case 0: return this.translate.instant('userReports.reason.spam');
        case 1: return this.translate.instant('userReports.reason.harassment');
        case 2: return this.translate.instant('userReports.reason.inappropriate');
        case 3: return this.translate.instant('userReports.reason.fakeItem');
        case 4: return this.translate.instant('userReports.reason.scam');
        case 5: return this.translate.instant('userReports.reason.other');
        default: return this.translate.instant('userReports.reason.other');
      }
  }
}
