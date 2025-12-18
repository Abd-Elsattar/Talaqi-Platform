// Enhanced Admin Panel component: provides advanced admin UI logic and features.
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { AdminService } from '../../../core/services/admin.service';
import { TokenService } from '../../../core/services/token.service';
import { AdminStatisticsDto } from '../../../core/models/match';
import { AdminUserDto } from '../../../core/models/user';
import { PaginatedResponse } from '../../../core/models/pagination';
import { ImageUrlService } from '../../../core/services/image-url.service';
import { ReportService } from '../../../core/services/report.service';
import { SignalRService } from '../../../core/services/signalr.service';
import { ReportDto, ReportFilterDto, ReportStatus, ReportReason, ReportTargetType, UpdateReportStatusDto } from '../../../core/models/report';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel-new.html',
  styleUrl: './admin-panel-new.css',
})
export class AdminPanel implements OnInit {
  //#region Injected Services
  private adminService = inject(AdminService);
  private reportService = inject(ReportService);
  private signalRService = inject(SignalRService);
  private tokenService = inject(TokenService);
  private route = inject(ActivatedRoute);
  private imageUrlService = inject(ImageUrlService);
  //#endregion

  // Active section navigation
  activeSection: 'statistics' | 'users' | 'items' | 'matches' | 'reports' = 'statistics';

  // Statistics
  statistics: AdminStatisticsDto | null = null;
  loadingStats = true;

  // Reports
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

  // Items Management
  activeTab: 'lost' | 'found' = 'lost';
  items: any[] = [];
  itemsPage = 1;
  itemsPageSize = 20;
  totalItems = 0;
  loadingItems = false;
  searchTerm = '';
  filterCategory = '';
  filterStatus = '';
  selectedItem: any = null;
  showItemModal = false;

  // Users Management
  users: AdminUserDto[] = [];
  usersPage = 1;
  usersPageSize = 20;
  totalUsers = 0;
  loadingUsers = false;
  userSearchTerm = '';
  selectedUser: AdminUserDto | null = null;
  showUserModal = false;
  updatingUserStatus: string | null = null;
  currentUserId: string | null = null;

  Math = Math;

  // ==================== INIT ====================
  ngOnInit() {
    const user = this.tokenService.getStoredUser();
    this.currentUserId = user?.id || null;

    this.loadStatistics();
    this.loadUsers();
    this.loadItems();
    if (this.activeSection === 'reports') this.loadReports();

    this.route.queryParams.subscribe((params) => {
      if (params['section']) {
        this.activeSection = params['section'];
      }
    });

    // Start SignalR connection
    this.signalRService.startConnection();

    // Subscribe to new reports
    this.signalRService.newReport$.subscribe((report: any) => {
      if (report) {
        Swal.fire({
          title: 'بلاغ جديد!',
          text: `تم استلام بلاغ جديد: ${this.getReportReasonText(report.reason)}`,
          icon: 'warning',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000
        });

        // If currently viewing reports, reload or prepend
        if (this.activeSection === 'reports') {
          this.loadReports();
        }
      }
    });
  }

  // ==================== SECTION NAVIGATION ====================
  switchSection(section: 'statistics' | 'users' | 'items' | 'matches' | 'reports'): void {
    this.activeSection = section;
    if (section === 'statistics') this.loadStatistics();
    if (section === 'users') this.loadUsers();
    if (section === 'items') this.loadItems();
    if (section === 'reports') this.loadReports();
  }

  // ==================== REPORTS ====================
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
            title: 'تم التحديث',
            text: 'تم تحديث حالة البلاغ بنجاح',
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
          title: 'خطأ',
          text: 'حدث خطأ أثناء تحديث حالة البلاغ'
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
      case ReportStatus.Pending: return 'قيد الانتظار';
      case ReportStatus.UnderReview: return 'قيد المراجعة';
      case ReportStatus.Resolved: return 'تم الحل';
      case ReportStatus.Rejected: return 'مرفوض';
      default: return 'غير معروف';
    }
  }

  getReportReasonText(reason: ReportReason): string {
    switch (reason) {
        case ReportReason.Spam: return 'محتوى مزعج';
        case ReportReason.Harassment: return 'مضايقة';
        case ReportReason.InappropriateContent: return 'محتوى غير لائق';
        case ReportReason.FakeItem: return 'عنصر وهمي';
        case ReportReason.Scam: return 'احتيال';
        case ReportReason.Other: return 'أخرى';
        default: return 'غير معروف';
    }
  }

  getReportTargetTypeText(type: ReportTargetType): string {
      switch (type) {
          case ReportTargetType.User: return 'مستخدم';
          case ReportTargetType.Conversation: return 'محادثة';
          case ReportTargetType.Message: return 'رسالة';
          case ReportTargetType.General: return 'عام';
          default: return 'غير معروف';
      }
  }

  // ==================== STATISTICS ====================
  loadStatistics(): void {
    this.loadingStats = true;
    this.adminService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
        this.loadingStats = false;
      },
      error: () => {
        this.loadingStats = false;
        Swal.fire('خطأ', 'فشل تحميل الإحصائيات', 'error');
      },
    });
  }

  // ==================== ITEMS ====================
  switchTab(tab: 'lost' | 'found'): void {
    this.activeTab = tab;
    this.itemsPage = 1;
    this.loadItems();
  }

  loadItems(): void {
    this.loadingItems = true;
    this.adminService.getItems(this.activeTab, this.itemsPage, this.itemsPageSize).subscribe({
      next: (response: PaginatedResponse<any>) => {
        this.items = response.items;
        this.totalItems = response.totalCount;
        this.loadingItems = false;
      },
      error: () => {
        this.loadingItems = false;
        Swal.fire('خطأ', 'فشل تحميل العناصر', 'error');
      },
    });
  }

  get filteredItems(): any[] {
    let filtered = this.items;

    if (this.searchTerm) {
      const s = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (i) => i.title?.toLowerCase().includes(s) || i.description?.toLowerCase().includes(s)
      );
    }

    if (this.filterCategory) {
      filtered = filtered.filter((i) => i.category === +this.filterCategory);
    }

    if (this.filterStatus) {
      filtered = filtered.filter((i) => i.status === +this.filterStatus);
    }

    return filtered;
  }

  getCategoryName(category: number | string): string {
    const map: Record<number, string> = {
      1: 'مقتنيات شخصية',
      2: 'أشخاص',
      3: 'حيوانات أليفة',
    };
    return map[Number(category)] || 'غير معروف';
  }

  getStatusName(status: number | string): string {
    const map: Record<number, string> = {
      1: 'نشط',
      2: 'تم العثور عليه',
      3: 'مغلق',
    };
    return map[Number(status)] || 'غير معروف';
  }

  getStatusBadgeClass(status: number | string): string {
    switch (Number(status)) {
      case 1:
        return 'bg-warning';
      case 2:
        return 'bg-success';
      case 3:
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }

  viewItemDetails(item: any): void {
    this.selectedItem = item;
    this.showItemModal = true;
  }

  closeItemModal(): void {
    this.showItemModal = false;
    this.selectedItem = null;
  }

  get totalItemsPages(): number {
    return Math.ceil(this.totalItems / this.itemsPageSize);
  }

  nextItemsPage(): void {
    if (this.itemsPage < this.totalItemsPages) {
      this.itemsPage++;
      this.loadItems();
    }
  }

  prevItemsPage(): void {
    if (this.itemsPage > 1) {
      this.itemsPage--;
      this.loadItems();
    }
  }

  // ==================== USERS ====================
  loadUsers(): void {
    this.loadingUsers = true;
    this.adminService.getUsers(this.usersPage, this.usersPageSize).subscribe({
      next: (response) => {
        this.users = response.items;
        this.totalUsers = response.totalCount;
        this.loadingUsers = false;
      },
      error: () => {
        this.loadingUsers = false;
        Swal.fire('خطأ', 'فشل تحميل المستخدمين', 'error');
      },
    });
  }

  get filteredUsers(): AdminUserDto[] {
    if (!this.userSearchTerm) return this.users;
    const s = this.userSearchTerm.toLowerCase();

    return this.users.filter(
      (u) =>
        `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase().includes(s) ||
        u.email?.toLowerCase().includes(s) ||
        u.phoneNumber?.toLowerCase().includes(s)
    );
  }

  get totalUsersPages(): number {
    return Math.ceil(this.totalUsers / this.usersPageSize);
  }

  nextUsersPage(): void {
    if (this.usersPage < this.totalUsersPages) {
      this.usersPage++;
      this.loadUsers();
    }
  }

  prevUsersPage(): void {
    if (this.usersPage > 1) {
      this.usersPage--;
      this.loadUsers();
    }
  }

  canBlockUser(user: AdminUserDto): boolean {
    return user.id !== this.currentUserId;
  }

  async toggleUserStatus(user: AdminUserDto): Promise<void> {
    if (user.id === this.currentUserId) {
      await Swal.fire('تنبيه', 'لا يمكنك تعطيل حسابك الخاص', 'warning');
      return;
    }

    const action = user.isActive ? 'تعطيل' : 'تفعيل';

    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم ${action} حساب ${user.firstName} ${user.lastName}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `نعم، ${action}`,
      cancelButtonText: 'إلغاء',
    });

    if (!result.isConfirmed) return;

    this.updatingUserStatus = user.id;

    this.adminService.updateUserStatus(user.id, { isActive: !user.isActive }).subscribe({
      next: () => {
        user.isActive = !user.isActive;
        this.updatingUserStatus = null;
        Swal.fire('تم', `تم ${action} المستخدم بنجاح`, 'success');
      },
      error: () => {
        this.updatingUserStatus = null;
        Swal.fire('خطأ', `فشل ${action} المستخدم`, 'error');
      },
    });
  }

  viewUserDetails(user: AdminUserDto): void {
    this.selectedUser = user;
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.selectedUser = null;
  }

  getUserStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'bg-success' : 'bg-danger';
  }

  getUserStatusText(isActive: boolean): string {
    return isActive ? 'نشط' : 'معطل';
  }

  getUserRoleBadge(role: string): string {
    return role === 'Admin' ? 'bg-danger' : 'bg-primary';
  }

  getUserRoleText(role: string): string {
    return role === 'Admin' ? 'مدير' : 'مستخدم';
  }

  // ==================== IMAGE HELPERS ====================
  getItemImageUrl(item: any): string {
    let imageUrl: string | null = null;

    if (item?.imageUrl) imageUrl = item.imageUrl;
    else if (Array.isArray(item?.images) && item.images.length > 0) {
      imageUrl =
        typeof item.images[0] === 'string'
          ? item.images[0]
          : item.images[0]?.url || item.images[0]?.imageUrl;
    } else if (Array.isArray(item?.imageUrls) && item.imageUrls.length > 0) {
      imageUrl = item.imageUrls[0];
    }

    return (
      this.imageUrlService.resolve(imageUrl || undefined) ||
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    );
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  getUserImageUrl(user: AdminUserDto | null | undefined): string | null {
    if (!user?.profilePictureUrl) return null;
    return this.imageUrlService.resolve(user.profilePictureUrl);
  }

  onUserImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
