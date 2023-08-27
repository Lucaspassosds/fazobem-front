import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
<<<<<<< HEAD
import { NavigationMenuComponent } from './components/navigation-menu/navigation-menu.component';
=======
>>>>>>> cb29a2ee9ab967da73f677b2fcad58fa706ec7a9

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    data: {
      routeId: 0,
      pageTitle: 'Landing page',
    },
  },
<<<<<<< HEAD
  {
    path: 'routes',
    component: NavigationMenuComponent,
    data: {
      routeId: 1,
      pageTitle: 'Navigation menu',
    },
  },
  { path: '**', redirectTo: '' },
=======
>>>>>>> cb29a2ee9ab967da73f677b2fcad58fa706ec7a9
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
