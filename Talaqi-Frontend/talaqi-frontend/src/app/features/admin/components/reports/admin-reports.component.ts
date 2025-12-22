import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { ReportService } from '../../../../core/services/report.service';
import { SignalRService } from '../../../../core/services/signalr.service';
import { ReportDto, ReportFilterDto, ReportStatus, ReportReason, ReportTargetType, UpdateReportStatusDto } from '../../../../core/models/report';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {
  private reportService = inject(ReportService);
  private signalRService = inject(SignalRService);
  private translate = inject(TranslateService);

  reports: ReportDto[] = [];
  loadingReports = false;
  selectedReport: ReportDto | null = null;
  newStatus: ReportStatus | null = null;
  adminNote = '';
  updatingReportStatus = false;
  showReportModal = false;
  reportsPage = 1;
  reportsPageSize = 20;
  reportFilter: ReportFilterDto = { page: 1, pageSize: 20 };

  ngOnInit() {
    this.loadReports();
    this.initSignalR();
  }

  initSignalR() {
    // Start SignalR connection
    this.signalRService.startConnection();

    // Subscribe to new reports
    this.signalRService.newReport$.subscribe((report: any) => {
      if (report) {
        Swal.fire({
          title: this.translate.instant('adminPanel.reports.newReport.title'),
          text: `${this.translate.instant('adminPanel.reports.newReport.text')} ${this.getReportReasonText(report.reason)}`,
          icon: 'warning',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000
        });

        // Reload reports to show the new one
        this.loadReports();
      }
    });
  }

  loadReports(): void {
    this.loadingReports = true;
    this.reportFilter.page = this.reportsPage;
    this.reportFilter.pageSize = this.reportsPageSize;

    this.reportService.getReports(this.reportFilter).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.reports = res.data;
          this.loadingReports = false;
        } else {
          this.loadingReports = false;
        }
      },
      error: (err) => {
        console.error('Error loading reports', err);
        this.loadingReports = false;
      }
    });
  }

  filterReports(): void {
    this.reportsPage = 1;
    this.loadReports();
  }

  prevReportsPage(): void {
    if (this.reportsPage > 1) {
      this.reportsPage--;
      this.loadReports();
    }
  }

  nextReportsPage(): void {
    this.reportsPage++;
    this.loadReports();
  }

  openReportModal(report: ReportDto): void {
    this.selectedReport = report;
    this.newStatus = report.status;
    this.adminNote = report.adminNotes || '';
    this.showReportModal = true;
  }

  closeReportModal(): void {
    this.showReportModal = false;
    this.selectedReport = null;
    this.adminNote = '';
    this.newStatus = null;
  }

  updateReport(): void {
    if (!this.selectedReport || this.newStatus === null) return;

    this.updatingReportStatus = true;
    const dto: UpdateReportStatusDto = {
      status: this.newStatus,
      adminNotes: this.adminNote
    };

    this.reportService.updateStatus(this.selectedReport.id, dto).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // Update local state
          if (this.selectedReport) {
            this.selectedReport.status = this.newStatus!;
            this.selectedReport.adminNotes = this.adminNote;

            // Update in list
            const index = this.reports.findIndex(r => r.id === this.selectedReport!.id);
            if (index !== -1) {
              this.reports[index] = { ...this.selectedReport };
            }
          }

          Swal.fire({
            icon: 'success',
            title: this.translate.instant('adminPanel.messages.updateSuccess'),
            text: this.translate.instant('adminPanel.messages.reportStatusUpdated'),
            timer: 1500,
            showConfirmButton: false
          });
          this.closeReportModal();
        }
        this.updatingReportStatus = false;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('adminPanel.messages.error'),
          text: this.translate.instant('adminPanel.messages.reportStatusUpdateError')
        });
        this.updatingReportStatus = false;
      }
    });
  }

  getReportStatusBadge(status: ReportStatus): string {
    switch (status) {
      case ReportStatus.Pending: return 'bg-warning text-dark';
      case ReportStatus.UnderReview: return 'bg-info text-dark';
      case ReportStatus.Resolved: return 'bg-success';
      case ReportStatus.Rejected: return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }

  getReportStatusText(status: ReportStatus): string {
    switch (status) {
      case ReportStatus.Pending: return this.translate.instant('adminPanel.reports.statuses.pending');
      case ReportStatus.UnderReview: return this.translate.instant('adminPanel.reports.statuses.underReview');
      case ReportStatus.Resolved: return this.translate.instant('adminPanel.reports.statuses.resolved');
      case ReportStatus.Rejected: return this.translate.instant('adminPanel.reports.statuses.rejected');
      default: return this.translate.instant('adminPanel.common.unknown');
    }
  }

  getReportReasonText(reason: ReportReason): string {
    switch (reason) {
      case ReportReason.Spam: return this.translate.instant('adminPanel.reports.reasons.spam');
      case ReportReason.Harassment: return this.translate.instant('adminPanel.reports.reasons.harassment');
      case ReportReason.InappropriateContent: return this.translate.instant('adminPanel.reports.reasons.inappropriateContent');
      case ReportReason.FakeItem: return this.translate.instant('adminPanel.reports.reasons.falseInformation');
      case ReportReason.Scam: return this.translate.instant('adminPanel.reports.reasons.falseInformation');
      case ReportReason.Other: return this.translate.instant('adminPanel.reports.reasons.other');
      default: return this.translate.instant('adminPanel.common.unknown');
    }
  }

  getReportTargetTypeText(type: ReportTargetType): string {
    switch (type) {
      case ReportTargetType.User: return this.translate.instant('adminPanel.reports.targets.user');
      case ReportTargetType.Conversation: return this.translate.instant('adminPanel.reports.targets.conversation');
      case ReportTargetType.Message: return this.translate.instant('adminPanel.reports.targets.message');
      case ReportTargetType.General: return this.translate.instant('adminPanel.reports.targets.general');
      default: return this.translate.instant('adminPanel.common.unknown');
    }
  }
}
