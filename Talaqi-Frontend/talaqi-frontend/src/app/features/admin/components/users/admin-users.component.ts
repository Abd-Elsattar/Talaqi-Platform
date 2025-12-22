import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

import { AdminService } from '../../../../core/services/admin.service';
import { TokenService } from '../../../../core/services/token.service';
import { ImageUrlService } from '../../../../core/services/image-url.service';
import { AdminUserDto } from '../../../../core/models/user';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  private adminService = inject(AdminService);
  private tokenService = inject(TokenService);
  private imageUrlService = inject(ImageUrlService);
  private translate = inject(TranslateService);

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
    const user = this.tokenService.getStoredUser();
    this.currentUserId = user?.id || null;
    this.loadUsers();
  }

  loadUsers(): void {
    this.loadingUsers = true;
    this.adminService.getUsers(this.usersPage, this.usersPageSize).subscribe({
      next: (res) => {
        this.loadingUsers = false;
        this.users = res.items;
        this.totalUsers = res.totalCount;
      },
      error: () => {
        this.loadingUsers = false;
        Swal.fire(this.translate.instant('adminPanel.messages.error'), this.translate.instant('adminPanel.messages.usersLoadError'), 'error');
      },
    });
  }

  get filteredUsers(): AdminUserDto[] {
    if (!this.userSearchTerm) return this.users;
    const s = this.userSearchTerm.toLowerCase();

    return this.users.filter(u =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s) ||
      u.phoneNumber?.includes(s)
    );
  }

  canBlockUser(user: AdminUserDto): boolean {
    return user.id !== this.currentUserId;
  }

  async toggleUserStatus(user: AdminUserDto): Promise<void> {
    if (user.id === this.currentUserId) {
      await Swal.fire(
        this.translate.instant('adminPanel.messages.alert'),
        this.translate.instant('adminPanel.messages.cantBlockSelf'),
        'warning'
      );
      return;
    }

    const action = user.isActive
      ? this.translate.instant('adminPanel.users.actions.deactivate')
      : this.translate.instant('adminPanel.users.actions.activate');

    const result = await Swal.fire({
      title: this.translate.instant('adminPanel.messages.confirmAction'),
      text: this.translate.instant('adminPanel.messages.confirmUserAction', {
        action: action,
        name: `${user.firstName} ${user.lastName}`
      }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('adminPanel.messages.yesAction', { action: action }),
      cancelButtonText: this.translate.instant('adminPanel.messages.cancel'),
    });

    if (!result.isConfirmed) return;

    this.updatingUserStatus = user.id;

    this.adminService.updateUserStatus(user.id, { isActive: !user.isActive }).subscribe({
      next: () => {
        user.isActive = !user.isActive;
        this.updatingUserStatus = null;

        Swal.fire(
          this.translate.instant('adminPanel.messages.done'),
          this.translate.instant('adminPanel.messages.userActionSuccess', { action: action }),
          'success'
        );
      },
      error: () => {
        this.updatingUserStatus = null;
        Swal.fire(
          this.translate.instant('adminPanel.messages.error'),
          this.translate.instant('adminPanel.messages.userActionFailure', { action: action }),
          'error'
        );
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

  getUserImageUrl(user: AdminUserDto | null | undefined): string | null {
    if (!user?.profilePictureUrl) return null;
    return this.imageUrlService.resolve(user.profilePictureUrl);
  }

  onUserImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  getUserStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'bg-success' : 'bg-danger';
  }

  getUserStatusText(isActive: boolean): string {
    return isActive ? this.translate.instant('adminPanel.users.status.active') : this.translate.instant('adminPanel.users.status.inactive');
  }

  getUserRoleBadge(role: string): string {
    return role === 'Admin' ? 'bg-danger' : 'bg-primary';
  }

  getUserRoleText(role: string): string {
    return role === 'Admin' ? this.translate.instant('adminPanel.users.roles.admin') : this.translate.instant('adminPanel.users.roles.user');
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
}
