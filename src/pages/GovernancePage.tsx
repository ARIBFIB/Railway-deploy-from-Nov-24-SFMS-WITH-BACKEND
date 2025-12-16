import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Shield, FileText, AlertTriangle, Calendar, Users } from 'lucide-react';
import { Card } from '../components/Card';
import { getGovernanceRestrictions } from '../utils/permissions';
import { RoleManagement } from '../components/governance/RoleManagement';
import { DocumentWorkflow } from '../components/governance/DocumentWorkflow';
import { ComplianceTracking } from '../components/governance/ComplianceTracking';
import { MeetingGovernance } from '../components/governance/MeetingGovernance';

type GovernanceTab = 'roles' | 'workflows' | 'compliance' | 'meetings';

import { apiFetch } from '../utils/api';
import { useState, useEffect } from 'react';

// ... existing imports ...

export const GovernancePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') as GovernanceTab;

  // Get user role and restrictions
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const userRole = userData.role || 'member';
  const restrictions = getGovernanceRestrictions(userRole);

  // State for dynamic data
  const [stats, setStats] = useState({
    activeRoles: 0,
    pendingApprovals: 0,
    complianceIssues: 0,
    meetingsThisMonth: 0
  });
  const [roles, setRoles] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [complianceItems, setComplianceItems] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, rolesRes, workflowsRes, complianceRes, auditRes] = await Promise.all([
          apiFetch('/api/governance/stats'),
          apiFetch('/api/governance/roles'),
          apiFetch('/api/governance/workflows'),
          apiFetch('/api/governance/compliance'),
          apiFetch('/api/governance/audit-logs')
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (rolesRes.ok) {
          const data = await rolesRes.json();
          setRoles(data.roles || []);
        }
        if (workflowsRes.ok) {
          const data = await workflowsRes.json();
          setWorkflows(data.workflows || []);
        }
        if (complianceRes.ok) {
          const data = await complianceRes.json();
          setComplianceItems(data.compliance_items || []);
        }
        if (auditRes.ok) {
          const data = await auditRes.json();
          setAuditLogs(data.audit_logs || []);
        }
      } catch (error) {
        console.error('Error fetching governance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'roles':
        return restrictions.hideRoleManagement ? <GovernanceOverview restrictions={restrictions} stats={stats} roles={roles} workflows={workflows} complianceItems={complianceItems} auditLogs={auditLogs} loading={loading} /> : <RoleManagement />;
      case 'workflows':
        return restrictions.hideDocumentWorkflows ? <GovernanceOverview restrictions={restrictions} stats={stats} roles={roles} workflows={workflows} complianceItems={complianceItems} auditLogs={auditLogs} loading={loading} /> : <DocumentWorkflow />;
      case 'compliance':
        return <ComplianceTracking />;
      case 'meetings':
        return <MeetingGovernance />;
      default:
        return <GovernanceOverview restrictions={restrictions} stats={stats} roles={roles} workflows={workflows} complianceItems={complianceItems} auditLogs={auditLogs} loading={loading} />;
    }
  };

  return (
    <div className="space-y-6">
      {!activeTab && (
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Governance & Compliance</h1>
          <p className="text-gray-600 mt-1">Comprehensive governance tools for foundation management.</p>
        </div>
      )}

      {/* Tab Content */}
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

interface GovernanceOverviewProps {
  restrictions?: any;
  stats: {
    activeRoles: number;
    pendingApprovals: number;
    complianceIssues: number;
    meetingsThisMonth: number;
  };
  roles: any[];
  workflows: any[];
  complianceItems: any[];
  auditLogs: any[];
  loading: boolean;
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const GovernanceOverview: React.FC<GovernanceOverviewProps> = ({
  restrictions = {},
  stats,
  roles,
  workflows,
  complianceItems,
  auditLogs,
  loading
}) => {
  if (loading) {
    return <div className="text-center py-8">Loading governance data...</div>;
  }

  // Calculate compliance stats
  const overdueCount = complianceItems.filter(i => i.status === 'overdue').length;
  const dueThisMonthCount = complianceItems.filter(i => {
    const dueDate = new Date(i.due_date);
    const now = new Date();
    return dueDate.getMonth() === now.getMonth() && dueDate.getFullYear() === now.getFullYear();
  }).length;
  const compliantCount = complianceItems.filter(i => i.status === 'compliant').length;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Roles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeRoles}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliance Issues</p>
              <p className="text-2xl font-bold text-gray-900">{stats.complianceIssues}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Meetings This Month</p>
              <p className="text-2xl font-bold text-gray-900">{stats.meetingsThisMonth}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Governance Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {!restrictions.hideRoleBasedAccessControl && (
          <Card title="Role-Based Access Control" subtitle="Manage user permissions and governance roles">
            <div className="space-y-4">
              {roles.slice(0, 3).map((role) => (
                <div key={role.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{role.name}</p>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{role.user_count || 0} users</span>
                </div>
              ))}
              {roles.length === 0 && <p className="text-gray-500 text-center py-4">No roles found</p>}
            </div>
          </Card>
        )}

        {!restrictions.hideDocumentWorkflows && (
          <Card title="Document Workflows" subtitle="Track approval processes and digital signatures">
            <div className="space-y-4">
              {workflows.slice(0, 3).map((workflow) => (
                <div key={workflow.id} className={`flex items-center justify-between p-3 border-l-4 ${workflow.status === 'completed' ? 'border-green-400 bg-green-50' :
                  workflow.status === 'pending' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-400 bg-gray-50'
                  } rounded-r-lg`}>
                  <div>
                    <p className="font-medium text-gray-900">{workflow.document_name}</p>
                    <p className="text-sm text-gray-600">
                      {workflow.status === 'pending' ? 'Pending approval' :
                        workflow.status === 'completed' ? 'Completed' : workflow.status}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${workflow.status === 'completed' ? 'bg-green-100 text-green-800' :
                    workflow.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                  </span>
                </div>
              ))}
              {workflows.length === 0 && <p className="text-gray-500 text-center py-4">No active workflows</p>}
            </div>
          </Card>
        )}
      </div>

      {/* Compliance Dashboard */}
      <Card title="Compliance Dashboard" subtitle="Monitor regulatory requirements and deadlines">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="font-medium text-gray-900">Overdue Items</h3>
            <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
            <p className="text-sm text-gray-600">
              {complianceItems.find(i => i.status === 'overdue')?.title || 'No overdue items'}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="font-medium text-gray-900">Due This Month</h3>
            <p className="text-2xl font-bold text-yellow-600">{dueThisMonthCount}</p>
            <p className="text-sm text-gray-600">
              {complianceItems.find(i => {
                const d = new Date(i.due_date);
                const n = new Date();
                return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
              })?.title || 'No items due'}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900">Compliant</h3>
            <p className="text-2xl font-bold text-green-600">{compliantCount}</p>
            <p className="text-sm text-gray-600">All other requirements</p>
          </div>
        </div>
      </Card>

      {/* Security & Audit */}
      <Card title="Security & Audit Trail" subtitle="Comprehensive logging and BankID integration">
        <div className="space-y-4">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className={`flex items-center justify-between p-3 rounded-lg ${log.action === 'login' ? 'bg-blue-50' :
              log.action === 'create' ? 'bg-green-50' :
                log.action === 'update' ? 'bg-yellow-50' : 'bg-gray-50'
              }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${log.action === 'login' ? 'bg-blue-500' :
                  log.action === 'create' ? 'bg-green-500' :
                    log.action === 'update' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                <span className="text-sm text-gray-900">
                  {log.details || `${log.action} on ${log.target_table}`}
                </span>
              </div>
              <span className="text-xs text-gray-500">{formatTimeAgo(log.timestamp)}</span>
            </div>
          ))}
          {auditLogs.length === 0 && <p className="text-gray-500 text-center py-4">No recent activity</p>}
        </div>
      </Card>
    </div>
  );
};