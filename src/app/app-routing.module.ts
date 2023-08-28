import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { NavigationMenuComponent } from './components/navigation-menu/navigation-menu.component';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyCreateComponent } from './components/company-create/company-create.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    data: {
      routeId: 0,
      pageTitle: 'Landing page',
    },
  },
  {
    path: 'routes',
    component: NavigationMenuComponent,
    data: {
      routeId: 1,
      pageTitle: 'Navigation menu',
    },
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'company-list',
    component: CompanyListComponent,
    data: {
      routeId: 2,
      pageTitle: 'Organization list'
    },
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'company-create',
    component: CompanyCreateComponent,
    data: {
      routeId: 3,
      pageTitle: 'Organization form'
    },
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'company-create/:organizationId',
    component: CompanyCreateComponent,
    data: {
      routeId: 3,
      pageTitle: 'Organization form'
    },
    canActivate: [AdminAuthGuard],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
