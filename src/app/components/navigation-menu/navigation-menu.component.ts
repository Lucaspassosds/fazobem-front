import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GlobalService } from 'src/app/services/global.service';
import { UserRole } from 'src/constants/interfaces';

interface RouteOption {
  route: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent implements OnInit {

  systemAdminRoutes: RouteOption[] = [
    {
      route: 'company-list',
      label: 'Organizações',
      icon: 'ph ph-buildings'
    },
  ];
  orgAdminRoutes: RouteOption[] = [];
  voluntaryRoutes: RouteOption[] = [];

  role: UserRole;

  constructor(private authService: AuthenticationService, private router: Router) {

  }

  async ngOnInit() {
    const isAuthenticated = await this.authService.isAuthenticated();
    if (!isAuthenticated) {
      this.router.navigate(['']);
    }
    const user = await this.authService.getCurrentUser();
    this.role = user.role;
  }

  get routeOptions() {

    const { role } = this;

    if (role === UserRole.systemAdmin) {
      return this.systemAdminRoutes;
    } else if (role === UserRole.organizationAdmin) {
      return this.orgAdminRoutes;
    } else if (role === UserRole.voluntary) {
      return this.voluntaryRoutes;
    } else {
      return [];
    }
  }

  navigateToRoute(route: string) {
    this.router.navigate([route]);
  }

}
