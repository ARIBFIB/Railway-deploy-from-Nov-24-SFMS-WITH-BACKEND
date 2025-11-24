export interface Permission {
  screen: string;
  action?: string;
}

export interface RolePermissions {
  [key: string]: Permission[];
}

export const ROLE_PERMISSIONS: RolePermissions = {
  admin: [
    { screen: 'dashboard' },
    { screen: 'foundations' },
    { screen: 'foundations' },
    { screen: 'governance' },
    { screen: 'documents' },
    { screen: 'financial' },
    { screen: 'facility-register' },
    { screen: 'meetings' },
    { screen: 'expenses' },
    { screen: 'investments' },
    { screen: 'projects' },
    { screen: 'grants' },
    { screen: 'billing' },
    { screen: 'order' },
    { screen: 'stock' },
    { screen: 'salary' },
    { screen: 'quotes' },
    { screen: 'reports' },
    { screen: 'profile' },
    { screen: 'settings' },
    { screen: 'inventory' },
    { screen: 'customers' },
    { screen: 'warehouses' },
    { screen: 'suppliers' },
    { screen: 'wage-types' },
    { screen: 'personnel-register' }
  ],
  foundation_owner: [
    { screen: 'manager-dashboard' },
    { screen: 'foundations' },
    { screen: 'governance' },
    { screen: 'financial' },
    { screen: 'facility-register' },
    { screen: 'meetings' },
    { screen: 'expenses' },
    { screen: 'projects' },
    { screen: 'grants' },
    { screen: 'billing' },
    { screen: 'order' },
    { screen: 'stock' },
    { screen: 'salary' },
    { screen: 'quotes' },
    { screen: 'reports' },
    { screen: 'profile' },
    { screen: 'inventory' },
    { screen: 'customers' },
    { screen: 'warehouses' },
    { screen: 'suppliers' },
    { screen: 'wage-types' },
    { screen: 'personnel-register' }
  ],
  member: [
    { screen: 'dashboard' },
    { screen: 'profile' },
    { screen: 'grants' },
    { screen: 'projects' },
    { screen: 'meetings' },
    { screen: 'billing' }
  ]
};

export const GOVERNANCE_RESTRICTIONS: { [key: string]: { hideRoleManagement?: boolean; hideDocumentWorkflows?: boolean; hideRoleBasedAccessControl?: boolean } } = {
  foundation_owner: {
    hideRoleManagement: true,
    hideDocumentWorkflows: true,
    hideRoleBasedAccessControl: true
  }
};

export function hasPermission(userRole: string, screen: string): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.some(permission => permission.screen === screen);
}

export function getPermittedScreens(userRole: string): string[] {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.map(permission => permission.screen);
}

export function getGovernanceRestrictions(userRole: string) {
  return GOVERNANCE_RESTRICTIONS[userRole] || {};
}

export function getDefaultRoute(userRole: string): string {
  switch (userRole) {
    case 'admin':
      return '/dashboard';
    case 'foundation_owner':
      return '/manager-dashboard';
    case 'member':
      return '/dashboard';
    default:
      return '/dashboard';
  }
}