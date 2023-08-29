export interface User extends BaseTable {
  name: string;
  email: string;
  role: UserRole;
  securityQuestion?: string;
  securityAnswer?: string;
  organizationAdmin?: OrganizationAdmin;
}

export enum UserRole {
  organizationAdmin = 'organization-admin',
  voluntary = 'voluntary',
  systemAdmin = 'system-admin',
  noRole = 'no-role',
}

export interface BaseTable {
  id: string;
  isDeleted: boolean;
  autoCreateTs: string;
  autoUpdateTs: string;
  deletedTs: string;
  createdBy: string;
  modifiedBy: string;
  deletedBy: string;
}

export interface Organization extends BaseTable {
  name: string;
  admins?: number;
  organizationAdmin: OrganizationAdmin[];
}

export interface OrganizationAdmin extends BaseTable {
  organizationId: string;
  isRegistered: boolean;
  user?: User;
}

export interface Location extends BaseTable {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipcode: string;
  description: string;
  organizationId: string;
  organizationEvents?: OrganizationEvent[];
}

export interface VoluntaryRole extends BaseTable {
  name: string;
  description: string;
}

export interface OrganizationEvent extends BaseTable {
  name: string;
  eventDate: string;
  description: string;
  isPublished: boolean;
  locationId: string;
  location: Location;
  shifts: Shift[];
}

export interface Shift extends BaseTable {
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
  voluntaryRole?: VoluntaryRole;
  voluntaryShift?: VoluntaryShift[];
}

export interface VoluntaryShift extends BaseTable {
  isConfirmed: boolean;
  signUpTime: string;
  confirmTime: string;
  voluntaryId: string;
  shiftId: string;
  voluntary: Voluntary;
}

export interface Voluntary extends BaseTable {
  userId: string;
  birthdate: string;
  user: User;
  voluntaryShift?: VoluntaryShift[];
}
