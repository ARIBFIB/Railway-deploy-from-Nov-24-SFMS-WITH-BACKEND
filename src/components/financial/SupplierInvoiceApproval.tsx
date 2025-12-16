import React, { useState, useRef, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Clock, AlertTriangle, FileText, Filter, Search, Plus, Loader2 } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { Modal } from '../Modal';
import AddSupplierVoice from './AddSupplierVoice';
import { SupplierInvoiceService, type SupplierInvoice } from '../../services/supplierInvoiceService';

export const SupplierInvoiceApproval: React.FC = () => {
  const [supplierInvoices, setSupplierInvoices] = useState<SupplierInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<SupplierInvoice | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [showAddSupplierVoice, setShowAddSupplierVoice] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const invoices = await SupplierInvoiceService.getSupplierInvoices(statusFilter);
      setSupplierInvoices(invoices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  // Handle clicks outside the filter menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setIsFilterMenuOpen(false); // Close menu after selection
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const filteredInvoices = supplierInvoices.filter(invoice => {
    const matchesSearch = invoice.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.supplier_invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'under_review':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-purple-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleApprovalAction = async (invoiceId: string, stepId: string, action: 'approve' | 'reject', comments?: string) => {
    try {
      if (action === 'approve') {
        await SupplierInvoiceService.approveInvoice(invoiceId);
      } else {
        await SupplierInvoiceService.rejectInvoice(invoiceId, comments);
      }
      // Refresh list
      fetchInvoices();
      setShowApprovalModal(false);
    } catch (err) {
      console.error('Failed to update invoice status:', err);
      // Ideally show toast
      setError('Failed to update invoice status. Please try again.');
    }
  };

  const pendingApprovals = filteredInvoices.filter(inv => inv.status === 'under_review').length;
  const totalPendingAmount = filteredInvoices
    .filter(inv => inv.status === 'under_review' || inv.status === 'approved')
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  // Show Add Supplier Voice screen if requested
  if (showAddSupplierVoice) {
    return <AddSupplierVoice onBack={() => { setShowAddSupplierVoice(false); fetchInvoices(); }} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Supplier Invoice Approval</h2>
          <p className="text-gray-600 mt-1">Review and approve supplier invoices with workflow management.</p>
        </div>
        <Button icon={Plus} onClick={() => setShowAddSupplierVoice(true)}>
          Add Supplier Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">{pendingApprovals}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalPendingAmount.toLocaleString('sv-SE')} SEK
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredInvoices.filter(inv => inv.status === 'approved').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredInvoices.filter(inv => inv.status === 'rejected').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <form className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search supplier invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          <div className="relative" ref={filterMenuRef}>
            <button
              onClick={toggleFilterMenu}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter</span>
            </button>
            {isFilterMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {[
                    { value: 'all', label: 'All Status' },
                    { value: 'received', label: 'Received' },
                    { value: 'under_review', label: 'Under Review' },
                    { value: 'approved', label: 'Approved' },
                    { value: 'rejected', label: 'Rejected' },
                    { value: 'paid', label: 'Paid' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusFilterChange(option.value)}
                      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${statusFilter === option.value ? 'bg-gray-100 font-medium' : ''
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Supplier Invoices List */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            {error}
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
            No invoices found matching your criteria.
          </div>
        ) : (
          filteredInvoices.map((invoice) => (
            <Card key={invoice.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {getStatusIcon(invoice.status)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{invoice.invoice_number}</h3>
                      <span className="text-sm text-gray-500">({invoice.supplier_invoice_number})</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{invoice.supplier_name}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Invoice Date:</span>
                        <br />
                        {new Date(invoice.invoice_date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span>
                        <br />
                        {new Date(invoice.due_date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span>
                        <br />
                        <span className="text-lg font-semibold text-gray-900">
                          {invoice.total_amount.toLocaleString('sv-SE')} {invoice.currency}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Received By:</span>
                        <br />
                        {invoice.received_by}
                      </div>
                    </div>

                    {/* Approval Workflow Progress (Simplified) */}
                    {invoice.approval_workflow && invoice.approval_workflow.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Approval Progress</h4>
                        <div className="flex items-center space-x-4">
                          {invoice.approval_workflow.map((step, index) => (
                            <div key={step.id} className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${step.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  step.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  {step.step_order}
                                </div>
                                <span className="text-xs text-gray-600">{step.approver_name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {invoice.notes && (
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        <span className="font-medium">Notes:</span> {invoice.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status.replace('_', ' ')}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      View
                    </Button>
                    {(invoice.status === 'under_review' || invoice.status === 'received') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setShowApprovalModal(true);
                        }}
                      >
                        Review
                      </Button>
                    )}
                    {invoice.document_path && (
                      <Button variant="ghost" size="sm" icon={FileText}>
                        PDF
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )))}
      </div>


      {/* Invoice Details Modal */}
      <Modal
        isOpen={!!selectedInvoice && !showApprovalModal}
        onClose={() => setSelectedInvoice(null)}
        title="Supplier Invoice Details"
        size="lg"
      >
        {selectedInvoice && <SupplierInvoiceDetails invoice={selectedInvoice} />}
      </Modal>

      {/* Approval Modal */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title="Review Invoice"
        size="md"
      >
        {selectedInvoice && (
          <ApprovalForm
            invoice={selectedInvoice}
            onApprove={(stepId, comments) => handleApprovalAction(selectedInvoice.id, stepId, 'approve', comments)}
            onReject={(stepId, comments) => handleApprovalAction(selectedInvoice.id, stepId, 'reject', comments)}
            onCancel={() => setShowApprovalModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};


const SupplierInvoiceDetails: React.FC<{ invoice: SupplierInvoice }> = ({ invoice }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{invoice.invoice_number}</h3>
          <p className="text-sm text-gray-600">{invoice.supplier_name}</p>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${invoice.status === 'approved' ? 'bg-green-100 text-green-800' :
          invoice.status === 'rejected' ? 'bg-red-100 text-red-800' :
            invoice.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
          }`}>
          {invoice.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Invoice Information</h4>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Supplier Invoice #:</dt>
              <dd className="text-gray-900">{invoice.supplier_invoice_number}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Invoice Date:</dt>
              <dd className="text-gray-900">{new Date(invoice.invoice_date).toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Due Date:</dt>
              <dd className="text-gray-900">{new Date(invoice.due_date).toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Received By:</dt>
              <dd className="text-gray-900">{invoice.received_by}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Amount</h4>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between font-semibold">
              <dt className="text-gray-900">Total Amount:</dt>
              <dd className="text-gray-900">{invoice.total_amount.toLocaleString('sv-SE')} {invoice.currency}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">Line Items</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Unit Price
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.line_items.map((line) => (
                <tr key={line.id}>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {line.description}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {line.quantity}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {line.unit_price.toLocaleString('sv-SE')}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {line.line_total?.toLocaleString('sv-SE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ApprovalForm: React.FC<{
  invoice: SupplierInvoice;
  onApprove: (stepId: string, comments?: string) => void;
  onReject: (stepId: string, comments?: string) => void;
  onCancel: () => void;
}> = ({ invoice, onApprove, onReject, onCancel }) => {
  const [comments, setComments] = useState('');
  const [action, setAction] = useState<'approve' | 'reject'>('approve');

  // Use the synthetic workflow step or default to generic step ID
  const currentStep = (invoice.approval_workflow && invoice.approval_workflow.length > 0)
    ? invoice.approval_workflow[0]
    : { id: 'generic_step' };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action === 'approve') {
      onApprove(currentStep.id, comments);
    } else {
      onReject(currentStep.id, comments);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{invoice.invoice_number}</h3>
        <p className="text-sm text-gray-600">{invoice.supplier_name}</p>
        <p className="text-lg font-semibold text-gray-900 mt-2">
          {invoice.total_amount.toLocaleString('sv-SE')} {invoice.currency}
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
            <span className="text-sm text-gray-700">Approve Invoice</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="reject"
              checked={action === 'reject'}
              onChange={(e) => setAction(e.target.value as 'reject')}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Reject Invoice</span>
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
          placeholder="Add your approval/rejection comments..."
        />
      </div>

      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant={action === 'reject' ? 'danger' : 'primary'}>
          {action === 'approve' ? 'Approve' : 'Reject'} Invoice
        </Button>
      </div>
    </form>
  );
};