import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Location,
  Organization,
  OrganizationAdmin,
  OrganizationEvent,
  Shift,
  User,
  Voluntary,
  VoluntaryRole,
  VoluntaryShift,
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
  eventsGet() {
    return this.http.get<OrganizationEvent[]>(
      `${environment.apiUrl}/organization-event`
    );
  }

  eventDelete(eventId: string) {
    return this.http.delete<OrganizationEvent>(
      `${environment.apiUrl}/organization-event/${eventId}`
    );
  }

  eventGetSingle(eventId: string): Observable<OrganizationEvent> {
    return this.http.get<OrganizationEvent>(
      `${environment.apiUrl}/organization-event/${eventId}`
    );
  }

  eventCreate(body: {
    name: string;
    description: string;
    eventDate: string;
    isPublished: boolean;
    locationId: string;
  }) {
    return this.http.post<OrganizationEvent>(
      `${environment.apiUrl}/organization-event`,
      body
    );
  }

  eventUpdate(
    body: {
      name: string;
      description: string;
      eventDate: string;
      isPublished: boolean;
      locationId: string;
    },
    eventId: string
  ) {
    return this.http.patch<OrganizationEvent>(
      `${environment.apiUrl}/organization-event/${eventId}`,
      body
    );
  }

  publishEvent(eventId: string) {
    return this.http.patch<OrganizationEvent>(
      `${environment.apiUrl}/organization-event/publish/${eventId}`,
      {}
    );
  }

  shiftCreate(body: {
    startTime: string;
    endTime: string;
    quantityNeeded: number;
    staffingManagerName: string;
    staffingManagerPhoneNumber: string;
    staffingManagerEmail: string;
    jobRequirements: string;
    otherInfo: string;
    voluntaryRoleId: string;
    organizationEventId: string;
  }) {
    return this.http.post<Shift>(`${environment.apiUrl}/shift`, body);
  }

  shiftUpdate(
    body: {
      startTime: string;
      endTime: string;
      quantityNeeded: number;
      staffingManagerName: string;
      staffingManagerPhoneNumber: string;
      staffingManagerEmail: string;
      jobRequirements: string;
      otherInfo: string;
      voluntaryRoleId: string;
      organizationEventId: string;
    },
    shiftId: string
  ) {
    return this.http.patch<Shift>(
      `${environment.apiUrl}/shift/${shiftId}`,
      body
    );
  }

  shiftDelete(shiftId: string) {
    return this.http.delete<Shift>(`${environment.apiUrl}/shift/${shiftId}`);
  }

  voluntariesGet() {
    return this.http.get<Voluntary[]>(`${environment.apiUrl}/voluntary`);
  }

  voluntaryShiftsGetByShift(shiftId: string) {
    return this.http.get<VoluntaryShift[]>(
      `${environment.apiUrl}/voluntary-shifts/shifts/${shiftId}`
    );
  }

  voluntaryShiftsCreate(body: { shiftId: string; voluntaryId: string }) {
    return this.http.post<VoluntaryShift>(
      `${environment.apiUrl}/voluntary-shifts`,
      body
    );
  }

  voluntaryShiftsDelete(voluntaryShiftId: string) {
    return this.http.delete<VoluntaryShift>(
      `${environment.apiUrl}/voluntary-shifts/${voluntaryShiftId}`
    );
  }

  usersGet() {
    return this.http.get<User[]>(`${environment.apiUrl}/user`);
  }

  userRemove(userId: string) {
    return this.http.delete<User>(`${environment.apiUrl}/user/${userId}`);
  }
}
