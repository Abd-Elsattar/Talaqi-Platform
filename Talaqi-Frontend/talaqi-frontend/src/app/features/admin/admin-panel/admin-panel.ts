// Admin Panel component: renders administrative dashboard and handles management actions.
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { TokenService } from '../../../core/services/token.service';
import { AdminStatisticsDto } from '../../../core/models/match';
import { AdminUserDto } from '../../../core/models/user';
import { PaginatedResponse } from '../../../core/models/pagination';
import { ImageUrlService } from '../../../core/services/image-url.service';

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
  private tokenService = inject(TokenService);
  private route = inject(ActivatedRoute);
  private imageUrlService = inject(ImageUrlService);
  //#endregion

  // Active section navigation (synced with navbar)
  activeSection: 'statistics' | 'users' | 'items' = 'statistics';

  // Statistics
  statistics: AdminStatisticsDto | null = null;
  loadingStats = true;

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

  ngOnInit() {
    // Get current user ID from token
    const user = this.tokenService.getStoredUser();
    this.currentUserId = user?.id || null;

    this.loadStatistics();
    this.loadUsers();
    this.loadItems();

    // Listen for query parameters
    this.route.queryParams.subscribe((params) => {
      if (params['section']) {
        this.activeSection = params['section'];
      }
    });
  }

  // ==================== SECTION NAVIGATION ====================
  switchSection(section: 'statistics' | 'users' | 'items'): void {
    this.activeSection = section;
    if (section === 'statistics') {
      this.loadStatistics();
    } else if (section === 'users') {
      this.loadUsers();
    } else if (section === 'items') {
      this.loadItems();
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
      error: (err) => {
        console.error('Failed to load statistics:', err);
        this.loadingStats = false;
      },
    });
  }

  // ==================== ITEMS MANAGEMENT ====================
  switchTab(tab: 'lost' | 'found'): void {
    this.activeTab = tab;
    this.itemsPage = 1;
    this.loadItems();
  }

  loadItems(): void {
    this.loadingItems = true;
    this.adminService.getItems(this.activeTab, this.itemsPage, this.itemsPageSize).subscribe({
      next: (response: PaginatedResponse<any>) => {
        this.loadingItems = false;
        console.log(`📦 Admin items response (${this.activeTab}):`, response);

        // Map items with proper image URL handling
        this.items = response.items.map((item: any, index: number) => {
          let imageUrl = null;

          if (item.imageUrl && typeof item.imageUrl === 'string' && item.imageUrl.length > 0) {
            imageUrl = item.imageUrl;
          } else if (item.images) {
            if (Array.isArray(item.images) && item.images.length > 0) {
              imageUrl =
                typeof item.images[0] === 'string'
                  ? item.images[0]
                  : item.images[0]?.url || item.images[0]?.imageUrl;
            }
          } else if (item.imageUrls && Array.isArray(item.imageUrls) && item.imageUrls.length > 0) {
            imageUrl = item.imageUrls[0];
          }

          console.log(`Item ${index}:`, {
            title: item.title,
            category: item.category,
            status: item.status,
            fullItem: item,
          });

          return { ...item, imageUrl: imageUrl || null };
        });
        this.totalItems = response.totalCount;

        console.log('🔍 Filters:', {
          searchTerm: this.searchTerm,
          filterCategory: this.filterCategory,
          filterStatus: this.filterStatus,
          totalItems: this.items.length,
          filteredCount: this.filteredItems.length,
        });
      },
      error: (err) => {
        this.loadingItems = false;
        console.error('Failed to load items:', err);
      },
    });
  }

  // Filter items based on search and filters (client-side only)
  get filteredItems(): any[] {
    let filtered = this.items;

    // Search filter
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter (numeric values: 1=PersonalBelongings, 2=People, 3=Pets)
    if (this.filterCategory) {
      const categoryNum = parseInt(this.filterCategory);
      filtered = filtered.filter((item) => item.category === categoryNum);
    }

    // Status filter (numeric values: 1=Active, 2=Found, 3=Closed)
    if (this.filterStatus) {
      const statusNum = parseInt(this.filterStatus);
      filtered = filtered.filter((item) => item.status === statusNum);
    }

    return filtered;
  }

  getCategoryName(category: number | string): string {
    const categoryMap: { [key: number]: string } = {
      1: 'مقتنيات شخصية',
      2: 'أشخاص',
      3: 'حيوانات أليفة',
    };
    return categoryMap[Number(category)] || String(category);
  }

  getStatusName(status: number | string): string {
    const statusMap: { [key: number]: string } = {
      1: 'نشط',
      2: 'تم العثور عليه',
      3: 'مغلق',
    };
    return statusMap[Number(status)] || String(status);
  }

  viewItemDetails(item: any): void {
    this.selectedItem = item;
    this.showItemModal = true;
  }

  closeItemModal(): void {
    this.showItemModal = false;
    this.selectedItem = null;
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

  get totalItemsPages(): number {
    return Math.ceil(this.totalItems / this.itemsPageSize);
  }

  // ==================== USERS MANAGEMENT ====================
  loadUsers(): void {
    this.loadingUsers = true;
    this.adminService.getUsers(this.usersPage, this.usersPageSize).subscribe({
      next: (response: PaginatedResponse<AdminUserDto>) => {
        this.loadingUsers = false;
        this.users = response.items;
        this.totalUsers = response.totalCount;
      },
      error: (err) => {
        this.loadingUsers = false;
        console.error('Failed to load users:', err);
      },
    });
  }

  // Filter users based on search
  get filteredUsers(): AdminUserDto[] {
    if (!this.userSearchTerm) return this.users;

    const searchLower = this.userSearchTerm.toLowerCase();
    return this.users.filter((user) => {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      return (
        fullName.includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phoneNumber?.toLowerCase().includes(searchLower)
      );
    });
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

  get totalUsersPages(): number {
    return Math.ceil(this.totalUsers / this.usersPageSize);
  }

  // ==================== IMAGE HANDLING ====================
  getItemImageUrl(item: any): string {
    let imageUrl: string | null = null;

    // Try imageUrl property first
    if (
      item?.imageUrl &&
      typeof item.imageUrl === 'string' &&
      item.imageUrl.length > 0 &&
      item.imageUrl !== 'null'
    ) {
      imageUrl = item.imageUrl;
    }
    // Try images array
    else if (item?.images) {
      if (Array.isArray(item.images) && item.images.length > 0) {
        const firstImage = item.images[0];
        const url =
          typeof firstImage === 'string' ? firstImage : firstImage?.url || firstImage?.imageUrl;
        if (url && typeof url === 'string' && url.length > 0) {
          imageUrl = url;
        }
      }
    }
    // Try imageUrls array
    else if (item?.imageUrls && Array.isArray(item.imageUrls) && item.imageUrls.length > 0) {
      const url = item.imageUrls[0];
      if (url && typeof url === 'string' && url.length > 0) {
        imageUrl = url;
      }
    }

    // Use shared resolver
    const resolved = this.imageUrlService.resolve(imageUrl || undefined);
    // Admin table prefers placeholder icon instead of default picture
    return (
      resolved || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    );
  }

  // Handle image loading errors
  onImageError(event: any): void {
    const img = event.target as HTMLImageElement;
    const parent = img.parentElement;
    if (parent) {
      parent.innerHTML = '<i class="bi bi-image text-muted" style="font-size: 1.5rem;"></i>';
    }
  }

  // Resolve user profile image URL with shared service
  getUserImageUrl(user: AdminUserDto | null | undefined): string | null {
    if (!user || !user.profilePictureUrl) return null;
    return this.imageUrlService.resolve(user.profilePictureUrl) || null;
  }

  onUserImageError(event: any): void {
    const img = event.target as HTMLImageElement;
    if (img && img.parentElement) {
      img.parentElement.innerHTML =
        '<div class="user-avatar-lg bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width:45px;height:45px;font-size:1.1rem;">?</div>';
    }
  }

  // ==================== STATUS STYLING ====================
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-warning';
      case 'Matched':
        return 'bg-success';
      case 'Closed':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }

  // ==================== USER ACTIONS ====================
  // Check if user can be blocked (prevent blocking yourself)
  canBlockUser(user: AdminUserDto): boolean {
    return user.id !== this.currentUserId;
  }

  // Toggle user active status
  toggleUserStatus(user: AdminUserDto): void {
    // Prevent admin from blocking themselves
    if (user.id === this.currentUserId) {
      alert('لا يمكنك تعطيل حسابك الخاص');
      return;
    }

    const action = user.isActive ? 'تعطيل' : 'تفعيل';
    const confirmMessage = `هل أنت متأكد من ${action} حساب ${user.firstName} ${user.lastName}؟`;

    if (!confirm(confirmMessage)) {
      return;
    }

    this.updatingUserStatus = user.id;
    const newStatus = !user.isActive;

    this.adminService.updateUserStatus(user.id, { isActive: newStatus }).subscribe({
      next: (response) => {
        this.updatingUserStatus = null;
        user.isActive = newStatus;
        console.log('✅ User status updated:', response);
        alert(`تم ${action} المستخدم بنجاح`);
      },
      error: (err) => {
        this.updatingUserStatus = null;
        console.error('❌ Failed to update user status:', err);
        alert(`فشل ${action} المستخدم`);
      },
    });
  }

  // View user details
  viewUserDetails(user: AdminUserDto): void {
    this.selectedUser = user;
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.selectedUser = null;
  }

  // Get user status badge class
  getUserStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'bg-success' : 'bg-danger';
  }

  getUserStatusText(isActive: boolean): string {
    return isActive ? 'نشط' : 'معطل';
  }

  // Get user role badge
  getUserRoleBadge(role: string): string {
    return role === 'Admin' ? 'bg-danger' : 'bg-primary';
  }

  getUserRoleText(role: string): string {
    return role === 'Admin' ? 'مدير' : 'مستخدم';
  }
}
