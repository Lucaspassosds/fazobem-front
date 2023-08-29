import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { UnauthInterceptor } from './interceptors/unauth-interceptor';
import { LandingComponent } from './components/landing/landing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationMenuComponent } from './components/navigation-menu/navigation-menu.component';
import { CompanyListComponent } from './components/company-list/company-list.component';
import { CompanyCreateComponent } from './components/company-create/company-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppTableComponent } from './components/app-table/app-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaskModule } from 'ngx-mask';
import { LocationListComponent } from './components/location-list/location-list.component';
import { LocationCreateComponent } from './components/location-create/location-create.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventCreateComponent } from './components/event-create/event-create.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { RoleCreateComponent } from './components/role-create/role-create.component';
import { VoluntaryListComponent } from './components/voluntary-list/voluntary-list.component';
import { ShiftInfoComponent } from './components/shift-info/shift-info.component';
import { CommonModule, DatePipe } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { AllShiftsComponent } from './components/all-shifts/all-shifts.component';
import { MyShiftsComponent } from './components/my-shifts/my-shifts.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ShiftDetailsComponent } from './components/shift-details/shift-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    NavigationMenuComponent,
    CompanyListComponent,
    CompanyCreateComponent,
    AppTableComponent,
    LocationListComponent,
    LocationCreateComponent,
    EventListComponent,
    EventCreateComponent,
    RoleListComponent,
    RoleCreateComponent,
    VoluntaryListComponent,
    ShiftInfoComponent,
    UserListComponent,
    AllShiftsComponent,
    MyShiftsComponent,
    UserProfileComponent,
    ShiftDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTooltipModule,
    NgxMaskModule.forRoot(),
    CommonModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UnauthInterceptor, multi: true },
    DatePipe,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
