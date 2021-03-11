export interface Roles {
  subscriber?: boolean;
  editor?: boolean;
  admin?: boolean;
}

export interface User {
  uid: string;
  email: string;
  roles: Roles;
}

export class CurrentUser {
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    username: string;
    role: string;
    email: string;
}
