import { canAccessScreen, getAccessibleScreens } from './permissionMapping';

export interface Permission {
  screen: string;
  action?: string;
}

export interface RolePermissions {
  [key: string]: Permission[];
}

// Legacy hardcoded permissions (fallback for users without governance roles)
export const ROLE_PERMISSIONS: RolePermissions = {
  admin: [
    { screen: 'dashboard' },
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

// Get user permissions from localStorage
function getUserPermissions(): string[] {
  try {
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    return userData.permissions || [];
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }
}

// Get user role from localStorage
function getUserRole(): string {
  try {
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    return userData.role || 'member';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'member';
  }
}

// Main permission check function - uses dynamic permissions if available
export function hasPermission(userRole: string, screen: string): boolean {
  const userPermissions = getUserPermissions();

  // If user has governance permissions, use them
  if (userPermissions.length > 0) {
    return canAccessScreen(userPermissions, screen);
  }

  // Fallback to legacy role-based permissions
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.some(permission => permission.screen === screen);
}

export function getPermittedScreens(userRole: string): string[] {
  const userPermissions = getUserPermissions();

  // If user has governance permissions, use them
  if (userPermissions.length > 0) {
    return getAccessibleScreens(userPermissions);
  }

  // Fallback to legacy role-based permissions
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.map(permission => permission.screen);
}

export function getGovernanceRestrictions(userRole: string) {
  return GOVERNANCE_RESTRICTIONS[userRole] || {};
}

export function getDefaultRoute(userRole: string): string {
  const userPermissions = getUserPermissions();

  // If user has permissions, route to first accessible screen
  if (userPermissions.length > 0) {
    const accessibleScreens = getAccessibleScreens(userPermissions);
    if (accessibleScreens.includes('dashboard')) return '/dashboard';
    if (accessibleScreens.includes('documents')) return '/documents';
    if (accessibleScreens.includes('meetings')) return '/meetings';
    if (accessibleScreens.includes('governance')) return '/governance';
    return '/profile'; // Fallback to profile
  }

  // Legacy fallback
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