import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, User, MessageSquare, Plus } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { apiFetch } from '../../utils/api';

interface WorkflowStep {
  id: string;
  step_order: number;
  assignee_name: string;
  assignee_id: string;
  action_type: 'review' | 'approve' | 'sign';
  status: 'pending' | 'completed' | 'rejected';
  completed_at?: string;
  comments?: string;
  digital_signature?: string;
}

interface DocumentWorkflow {
  id: string;
  document_name: string;
  document_type: string;
  workflow_type: 'approval' | 'review' | 'signature';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  workflow_steps: WorkflowStep[];
  created_at: string;
  completed_at?: string;
}

export const DocumentWorkflow: React.FC = () => {
  const [workflows, setWorkflows] = useState<DocumentWorkflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<DocumentWorkflow | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch workflows from API
  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/api/workflows');
      if (!response.ok) throw new Error('Failed to fetch workflows');
      const data = await response.json();
      console.log('📋 Fetched workflows:', data);
      setWorkflows(data.workflows || []);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkflow = async (workflowData: any) => {
    try {
      const response = await apiFetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflowData)
      });

      if (!response.ok) throw new Error('Failed to create workflow');

      await fetchWorkflows();
      setShowCreateModal(false);
      alert('Workflow created successfully!');
    } catch (error) {
      console.error('Error creating workflow:', error);
      alert('Failed to create workflow. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleStepAction = async (workflowId: string, stepId: string, action: 'approve' | 'reject', comments?: string) => {
    try {
      // Call API to update workflow step
      const response = await apiFetch(`/api/workflows/steps/${stepId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action === 'approve' ? 'completed' : 'rejected',
          comments
        })
      });

      if (!response.ok) throw new Error('Failed to update workflow step');

      // Refresh workflows
      await fetchWorkflows();
      setShowActionModal(false);
      setSelectedStep(null);
    } catch (error) {
      console.error('Error updating workflow step:', error);
      alert('Failed to update workflow step. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Workflows</h2>
          <p className="text-gray-600 mt-1">Track document approval and signature processes.</p>
        </div>
        <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
          Create Workflow
        </Button>
      </div>

      {loading ? (
        <Card>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading workflows...</p>
          </div>
        </Card>
      ) : workflows.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows found</h3>
            <p className="text-gray-600">Document workflows will appear here once created.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {workflows.map((workflow) => (
            <Card key={workflow.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <FileText className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{workflow.document_name}</h3>
                    <p className="text-sm text-gray-600">
                      {workflow.workflow_type.charAt(0).toUpperCase() + workflow.workflow_type.slice(1)} Workflow
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {new Date(workflow.created_at).toLocaleDateString()}
                      {workflow.completed_at && (
                        <> • Completed: {new Date(workflow.completed_at).toLocaleDateString()}</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(workflow.status)}`}>
                    {workflow.status.replace('_', ' ')}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedWorkflow(workflow)}
                  >
                    View Details
                  </Button>
                </div>
              </div>

              {/* Workflow Steps */}
              <div className="space-y-3">
                {workflow.workflow_steps?.map((step) => (
                  <div key={step.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {step.step_order}
                      </span>
                      {getStatusIcon(step.status)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{step.assignee_name}</span>
                        <span className="text-xs text-gray-500">({step.action_type})</span>
                      </div>
                      {step.comments && (
                        <div className="flex items-start space-x-2 mt-1">
                          <MessageSquare className="w-3 h-3 text-gray-400 mt-0.5" />
                          <p className="text-xs text-gray-600">{step.comments}</p>
                        </div>
                      )}
                      {step.completed_at && (
                        <p className="text-xs text-gray-500 mt-1">
                          Completed: {new Date(step.completed_at).toLocaleString()}
                        </p>
                      )}
                    </div>

                    {step.status === 'pending' && (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSelectedStep(step);
                            setShowActionModal(true);
                          }}
                        >
                          Take Action
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Workflow Details Modal */}
      <Modal
        isOpen={!!selectedWorkflow}
        onClose={() => setSelectedWorkflow(null)}
        title="Workflow Details"
        size="lg"
      >
        {selectedWorkflow && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{selectedWorkflow.document_name}</h3>
              <p className="text-sm text-gray-600">{selectedWorkflow.document_type.replace('_', ' ')}</p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Workflow Progress</h4>
              <div className="space-y-3">
                {selectedWorkflow.workflow_steps.map((step) => (
                  <div key={step.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {step.step_order}
                      </span>
                      {getStatusIcon(step.status)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{step.assignee_name}</p>
                      <p className="text-sm text-gray-600 capitalize">{step.action_type}</p>
                      {step.comments && (
                        <p className="text-sm text-gray-700 mt-1">{step.comments}</p>
                      )}
                      {step.digital_signature && (
                        <p className="text-xs text-green-600 mt-1">✓ Digitally signed via {step.digital_signature}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Action Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title="Take Action"
        size="md"
      >
        {selectedStep && (
          <WorkflowActionForm
            step={selectedStep}
            onSubmit={(action, comments) => {
              const workflow = workflows.find(w => w.workflow_steps.some(s => s.id === selectedStep.id));
              if (workflow) {
                handleStepAction(workflow.id, selectedStep.id, action, comments);
              }
            }}
            onCancel={() => setShowActionModal(false)}
          />
        )}
      </Modal>

      {/* Create Workflow Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Document Workflow"
        size="lg"
      >
        <CreateWorkflowForm
          onSubmit={handleCreateWorkflow}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
};

interface WorkflowActionFormProps {
  step: WorkflowStep;
  onSubmit: (action: 'approve' | 'reject', comments?: string) => void;
  onCancel: () => void;
}

const WorkflowActionForm: React.FC<WorkflowActionFormProps> = ({ step, onSubmit, onCancel }) => {
  const [comments, setComments] = useState('');
  const [action, setAction] = useState<'approve' | 'reject'>('approve');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(action, comments);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-2">
          Action required: <span className="font-medium capitalize">{step.action_type}</span>
        </p>
        <p className="text-sm text-gray-600">
          Assigned to: <span className="font-medium">{step.assignee_name}</span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Decision
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="approve"
              checked={action === 'approve'}
              onChange={(e) => setAction(e.target.value as 'approve')}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">
              {step.action_type === 'sign' ? 'Sign Document' : 'Approve'}
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="reject"
              checked={action === 'reject'}
              onChange={(e) => setAction(e.target.value as 'reject')}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Reject</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comments
        </label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Add your comments..."
        />
      </div>

      {step.action_type === 'sign' && action === 'approve' && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            🔐 This action will require BankID verification for digital signature.
          </p>
        </div>
      )}

      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant={action === 'reject' ? 'danger' : 'primary'}>
          {action === 'approve' && step.action_type === 'sign' ? 'Sign with BankID' :
            action === 'approve' ? 'Approve' : 'Reject'}
        </Button>
      </div>
    </form>
  );
};// Add this at the end of DocumentWorkflow.tsx file

interface CreateWorkflowFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const CreateWorkflowForm: React.FC<CreateWorkflowFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    document_name: '',
    document_type: 'board_resolution',
    workflow_type: 'approval' as 'approval' | 'review' | 'signature',
    steps: [
      { assignee_name: '', assignee_id: '', action_type: 'review' as 'review' | 'approve' | 'sign' }
    ]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.document_name.trim()) {
      alert('Please enter a document name');
      return;
    }

    if (formData.steps.some(step => !step.assignee_name.trim())) {
      alert('Please fill in all assignee names');
      return;
    }

    onSubmit(formData);
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { assignee_name: '', assignee_id: '', action_type: 'review' }]
    }));
  };

  const removeStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const updateStep = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      )
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Document Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Document Name *
        </label>
        <input
          type="text"
          value={formData.document_name}
          onChange={(e) => setFormData(prev => ({ ...prev, document_name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="e.g., Board Resolution - Q1 Budget Approval"
          required
        />
      </div>

      {/* Document Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Document Type *
        </label>
        <select
          value={formData.document_type}
          onChange={(e) => setFormData(prev => ({ ...prev, document_type: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="board_resolution">Board Resolution</option>
          <option value="financial_statement">Financial Statement</option>
          <option value="bylaws">Bylaws</option>
          <option value="articles_of_association">Articles of Association</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Workflow Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Workflow Type *
        </label>
        <select
          value={formData.workflow_type}
          onChange={(e) => setFormData(prev => ({ ...prev, workflow_type: e.target.value as any }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="approval">Approval Workflow</option>
          <option value="review">Review Workflow</option>
          <option value="signature">Signature Workflow</option>
        </select>
      </div>

      {/* Workflow Steps */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Workflow Steps *
          </label>
          <button
            type="button"
            onClick={addStep}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            + Add Step
          </button>
        </div>

        <div className="space-y-3">
          {formData.steps.map((step, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Step {index + 1}</span>
                {formData.steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Assignee Name</label>
                  <input
                    type="text"
                    value={step.assignee_name}
                    onChange={(e) => updateStep(index, 'assignee_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., John Secretary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Action Type</label>
                  <select
                    value={step.action_type}
                    onChange={(e) => updateStep(index, 'action_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="review">Review</option>
                    <option value="approve">Approve</option>
                    <option value="sign">Sign</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Create Workflow
        </button>
      </div>
    </form>
  );
};
