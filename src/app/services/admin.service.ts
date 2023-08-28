import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Organization, OrganizationAdmin } from 'src/constants/interfaces';
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
}
