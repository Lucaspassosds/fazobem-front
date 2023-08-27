import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { UnauthInterceptor } from './interceptors/unauth-interceptor';
import { LandingComponent } from './components/landing/landing.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NavigationMenuComponent } from './components/navigation-menu/navigation-menu.component';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyCreateComponent } from './components/company-create/company-create.component';

@NgModule({
  declarations: [AppComponent, LandingComponent, NavigationMenuComponent, CompanyListComponent, CompanyCreateComponent],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UnauthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
