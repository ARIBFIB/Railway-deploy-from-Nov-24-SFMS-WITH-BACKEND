import React, { useState, useEffect } from 'react';
import { Shield, Users, Plus, Edit, Trash2, UserPlus } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Select } from '../Select';
import { ListManager } from '../ListManager';
import { apiFetch } from '../../utils/api';

interface Role {
  id: string;
  name: string;
  permissions: string[];
  description: string;
  user_count: number;
}

interface Login {
  id: string;
  email: string;
  password: string;
  roleId: string;
}

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Board Chairman',
    permissions: ['approve_documents', 'schedule_meetings', 'manage_users', 'view_all_data'],
    description: 'Full governance authority with approval rights',
    user_count: 1
  },
  {
    id: '2',
    name: 'Board Member',
    permissions: ['review_documents', 'attend_meetings', 'view_foundation_data'],
    description: 'Standard board member with review and voting rights',
    user_count: 5
  },
  {
    id: '3',
    name: 'Secretary',
    permissions: ['create_minutes', 'manage_documents', 'schedule_meetings'],
    description: 'Administrative role for meeting and document management',
    user_count: 1
  },
  {
    id: '4',
    name: 'Auditor',
    permissions: ['view_audit_trails', 'review_compliance', 'generate_reports'],
    description: 'External auditor with read-only access to compliance data',
    user_count: 2
  }
];

const availablePermissions = [
  'approve_documents',
  'review_documents',
  'create_documents',
  'schedule_meetings',
  'attend_meetings',
  'create_minutes',
  'approve_minutes',
  'manage_users',
  'view_all_data',
  'view_foundation_data',
  'view_audit_trails',
  'review_compliance',
  'generate_reports',
  'manage_investments',
  'approve_expenses'
];

export const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateLoginModal, setShowCreateLoginModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Fetch roles from API on component mount
  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/api/governance/roles');
      if (!response.ok) throw new Error('Failed to fetch roles');
      const data = await response.json();
      console.log('📋 Fetched roles data:', data);
      console.log('📋 Roles array:', data.roles);
      setRoles(data.roles || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      // Don't fallback to mock data - show empty state or error
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await apiFetch('/api/governance/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      console.log('👥 Fetched users:', data);
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleCreateRole = async (roleData: Partial<Role>) => {
    try {
      console.log('🆕 Creating role with data:', roleData);
      console.log('🆕 Permissions being sent:', roleData.permissions);

      const response = await apiFetch('/api/governance/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foundation_id: '00000000-0000-0000-0000-000000000000', // Replace with actual foundation_id
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions
        })
      });

      if (!response.ok) throw new Error('Failed to create role');

      // Refresh roles list
      await fetchRoles();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating role:', error);
      alert('Failed to create role. Please try again.');
    }
  };

  const handleEditRole = async (roleData: Partial<Role>) => {
    if (editingRole) {
      try {
        console.log('🔧 Editing role with data:', roleData);
        console.log('🔧 Permissions being sent:', roleData.permissions);

        const response = await apiFetch(`/api/governance/roles/${editingRole.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: roleData.name,
            description: roleData.description,
            permissions: roleData.permissions
          })
        });

        if (!response.ok) throw new Error('Failed to update role');

        // Refresh roles list
        await fetchRoles();
        setEditingRole(null);
      } catch (error) {
        console.error('Error updating role:', error);
        alert('Failed to update role. Please try again.');
      }
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role?')) {
      return;
    }

    try {
      const response = await apiFetch(`/api/governance/roles/${roleId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete role');

      // Refresh roles list
      await fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      alert('Failed to delete role. Please try again.');
    }
  };

  const handleCreateLogin = async (loginData: Partial<Login>) => {
    try {
      console.log('👤 Creating user with login data:', loginData);

      // Call the auth register endpoint to create a new user
      const response = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
          full_name: loginData.email?.split('@')[0] || 'User', // Use email prefix as name
          role: 'member', // Default profile role
          governance_role_id: loginData.roleId // Assign to governance role
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create user');
      }

      // Refresh both roles and users lists
      await fetchRoles();
      await fetchUsers();
      setShowCreateLoginModal(false);
      alert('User created successfully! They can now log in with their credentials.');
    } catch (error) {
      console.error('Error creating user:', error);
      alert(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Role Management</h2>
          <p className="text-gray-600 mt-1">Define and manage governance roles and permissions.</p>
        </div>
        <div className="flex space-x-2">
          <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
            Create Role
          </Button>
          <Button icon={UserPlus} onClick={() => setShowCreateLoginModal(true)}>
            Create Login
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading roles...</p>
          </div>
        </div>
      ) : roles && roles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card key={role.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {role.user_count || 0} users
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit}
                    onClick={() => setEditingRole(role)}
                  >
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDeleteRole(role.id)}
                  >
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4">{role.description}</p>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Permissions:</h4>
                <div className="flex flex-wrap gap-1">
                  {role.permissions && role.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {permission.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first governance role.</p>
          <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
            Create First Role
          </Button>
        </div>
      )}

      {/* Users Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Users</h3>
            <p className="text-gray-600 mt-1">Manage user accounts and their access.</p>
          </div>
        </div>

        {loadingUsers ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          </div>
        ) : users && users.length > 0 ? (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.full_name || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {user.role || 'member'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-4">Create user accounts to grant access to the system.</p>
            <Button icon={UserPlus} onClick={() => setShowCreateLoginModal(true)}>
              Create First User
            </Button>
          </div>
        )}
      </div>

      {/* Create Role Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Role"
        size="lg"
      >
        <RoleForm
          onSubmit={handleCreateRole}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        isOpen={!!editingRole}
        onClose={() => setEditingRole(null)}
        title="Edit Role"
        size="lg"
      >
        {editingRole && (
          <RoleForm
            role={editingRole}
            onSubmit={handleEditRole}
            onCancel={() => setEditingRole(null)}
          />
        )}
      </Modal>

      {/* Create Login Modal */}
      <Modal
        isOpen={showCreateLoginModal}
        onClose={() => setShowCreateLoginModal(false)}
        title="Create New Login"
        size="md"
      >
        <LoginForm
          roles={roles}
          onSubmit={handleCreateLogin}
          onCancel={() => setShowCreateLoginModal(false)}
        />
      </Modal>
    </div>
  );
};

interface RoleFormProps {
  role?: Role;
  onSubmit: (data: Partial<Role>) => void;
  onCancel: () => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ role, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '',
    permissions: role?.permissions || []
  });
  const [isManualEntry, setIsManualEntry] = useState(false);

  const [predefinedRoleTypes, setPredefinedRoleTypes] = useState([
    'Board Chairman',
    'Board Member',
    'Secretary',
    'Treasurer',
    'Vice Chairman',
    'Auditor',
    'Legal Advisor',
    'Financial Advisor',
    'Project Manager',
    'Administrator',
    'Compliance Officer',
    'Risk Manager',
    'Other'
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePermissionToggle = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">Role Name *</label>
          <ListManager
            items={predefinedRoleTypes}
            onItemsChange={setPredefinedRoleTypes}
            title="Role Types"
            placeholder="Add new role type"
            buttonText="Manage Roles"
          />
        </div>

        {/* Toggle between dropdown and manual entry */}
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            onClick={() => setIsManualEntry(false)}
            className={`px-3 py-1 text-sm rounded-md ${!isManualEntry
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Select from list
          </button>
          <button
            type="button"
            onClick={() => setIsManualEntry(true)}
            className={`px-3 py-1 text-sm rounded-md ${isManualEntry
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            Enter manually
          </button>
        </div>

        {isManualEntry ? (
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter role name"
            required
          />
        ) : (
          <select
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="">Select role type</option>
            {predefinedRoleTypes.map((roleType) => (
              <option key={roleType} value={roleType}>
                {roleType}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Describe the role's responsibilities"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Permissions
        </label>
        <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
          {availablePermissions.map((permission) => (
            <label key={permission} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.permissions.includes(permission)}
                onChange={() => handlePermissionToggle(permission)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">
                {permission.replace(/_/g, ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {role ? 'Update Role' : 'Create Role'}
        </Button>
      </div>
    </form>
  );
};

interface LoginFormProps {
  roles: Role[];
  onSubmit: (data: Partial<Login>) => void;
  onCancel: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ roles, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    roleId: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        label="Select Role"
        value={formData.roleId}
        onChange={(e) => setFormData(prev => ({ ...prev, roleId: e.target.value }))}
        required
      >
        <option value="">Select a role</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
      </Select>

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        placeholder="e.g., user@example.com"
        required
      />

      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        placeholder="Enter password"
        required
      />

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Login
        </Button>
      </div>
    </form>
  );
};