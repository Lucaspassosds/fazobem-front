import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Location,
  Organization,
  OrganizationAdmin,
  VoluntaryRole,
} from 'src/constants/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  organizationsGet(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${environment.apiUrl}/organization`);
  }

  organizationGetSingle(organizationId: string): Observable<Organization> {
    return this.http.get<Organization>(
      `${environment.apiUrl}/organization/${organizationId}`
    );
  }

  organizationCreate(name: string) {
    return this.http.post<Organization>(`${environment.apiUrl}/organization`, {
      name,
    });
  }

  organizationUpdate(name: string, organizationId: string) {
    return this.http.patch<Organization>(
      `${environment.apiUrl}/organization/${organizationId}`,
      {
        name,
      }
    );
  }

  organizationDelete(organizationId: string) {
    return this.http.delete<Organization>(
      `${environment.apiUrl}/organization/${organizationId}`
    );
  }

  inviteOrganizationAdmin(body: { email: string; organizationId: string }) {
    return this.http.post<OrganizationAdmin>(
      `${environment.apiUrl}/organization-admin`,
      body
    );
  }

  removeAdmin(organizationAdminId: string) {
    return this.http.delete<OrganizationAdmin>(
      `${environment.apiUrl}/organization-admin/${organizationAdminId}`
    );
  }

  locationsGet() {
    return this.http.get<Location[]>(`${environment.apiUrl}/location`);
  }

  locationDelete(locationId: string) {
    return this.http.delete<Location>(
      `${environment.apiUrl}/location/${locationId}`
    );
  }

  locationGetSingle(locationId: string): Observable<Location> {
    return this.http.get<Location>(
      `${environment.apiUrl}/location/${locationId}`
    );
  }

  locationCreate(body: {
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    description: string;
    organizationId: string;
  }) {
    return this.http.post<Location>(`${environment.apiUrl}/location`, body);
  }

  locationUpdate(
    body: {
      name: string;
      addressLine1: string;
      addressLine2: string;
      city: string;
      state: string;
      description: string;
      organizationId: string;
    },
    locationId: string
  ) {
    return this.http.patch<Location>(
      `${environment.apiUrl}/location/${locationId}`,
      body
    );
  }
  rolesGet() {
    return this.http.get<VoluntaryRole[]>(
      `${environment.apiUrl}/voluntary-role`
    );
  }

  roleDelete(roleId: string) {
    return this.http.delete<VoluntaryRole>(
      `${environment.apiUrl}/voluntary-role/${roleId}`
    );
  }

  roleGetSingle(roleId: string): Observable<VoluntaryRole> {
    return this.http.get<VoluntaryRole>(
      `${environment.apiUrl}/voluntary-role/${roleId}`
    );
  }

  roleCreate(body: { name: string; description: string }) {
    return this.http.post<VoluntaryRole>(
      `${environment.apiUrl}/voluntary-role`,
      body
    );
  }

  roleUpdate(
    body: {
      name: string;
      description: string;
    },
    roleId: string
  ) {
    return this.http.patch<VoluntaryRole>(
      `${environment.apiUrl}/voluntary-role/${roleId}`,
      body
    );
  }
}
