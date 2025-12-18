// AI Matches component: fetches and displays AI-generated item matches.
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatchService } from '../../../core/services/match.service';
import { MatchDto, MatchStatus, normalizeMatchStatus } from '../../../core/models/match';
import { ImageUrlService } from '../../../core/services/image-url.service';
import { TokenService } from '../../../core/services/token.service';
import { ChatService } from '../../../core/services/chat.service';

@Component({
  selector: 'app-ai-matches',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './ai-matches.html',
  styleUrl: './ai-matches.css',
})
export class AiMatches implements OnInit {
  private matchService = inject(MatchService);
  private router = inject(Router);
  private imageUrlService = inject(ImageUrlService);
  private tokenService = inject(TokenService);
  private chatService = inject(ChatService);

  //#region State
  allMatches: MatchDto[] = [];
  filteredMatches: MatchDto[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  // Locally hidden (rejected) by user, persisted in localStorage
  private hiddenMatchIds = new Set<string>();

  // Filter state
  selectedStatus: string = 'All';
  searchQuery: string = '';
  ownerFilter: 'all' | 'my-lost' | 'my-found' = 'all';
  //#endregion

  // Make MatchStatus available in template
  MatchStatus = MatchStatus;

  //#region Lifecycle
  ngOnInit() {
    this.loadHiddenFromStorage();
    this.loadMatches();
  }
  //#endregion

  //#region Data Fetching
  loadMatches() {
    this.isLoading = true;
    this.errorMessage = null;

    this.matchService.getMyMatches().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.allMatches = response.data || [];
          this.applyFilters();
        } else {
          this.errorMessage = response.message || 'فشل في تحميل المطابقات';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'حدث خطأ أثناء تحميل المطابقات';
        console.error('Error loading matches:', error);
      },
    });
  }
  //#endregion

  //#region Filters
  applyFilters() {
    let filtered = [...this.allMatches];
    // Always exclude locally hidden matches
    filtered = filtered.filter((m) => !this.hiddenMatchIds.has(m.id));

    // Filter by status
    if (this.selectedStatus !== 'All') {
      filtered = filtered.filter(
        (match) => match.status.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (match) =>
          match.lostItem?.title.toLowerCase().includes(query) ||
          match.foundItem?.title.toLowerCase().includes(query) ||
          match.lostItem?.description.toLowerCase().includes(query) ||
          match.foundItem?.description.toLowerCase().includes(query)
      );
    }

    // Filter by ownership
    const currentUser = this.tokenService.getCurrentUser();
    if (this.ownerFilter !== 'all' && currentUser?.id) {
      if (this.ownerFilter === 'my-lost') {
        filtered = filtered.filter((m) => m.lostItem?.userId === currentUser.id);
      } else if (this.ownerFilter === 'my-found') {
        filtered = filtered.filter((m) => m.foundItem?.userId === currentUser.id);
      }
    }

    this.filteredMatches = filtered;
  }

  onStatusFilterChange(status: string) {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  setOwnerFilter(filter: 'all' | 'my-lost' | 'my-found') {
    this.ownerFilter = this.ownerFilter === filter ? 'all' : filter;
    this.applyFilters();
  }
  //#endregion

  //#region Actions
  startChat(match: MatchDto) {
    const currentUser = this.tokenService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
        Swal.fire('Error', 'You must be logged in to chat', 'error');
        return;
    }

    let otherUserId = '';
    // Determine who is the other party
    if (match.lostItem?.userId === currentUser.id) {
        otherUserId = match.foundItem?.userId || '';
    } else if (match.foundItem?.userId === currentUser.id) {
        otherUserId = match.lostItem?.userId || '';
    }

    if (!otherUserId) {
        Swal.fire('Error', 'Cannot determine chat participant', 'error');
        return;
    }

    this.chatService.startConversation({ userId: otherUserId, matchId: match.id }).subscribe({
        next: (res) => {
            if (res.isSuccess && res.data) {
                this.router.navigate(['/messages/chat', res.data.id]);
            } else {
                Swal.fire('Error', 'Failed to start conversation', 'error');
            }
        },
        error: (err) => {
             console.error(err);
             Swal.fire('Error', 'Failed to start conversation', 'error');
        }
    });
  }

  updateMatchStatus(matchId: string, newStatus: MatchStatus) {
    const match = this.allMatches.find((m) => m.id === matchId);
    // Prevent non-lost owners from changing status
    if (!match || !this.isLostOwner(match)) {
      Swal.fire({
        title: 'غير مسموح',
        text: 'فقط مالك العنصر المفقود يمكنه تغيير حالة المطابقة.',
        icon: 'warning',
      });
      return;
    }

    const statusText = this.getStatusText(newStatus);

    Swal.fire({
      title: 'تأكيد الإجراء',
      text: `هل تريد تحديث حالة المطابقة إلى "${statusText}"؟`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'نعم، تأكيد',
      cancelButtonText: 'إلغاء',
    }).then((result) => {
      if (result.isConfirmed) {
        const apiStatus = normalizeMatchStatus(newStatus);
        this.matchService.updateStatus(matchId, { status: apiStatus }).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              Swal.fire({
                title: 'تم التحديث!',
                text: 'تم تحديث حالة المطابقة بنجاح',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
              });
              // Update local data
              const match = this.allMatches.find((m) => m.id === matchId);
              if (match) {
                match.status = apiStatus as any;
                // If rejected, hide this match locally from future views
                if (normalizeMatchStatus(apiStatus).toLowerCase() === 'rejected') {
                  this.addHiddenMatch(matchId);
                }
                this.applyFilters();
              }
            }
          },
          error: (error) => {
            Swal.fire({
              title: 'خطأ!',
              text: 'فشل تحديث حالة المطابقة',
              icon: 'error',
            });
          },
        });
      }
    });
  }

  // ============== Local hide persistence ==============
  private storageKey(): string {
    const user = this.tokenService.getCurrentUser();
    return user?.id ? `ai_hidden_matches_${user.id}` : 'ai_hidden_matches_guest';
  }

  private loadHiddenFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.storageKey());
      if (raw) {
        const arr: string[] = JSON.parse(raw);
        this.hiddenMatchIds = new Set(arr.filter((x) => typeof x === 'string'));
      }
    } catch (e) {
      console.warn('Failed to load hidden matches from storage', e);
    }
  }

  private persistHiddenToStorage(): void {
    try {
      localStorage.setItem(this.storageKey(), JSON.stringify([...this.hiddenMatchIds]));
    } catch (e) {
      console.warn('Failed to persist hidden matches to storage', e);
    }
  }

  private addHiddenMatch(matchId: string): void {
    this.hiddenMatchIds.add(matchId);
    this.persistHiddenToStorage();
  }
  //#endregion

  // Normalize status to API-expected string values
  // deprecated: use normalizeMatchStatus from core/models/match

  //#region Navigation
  viewMatchDetails(matchId: string) {
    // Navigate to match detail page (to be implemented)
    console.log('View match details:', matchId);
    // this.router.navigate(['/matches', matchId]);
  }
  //#endregion

  //#region UI Helpers
  getConfidenceClass(score: number): string {
    if (score >= 80) return 'confidence-high';
    if (score >= 60) return 'confidence-medium';
    return 'confidence-low';
  }

  getConfidenceLabel(score: number): string {
    if (score >= 80) return 'عالية';
    if (score >= 60) return 'متوسطة';
    return 'منخفضة';
  }

  getStatusBadgeClass(status: string): string {
    switch (normalizeMatchStatus(status).toLowerCase()) {
      case 'pending':
        return 'badge-warning';
      case 'confirmed':
        return 'badge-info';
      case 'rejected':
        return 'badge-danger';
      case 'resolved':
        return 'badge-success';
      default:
        return 'badge-secondary';
    }
  }

  getStatusText(status: string | MatchStatus): string {
    const statusStr = normalizeMatchStatus(status).toLowerCase();
    switch (statusStr) {
      case 'pending':
        return 'قيد الانتظار';
      case 'confirmed':
        return 'مؤكد';
      case 'rejected':
        return 'مرفوض';
      case 'resolved':
        return 'تم الحل';
      default:
        return statusStr;
    }
  }

  getItemImageUrl(imageUrl: string | null | undefined): string {
    return this.imageUrlService.resolve(imageUrl || undefined);
  }

  getItemLocation(location: any): string {
    return location?.address || 'غير محدد';
  }

  getMatchesCount(status: string): number {
    if (status === 'All') return this.allMatches.length;
    const normalized = normalizeMatchStatus(status).toLowerCase();
    return this.allMatches.filter(
      (m) => normalizeMatchStatus(m.status as any).toLowerCase() === normalized
    ).length;
  }

  canConfirm(match: MatchDto): boolean {
    return (
      this.isLostOwner(match) &&
      normalizeMatchStatus(match.status as any).toLowerCase() === 'pending'
    );
  }

  canReject(match: MatchDto): boolean {
    return (
      this.isLostOwner(match) &&
      normalizeMatchStatus(match.status as any).toLowerCase() === 'pending'
    );
  }

  canResolve(match: MatchDto): boolean {
    return (
      this.isLostOwner(match) &&
      normalizeMatchStatus(match.status as any).toLowerCase() === 'confirmed'
    );
  }

  // Only the owner of the lost item can control the match status
  private isLostOwner(match: MatchDto): boolean {
    const currentUser = this.tokenService.getCurrentUser();
    const lostOwnerId = match.lostItem?.userId;
    return !!currentUser?.id && !!lostOwnerId && currentUser.id === lostOwnerId;
  }
  //#endregion
}
