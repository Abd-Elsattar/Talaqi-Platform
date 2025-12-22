import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminService } from '../../../../core/services/admin.service';
import { AdminStatisticsDto } from '../../../../core/models/match';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-statistics',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './admin-statistics.component.html',
  styleUrls: ['./admin-statistics.component.css']
})
export class AdminStatisticsComponent implements OnInit {
  private adminService = inject(AdminService);

  statistics: AdminStatisticsDto | null = null;
  loading = true;

  ngOnInit() {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading = true;
    this.adminService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('خطأ', 'فشل تحميل الإحصائيات', 'error');
      },
    });
  }
}
