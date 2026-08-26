export const ADMIN_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MANAGER: 'manager',
  KITCHEN: 'kitchen',
  CASHIER: 'cashier',
};

export const ROLE_LABELS = {
  [ADMIN_ROLES.OWNER]: 'Owner',
  [ADMIN_ROLES.ADMIN]: 'Admin',
  [ADMIN_ROLES.MANAGER]: 'Manager',
  [ADMIN_ROLES.KITCHEN]: 'Kitchen',
  [ADMIN_ROLES.CASHIER]: 'Cashier',
  [ADMIN_ROLES.STAFF]: 'Staff',
};

export const ADMIN_NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', path: '/admin', roles: Object.values(ADMIN_ROLES) },
  { key: 'orders', label: 'Orders', path: '/admin/orders', roles: Object.values(ADMIN_ROLES) },
  { key: 'menu', label: 'Menu', path: '/admin/menu', roles: [ADMIN_ROLES.OWNER, ADMIN_ROLES.ADMIN, ADMIN_ROLES.MANAGER] },
  { key: 'categories', label: 'Categories', path: '/admin/categories', roles: [ADMIN_ROLES.OWNER, ADMIN_ROLES.ADMIN, ADMIN_ROLES.MANAGER] },
  { key: 'customers', label: 'Customers', path: '/admin/customers', roles: [ADMIN_ROLES.OWNER, ADMIN_ROLES.ADMIN, ADMIN_ROLES.MANAGER, ADMIN_ROLES.CASHIER] },
  { key: 'staff', label: 'Staff Management', path: '/admin/staff', roles: [ADMIN_ROLES.OWNER, ADMIN_ROLES.ADMIN] },
  { key: 'deliveries', label: 'Deliveries', path: '/admin/deliveries', roles: [ADMIN_ROLES.OWNER, ADMIN_ROLES.ADMIN, ADMIN_ROLES.MANAGER] },
  { key: 'payments', label: 'Payments', path: '/admin/payments', roles: [ADMIN_ROLES.OWNER, ADMIN_ROLES.ADMIN, ADMIN_ROLES.CASHIER] },
  { key: 'notifications', label: 'Notifications', path: '/admin/notifications', roles: [ADMIN_ROLES.OWNER, ADMIN_ROLES.ADMIN, ADMIN_ROLES.MANAGER, ADMIN_ROLES.KITCHEN] },
  { key: 'reports', label: 'Analytics', path: '/admin/analytics', roles: [ADMIN_ROLES.OWNER, ADMIN_ROLES.ADMIN, ADMIN_ROLES.MANAGER] },
  { key: 'settings', label: 'Settings', path: '/admin/settings', roles: [ADMIN_ROLES.OWNER, ADMIN_ROLES.ADMIN] },
];

export const canAccessByRole = (role, allowedRoles = []) => {
  if (!role) return false;
  return allowedRoles.includes(role);
};

export const getPageTitleByPath = (pathname) => {
  const item = ADMIN_NAV_ITEMS.find((navItem) => navItem.path === pathname);
  return item?.label || 'Admin';
};
