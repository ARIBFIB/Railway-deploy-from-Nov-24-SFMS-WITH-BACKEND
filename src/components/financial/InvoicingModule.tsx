import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Send, Eye, Edit, Download, CheckCircle, Clock, AlertCircle, Filter, Loader2, RefreshCw } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { Modal } from '../Modal';
import { ListManager } from '../ListManager';
import { InvoiceService, type Invoice, type CreateInvoiceData } from '../../services/invoiceService';

export const InvoicingModule: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const { invoices: data } = await InvoiceService.getInvoices({
        status: statusFilter,
        invoice_type: typeFilter
      });
      setInvoices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter, typeFilter]);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer_supplier_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'sent':
        return <Send className="w-5 h-5 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const totalOutstanding = filteredInvoices
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  const totalPaid = filteredInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  const handleTypeFilterChange = (type: string) => {
    setTypeFilter(type);
    setIsFilterMenuOpen(false);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setIsFilterMenuOpen(false);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const handleCreateSuccess = () => {
    fetchInvoices();
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Invoicing</h2>
          <p className="text-gray-600 mt-1">Create and manage sales and purchase invoices.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={fetchInvoices} icon={RefreshCw} title="Refresh List" />
          <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalOutstanding.toLocaleString('sv-SE')} SEK
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
              <p className="text-sm font-medium text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalPaid.toLocaleString('sv-SE')} SEK
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredInvoices.filter(inv => inv.status === 'overdue').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredInvoices.filter(inv => inv.status === 'draft').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="relative" ref={filterMenuRef}>
            <button
              onClick={toggleFilterMenu}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 focus:outline-none px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>
            {isFilterMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-2">
                  <div className="px-4 py-2 text-sm font-semibold text-gray-900 border-b border-gray-200">
                    Invoice Type
                  </div>
                  {[
                    { value: 'all', label: 'All Types' },
                    { value: 'sales', label: 'Sales Invoices' },
                    { value: 'purchase', label: 'Purchase Invoices' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleTypeFilterChange(option.value)}
                      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${typeFilter === option.value ? 'bg-gray-100 font-medium' : ''
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                  <div className="px-4 py-2 text-sm font-semibold text-gray-900 border-b border-gray-200 mt-2">
                    Status
                  </div>
                  {[
                    { value: 'all', label: 'All Status' },
                    { value: 'draft', label: 'Draft' },
                    { value: 'sent', label: 'Sent' },
                    { value: 'paid', label: 'Paid' },
                    { value: 'overdue', label: 'Overdue' },
                    { value: 'cancelled', label: 'Cancelled' },
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

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
              No invoices found matching your criteria.
            </div>
          ) : (filteredInvoices.map((invoice) => (
            <Card key={invoice.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {getStatusIcon(invoice.status)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{invoice.invoice_number}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${invoice.invoice_type.toLowerCase() === 'sales' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                        {invoice.invoice_type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{invoice.customer_supplier_name}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
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
                        <span className="font-medium">Payment Terms:</span>
                        <br />
                        {invoice.payment_terms}
                      </div>
                      <div>
                        <span className="font-medium">Total Amount:</span>
                        <br />
                        <span className="text-lg font-semibold text-gray-900">
                          {invoice.total_amount.toLocaleString('sv-SE')} {invoice.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
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
                    {/*
                    // TODO: Implement Edit
                    <Button variant="ghost" size="sm" icon={Edit}>
                        Edit
                    </Button>
                  */}
                    <Button variant="ghost" size="sm" icon={Download}>
                      PDF
                    </Button>
                    {invoice.status === 'draft' && (
                      <Button variant="ghost" size="sm" icon={Send}>
                        Send
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )))}
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Invoice"
        size="lg"
      >
        <InvoiceForm onSuccess={handleCreateSuccess} onClose={() => setShowCreateModal(false)} />
      </Modal>

      <Modal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title="Invoice Details"
        size="lg"
      >
        {selectedInvoice && <InvoiceDetails invoice={selectedInvoice} />}
      </Modal>
    </div>
  );
};

const InvoiceForm: React.FC<{ onSuccess: () => void; onClose: () => void }> = ({ onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    invoice_type: 'Sales',
    customer_supplier_name: '',
    // TODO: Add customer_id selection logic (e.g., search/dropdown)
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
    payment_terms: 'Net 30',
    line_items: [
      { description: '', quantity: 1, unit_price: 0, tax_rate: 25 }
    ]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await InvoiceService.createInvoice({
        invoice_type: formData.invoice_type,
        customer_supplier_name: formData.customer_supplier_name,
        invoice_date: formData.invoice_date,
        due_date: formData.due_date,
        payment_terms: formData.payment_terms,
        items: formData.line_items.map(l => ({ ...l, tax_rate: l.tax_rate }))
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      line_items: [...prev.line_items, { description: '', quantity: 1, unit_price: 0, tax_rate: 25 }]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Type *</label>
          <select
            value={formData.invoice_type}
            onChange={(e) => setFormData(prev => ({ ...prev, invoice_type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="Sales">Sales</option>
            <option value="Purchase">Purchase</option>
          </select>
        </div>
        <Input
          label={formData.invoice_type.toLowerCase().includes('purchase') ? 'Supplier Name' : 'Customer Name'}
          value={formData.customer_supplier_name}
          onChange={(e) => setFormData(prev => ({ ...prev, customer_supplier_name: e.target.value }))}
          placeholder="Enter name"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Invoice Date"
          type="date"
          value={formData.invoice_date}
          onChange={(e) => {
            const date = e.target.value;
            // Calculate default due date (30 days)
            const dueDate = new Date(new Date(date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            setFormData(prev => ({ ...prev, invoice_date: date, due_date: dueDate }));
          }}
          required
        />
        <Input
          label="Due Date"
          type="date"
          value={formData.due_date}
          onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
          required
        />
        <Input
          label="Payment Terms"
          value={formData.payment_terms}
          onChange={(e) => setFormData(prev => ({ ...prev, payment_terms: e.target.value }))}
          placeholder="e.g., Net 30"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Line Items
          </label>
          <Button type="button" size="sm" onClick={addLineItem}>
            Add Line
          </Button>
        </div>

        <div className="space-y-3">
          {formData.line_items.map((line, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 p-3 border rounded-lg">
              <input
                placeholder="Description"
                className="col-span-12 md:col-span-5 px-3 py-2 border rounded-lg text-sm"
                value={line.description}
                onChange={(e) => {
                  const newLines = [...formData.line_items];
                  newLines[index].description = e.target.value;
                  setFormData(prev => ({ ...prev, line_items: newLines }));
                }}
              />
              <input
                type="number"
                placeholder="Qty"
                className="col-span-3 md:col-span-2 px-3 py-2 border rounded-lg text-sm"
                value={line.quantity}
                onChange={(e) => {
                  const newLines = [...formData.line_items];
                  newLines[index].quantity = parseInt(e.target.value) || 1;
                  setFormData(prev => ({ ...prev, line_items: newLines }));
                }}
              />
              <input
                type="number"
                placeholder="Price"
                className="col-span-4 md:col-span-2 px-3 py-2 border rounded-lg text-sm"
                value={line.unit_price}
                onChange={(e) => {
                  const newLines = [...formData.line_items];
                  newLines[index].unit_price = parseFloat(e.target.value) || 0;
                  setFormData(prev => ({ ...prev, line_items: newLines }));
                }}
              />
              <input
                type="number"
                placeholder="VAT %"
                className="col-span-3 md:col-span-2 px-3 py-2 border rounded-lg text-sm"
                value={line.tax_rate}
                onChange={(e) => {
                  const newLines = [...formData.line_items];
                  newLines[index].tax_rate = parseFloat(e.target.value) || 0;
                  setFormData(prev => ({ ...prev, line_items: newLines }));
                }}
              />
              <div className="col-span-2 md:col-span-1 flex items-center justify-center">
                {/* Trash icon can go here */}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
};

const InvoiceDetails: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{invoice.invoice_number}</h3>
          <p className="text-sm text-gray-600">{invoice.customer_supplier_name}</p>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
          invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
            invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
          }`}>
          {invoice.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Invoice Information</h4>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Invoice Date:</dt>
              <dd className="text-gray-900">{new Date(invoice.invoice_date).toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Due Date:</dt>
              <dd className="text-gray-900">{new Date(invoice.due_date).toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Payment Terms:</dt>
              <dd className="text-gray-900">{invoice.payment_terms}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Amount Summary</h4>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Subtotal:</dt>
              <dd className="text-gray-900">{invoice.subtotal.toLocaleString('sv-SE')} {invoice.currency}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Tax:</dt>
              <dd className="text-gray-900">{invoice.tax_amount.toLocaleString('sv-SE')} {invoice.currency}</dd>
            </div>
            <div className="flex justify-between font-semibold">
              <dt className="text-gray-900">Total:</dt>
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