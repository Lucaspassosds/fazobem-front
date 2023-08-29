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
  styleUrls: ['./navigation-menu.component.scss'],
})
export class NavigationMenuComponent implements OnInit {
  systemAdminRoutes: RouteOption[] = [
    {
      route: 'company-list',
      label: 'Organizações',
      icon: 'ph ph-buildings',
    },
    {
      route: 'user-list',
      label: 'Usuários',
      icon: 'ph ph-users',
    },
  ];
  orgAdminRoutes: RouteOption[] = [
    {
      route: 'location-list',
      label: 'Localidades',
      icon: 'ph ph-map-pin-line',
    },
    {
      route: 'event-list',
      label: 'Eventos',
      icon: 'ph ph-star',
    },
    {
      route: 'role-list',
      label: 'Papéis',
      icon: 'ph ph-clipboard-text',
    },
    {
      route: 'voluntary-list',
      label: 'Voluntários',
      icon: 'ph ph-users-three',
    },
  ];
  voluntaryRoutes: RouteOption[] = [
    {
      route: 'all-shifts',
      label: 'Ver tarefas disponíveis',
      icon: 'ph ph-list-bullets',
    },
    {
      route: 'my-shifts',
      label: 'Minhas tarefas',
      icon: 'ph ph-list-checks',
    },
    {
      route: 'user-profile',
      label: 'Meu perfil',
      icon: 'ph ph-user',
    },
  ];

  role: UserRole;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

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

  logout() {
    if (confirm('Tem certeza de que deseja sair?')) {
      this.authService
        .logout()
        .toPromise()
        .then(() => {
          this.router.navigate(['']);
        })
        .catch((error: any) => {
          throw new Error(error);
        });
    }
  }
}
