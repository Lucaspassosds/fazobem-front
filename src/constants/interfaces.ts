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
