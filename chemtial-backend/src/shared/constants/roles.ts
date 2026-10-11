export const ROLES = {
  MANAGER: "manager",
  ADMIN: "admin",
  COURIER: "courier",
  USER: "user",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Record<Role, number> = {
  manager: 100,
  admin: 70,
  courier: 50,
  user: 10,
};

export const ROLE_DISPLAY_NAMES: Record<Role, string> = {
  manager: "Manager",
  admin: "Admin",
  courier: "Kurir",
  user: "User",
};

export const ALL_ROLES: Role[] = [
  ROLES.MANAGER,
  ROLES.ADMIN,
  ROLES.COURIER,
  ROLES.USER,
];

export const ASSIGNABLE_BY_MANAGER: Role[] = [
  ROLES.ADMIN,
  ROLES.COURIER,
  ROLES.USER,
];

export const ADMIN_PANEL_ROLES: Role[] = [
  ROLES.MANAGER,
  ROLES.ADMIN,
  ROLES.COURIER,
];

export const COD_ROLES: Role[] = [ROLES.MANAGER, ROLES.ADMIN, ROLES.COURIER];
