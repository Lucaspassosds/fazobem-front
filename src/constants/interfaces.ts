export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  securityQuestion?: string;
  securityAnswer?: string;
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

