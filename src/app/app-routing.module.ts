import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { NavigationMenuComponent } from './components/navigation-menu/navigation-menu.component';

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
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
