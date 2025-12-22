import { Component, OnInit, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminStatisticsComponent } from '../statistics/admin-statistics.component';
import { AdminUsersComponent } from '../users/admin-users.component';
import { AdminItemsComponent } from '../items/admin-items.component';
import { AdminReportsComponent } from '../reports/admin-reports.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    AdminStatisticsComponent,
    AdminUsersComponent,
    AdminItemsComponent,
    AdminReportsComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminDashboardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  activeSection: 'statistics' | 'users' | 'items' | 'reports' = 'statistics';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const section = params['section'];
      if (section && ['statistics', 'users', 'items', 'reports'].includes(section)) {
        this.activeSection = section;
      }
    });
  }

  setActiveSection(section: 'statistics' | 'users' | 'items' | 'reports') {
    this.activeSection = section;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section: section },
      queryParamsHandling: 'merge'
    });
  }
}

