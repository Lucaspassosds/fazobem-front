import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { NavigationMenuComponent } from './components/navigation-menu/navigation-menu.component';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyCreateComponent } from './components/company-create/company-create.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { LocationListComponent } from './components/location-list/location-list.component';
import { LocationCreateComponent } from './components/location-create/location-create.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventCreateComponent } from './components/event-create/event-create.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { RoleCreateComponent } from './components/role-create/role-create.component';
import { VoluntaryListComponent } from './components/voluntary-list/voluntary-list.component';
import { ShiftInfoComponent } from './components/shift-info/shift-info.component';

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
  {
    path: 'location-list',
    component: LocationListComponent,
    data: {
      routeId: 4,
      pageTitle: 'Location list'
    },
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'location-create',
    component: LocationCreateComponent,
    data: {
      routeId: 5,
      pageTitle: 'Location form'
    },
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'location-create/:locationId',
    component: LocationCreateComponent,
    data: {
      routeId: 6,
      pageTitle: 'Location form'
    },
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'event-list',
    component: EventListComponent,
    data: {
      routeId: 7,
      pageTitle: 'Event list'
    },
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'event-create',
    component: EventCreateComponent,
    data: {
      routeId: 8,
      pageTitle: 'Event form'
    },
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'event-create/:eventId',
    component: EventCreateComponent,
    data: {
      routeId: 9,
      pageTitle: 'Event form'
    },
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'role-list',
    component: RoleListComponent,
    data: {
      routeId: 10,
      pageTitle: 'Role list'
    },
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'role-create',
    component: RoleCreateComponent,
    data: {
      routeId: 11,
      pageTitle: 'Role form'
    },
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'role-create/:roleId',
    component: RoleCreateComponent,
    data: {
      routeId: 12,
      pageTitle: 'Role form'
    },
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'voluntary-list',
    component: VoluntaryListComponent,
    data: {
      routeId: 13,
      pageTitle: 'Voluntary list'
    },
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'shift-info/:shiftId',
    component: ShiftInfoComponent,
    data: {
      routeId: 14,
      pageTitle: 'Shift info'
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
