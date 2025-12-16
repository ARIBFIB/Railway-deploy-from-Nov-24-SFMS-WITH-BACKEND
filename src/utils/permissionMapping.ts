// Permission to Screen/Feature Mapping
// This maps governance role permissions to actual screens and features

export const PERMISSION_TO_SCREEN_MAP: { [key: string]: string[] } = {
    // Document permissions
    'approve_documents': ['documents', 'governance'],
    'review_documents': ['documents', 'governance'],
    'create_documents': ['documents'],

    // Meeting permissions
    'schedule_meetings': ['meetings', 'governance'],
    'attend_meetings': ['meetings'],
    'create_minutes': ['meetings', 'governance'],
    'approve_minutes': ['meetings', 'governance'],

    // User management
    'manage_users': ['governance', 'settings'],

    // Data access
    'view_all_data': ['dashboard', 'reports', 'financial', 'documents', 'meetings', 'projects', 'grants', 'investments'],
    'view_foundation_data': ['dashboard', 'reports'],

    // Audit and compliance
    'view_audit_trails': ['governance', 'reports'],
    'review_compliance': ['governance'],

    // Reports
    'generate_reports': ['reports'],

    // Financial
    'manage_investments': ['investments', 'financial'],
    'approve_expenses': ['expenses', 'financial'],
};

// Get all screens a user can access based on their permissions
export function getAccessibleScreens(permissions: string[]): string[] {
    const screens = new Set<string>();

    permissions.forEach(permission => {
        const permissionScreens = PERMISSION_TO_SCREEN_MAP[permission] || [];
        permissionScreens.forEach(screen => screens.add(screen));
    });

    // Always allow profile access
    screens.add('profile');

    return Array.from(screens);
}

// Check if user has permission to access a screen
export function canAccessScreen(permissions: string[], screen: string): boolean {
    const accessibleScreens = getAccessibleScreens(permissions);
    return accessibleScreens.includes(screen);
}

// Check if user has a specific permission
export function hasSpecificPermission(permissions: string[], permission: string): boolean {
    return permissions.includes(permission);
}

// Check if user has ANY of the specified permissions
export function hasAnyPermission(permissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.some(perm => permissions.includes(perm));
}

// Check if user has ALL of the specified permissions
export function hasAllPermissions(permissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.every(perm => permissions.includes(perm));
}
