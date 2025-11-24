import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronDown, ChevronRight, Plus, Trash2, Edit, Copy, FileText, CreditCard, MessageSquare, ArrowLeft, Menu, Eye, Search, Mail, Printer, MoreHorizontal } from 'lucide-react';


interface AddSupplierVoiceProps {
  onBack: () => void;
}

export default function AddSupplierVoice({ onBack }: AddSupplierVoiceProps) {
  const [additionalInfoExpanded, setAdditionalInfoExpanded] = useState(false);
  const [previousInvoiceExpanded, setPreviousInvoiceExpanded] = useState(false);
  const [accountRegistration, setAccountRegistration] = useState(true);
  const [activeTab, setActiveTab] = useState('supplier-invoices');
  const [paymentData, setPaymentData] = useState({
    paymentDate: '2025-09-16',
    invoice: '',
    paidSek: ''
  });
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  const [interpretationFiles, setInterpretationFiles] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [interpretationFilter, setInterpretationFilter] = useState('not-sent');
  const [incomingInvoices, setIncomingInvoices] = useState<any[]>([]);
  const [selectedInvoices, setSelectedInvoices] = useState<number[]>([]);
  const [incomingFilter, setIncomingFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    invoiceDate: '2025-09-15',
    dueDate: '2025-09-15',
    total: '0,00',
    vat: '0,00',
    invoiceFee: '0,00',
    shipping: '0,00',
    earSmoothing: '0,00'
  });

  const handleDateChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleNumericChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handlePaymentChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleAddPayment = () => {
    if (paymentData.invoice && paymentData.paidSek) {
      const newPayment = {
        id: payments.length + 1,
        paymentDate: paymentData.paymentDate,
        invoice: paymentData.invoice,
        paidSek: parseFloat(paymentData.paidSek),
        selected: false
      };
      setPayments([...payments, newPayment]);
      setPaymentData({ paymentDate: '2025-09-16', invoice: '', paidSek: '' });
    }
  };

  const handleClearPayments = () => {
    setPaymentData({ paymentDate: '2025-09-16', invoice: '', paidSek: '' });
  };

  const handleDeselectAll = () => {
    setSelectedPayments([]);
    setPayments(payments.map(p => ({ ...p, selected: false })));
  };

  const totalSek = payments.reduce((sum, payment) => sum + payment.paidSek, 0);

  const handleAddFile = () => {
    console.log('Add file clicked');
  };

  const handlePrintList = () => {
    console.log('Print list clicked');
  };

  const handleDeleteFiles = () => {
    const updatedFiles = interpretationFiles.filter(file => !selectedFiles.includes(file.id));
    setInterpretationFiles(updatedFiles);
    setSelectedFiles([]);
  };

  const handleSendFiles = () => {
    console.log('Send files clicked');
  };

  const handleFileSelection = (fileId: number, selected: boolean) => {
    if (selected) {
      setSelectedFiles([...selectedFiles, fileId]);
    } else {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    }
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === interpretationFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(interpretationFiles.map(file => file.id));
    }
  };

  const handleAdvancedSearch = () => {
    console.log('Advanced search clicked');
  };

  const handlePrintIncomingList = () => {
    console.log('Print incoming list clicked');
  };

  const handleDeleteInvoices = () => {
    const updatedInvoices = incomingInvoices.filter(invoice => !selectedInvoices.includes(invoice.id));
    setIncomingInvoices(updatedInvoices);
    setSelectedInvoices([]);
  };

  const handleCreateInvoices = () => {
    console.log('Create invoices clicked');
  };

  const handleInvoiceSelection = (invoiceId: number, selected: boolean) => {
    if (selected) {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    } else {
      setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceId));
    }
  };

  const handleSelectAllInvoices = () => {
    if (selectedInvoices.length === incomingInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(incomingInvoices.map(invoice => invoice.id));
    }
  };

  // Handle clicks outside the dropdown to close it

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Supplier Invoice</h1>
          <p className="text-gray-600 mt-1">Create and manage supplier invoice entries with comprehensive form controls.</p>
        </div>
        <Button variant="secondary" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
      </div>

      
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button 
            onClick={() => setActiveTab('supplier-invoices')}
            className={`border-b-2 py-2 px-1 text-sm font-medium ${
              activeTab === 'supplier-invoices' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Supplier invoices
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`border-b-2 py-2 px-1 text-sm font-medium ${
              activeTab === 'payments' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payments
          </button>
          <button 
            onClick={() => setActiveTab('incoming-invoices')}
            className={`border-b-2 py-2 px-1 text-sm font-medium ${
              activeTab === 'incoming-invoices' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Incoming invoices
          </button>
          <button 
            onClick={() => setActiveTab('send-for-interpretation')}
            className={`border-b-2 py-2 px-1 text-sm font-medium ${
              activeTab === 'send-for-interpretation' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Send for interpretation
          </button>
        </nav>
      </div>

      {/* Conditional Content Based on Active Tab */}
      {activeTab === 'payments' ? (
        <div className="space-y-6">
          {/* Payments Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Payments</h2>
              <p className="text-gray-600 mt-1">Manage payment entries and process financial transactions.</p>
            </div>
          </div>

          {/* Payment Entry Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Entry</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <Label htmlFor="payment-date" className="text-sm font-medium text-gray-700">Payment date</Label>
                <div className="relative">
                  <Input 
                    id="payment-date"
                    type="date"
                    value={paymentData.paymentDate}
                    onChange={(e) => handlePaymentChange('paymentDate', e)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="invoice" className="text-sm font-medium text-gray-700">Invoice</Label>
                <Input 
                  id="invoice"
                  placeholder="Serial number, Delivery number, Name, C"
                  value={paymentData.invoice}
                  onChange={(e) => handlePaymentChange('invoice', e)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="paid-sek" className="text-sm font-medium text-gray-700">Paid SEK</Label>
                <Input 
                  id="paid-sek"
                  value={paymentData.paidSek}
                  onChange={(e) => handlePaymentChange('paidSek', e)}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddPayment}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={handleClearPayments}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Clear
                </Button>
                <Button 
                  variant="secondary"
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Search in fact list
                </Button>
              </div>
            </div>
          </div>

          {/* Payments List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment List</h3>
            {payments.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm">No payments added yet. Add a payment using the form above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-4">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        checked={payment.selected}
                        onChange={(e) => {
                          const updatedPayments = payments.map(p => 
                            p.id === payment.id ? { ...p, selected: e.target.checked } : p
                          );
                          setPayments(updatedPayments);
                        }}
                      />
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">{payment.paymentDate}</span>
                          <span className="text-sm font-medium text-gray-900 ml-2">{payment.invoice}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold text-gray-900">{payment.paidSek.toFixed(2)} SEK</span>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary and Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Button 
                  variant="secondary"
                  onClick={handleDeselectAll}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Deselect all ({selectedPayments.length})
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">Total SEK: {totalSek.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Select defaultValue="1930">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Bank transfer (1930)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1930">Bank transfer (1930)</SelectItem>
                    <SelectItem value="1940">Cash (1940)</SelectItem>
                    <SelectItem value="1950">Check (1950)</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Book
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'send-for-interpretation' ? (
        <div className="space-y-6">
          {/* Send for Interpretation Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">SEND FOR INTERPRETATION</h2>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Source, Filename"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={handleAddFile}
                  className="bg-yellow-400 text-gray-800 hover:bg-yellow-500 border-yellow-400"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add file
                </Button>
                <Button 
                  variant="secondary"
                  onClick={handlePrintList}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print list
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setInterpretationFilter('all')}
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    interpretationFilter === 'all' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setInterpretationFilter('not-sent')}
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    interpretationFilter === 'not-sent' 
                      ? 'bg-green-100 text-green-800' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Not sent
                </button>
                <button
                  onClick={() => setInterpretationFilter('awaiting')}
                  className={`px-3 py-1 text-sm font-medium rounded flex items-center space-x-2 ${
                    interpretationFilter === 'awaiting' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="w-1 h-4 bg-purple-500"></div>
                  <span>Awaiting interpretation</span>
                </button>
                <button
                  onClick={() => setInterpretationFilter('could-not-send')}
                  className={`px-3 py-1 text-sm font-medium rounded flex items-center space-x-2 ${
                    interpretationFilter === 'could-not-send' 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="w-1 h-4 bg-orange-500"></div>
                  <span>Could not be sent.</span>
                </button>
                <button
                  onClick={() => setInterpretationFilter('invalid')}
                  className={`px-3 py-1 text-sm font-medium rounded flex items-center space-x-2 ${
                    interpretationFilter === 'invalid' 
                      ? 'bg-red-100 text-red-800' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="w-1 h-4 bg-red-500"></div>
                  <span>Invalid files</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <MoreHorizontal className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">{interpretationFiles.length}</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>

          {/* Files Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        checked={selectedFiles.length === interpretationFiles.length && interpretationFiles.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SOURCE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      FILE NAME
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SENT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      UPLOADED
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {interpretationFiles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm">No files added yet. Add files using the "Add file" button above.</p>
                      </td>
                    </tr>
                  ) : (
                    interpretationFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            checked={selectedFiles.includes(file.id)}
                            onChange={(e) => handleFileSelection(file.id, e.target.checked)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {file.source}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {file.fileName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {file.sent || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {file.uploaded || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="secondary"
                  onClick={handleDeleteFiles}
                  disabled={selectedFiles.length === 0}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  Delete
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">*See price list</span>
                <Button 
                  onClick={handleSendFiles}
                  disabled={selectedFiles.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'incoming-invoices' ? (
        <div className="space-y-6">
          {/* Incoming Invoices Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">INCOMING INVOICES</h2>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Name, Reference, OCR/Fact No."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <button 
                onClick={handleAdvancedSearch}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Advanced search
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIncomingFilter('all')}
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    incomingFilter === 'all' 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setIncomingFilter('failed-interpretation')}
                  className={`px-3 py-1 text-sm font-medium rounded flex items-center space-x-2 ${
                    incomingFilter === 'failed-interpretation' 
                      ? 'bg-red-100 text-red-800' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="w-1 h-4 bg-red-500"></div>
                  <span>Failed interpretation</span>
                </button>
                <button
                  onClick={() => setIncomingFilter('requires-editing')}
                  className={`px-3 py-1 text-sm font-medium rounded flex items-center space-x-2 ${
                    incomingFilter === 'requires-editing' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="w-1 h-4 bg-yellow-500"></div>
                  <span>Requires editing</span>
                </button>
                <button
                  onClick={() => setIncomingFilter('ready-to-create')}
                  className={`px-3 py-1 text-sm font-medium rounded flex items-center space-x-2 ${
                    incomingFilter === 'ready-to-create' 
                      ? 'bg-green-100 text-green-800' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="w-1 h-4 bg-green-500"></div>
                  <span>Ready to be created</span>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="secondary"
                  onClick={handlePrintIncomingList}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print list
                </Button>
                <div className="flex items-center space-x-2">
                  <MoreHorizontal className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{selectedInvoices.length}</span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        checked={selectedInvoices.length === incomingInvoices.length && incomingInvoices.length > 0}
                        onChange={handleSelectAllInvoices}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TYPE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SUPPLIER NAME
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      REFERENCE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      FACT NO.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      INVOICE DATE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DUE DATE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TOTAL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      VAT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ASK VAT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CURRENCY
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACCOUNTING PROPOSAL
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {incomingInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="px-6 py-12 text-center text-gray-500">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm">No incoming invoices found. Upload files to get started.</p>
                      </td>
                    </tr>
                  ) : (
                    incomingInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            checked={selectedInvoices.includes(invoice.id)}
                            onChange={(e) => handleInvoiceSelection(invoice.id, e.target.checked)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.type || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.supplierName || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.reference || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.factNo || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.invoiceDate || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.dueDate || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.total || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.vat || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.askVat || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.currency || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.accountingProposal || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="secondary"
                  onClick={handleDeleteInvoices}
                  disabled={selectedInvoices.length === 0}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  Delete ({selectedInvoices.length})
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={handleCreateInvoices}
                  disabled={selectedInvoices.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                >
                  Create Invoices
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status Bar - Only for Supplier Invoice Section */}
          <div className="bg-white p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="text-sm font-semibold text-gray-700">
                  SUPPLIER INVOICE 1*
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  VERSION NO.: D1*
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="secondary" 
                  className="bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                  onClick={() => console.log('Create supplier invoice clicked')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create supplier invoice
                </Button>
                <Button 
                  className="bg-yellow-400 text-gray-800 hover:bg-yellow-500 border-yellow-400"
                  onClick={() => console.log('Show list clicked')}
                >
                  <Menu className="w-4 h-4 mr-2" />
                  Show list
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <button className="flex items-center gap-2 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-50">
            <FileText className="w-4 h-4" />
            Create credit note
          </button>
          <button className="flex items-center gap-2 hover:text-gray-800 opacity-40 px-3 py-2 rounded-lg hover:bg-gray-50">
            <Copy className="w-4 h-4" />
            Copy
          </button>
          <button className="flex items-center gap-2 hover:text-gray-800 opacity-40 px-3 py-2 rounded-lg hover:bg-gray-50">
            <CreditCard className="w-4 h-4" />
            Payments
          </button>
          <button className="flex items-center gap-2 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-50">
            <FileText className="w-4 h-4" />
            Disable payment file
          </button>
          <button className="flex items-center gap-2 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-50">
            <Edit className="w-4 h-4" />
            Credit information
          </button>
          <button className="flex items-center gap-2 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-50">
            <MessageSquare className="w-4 h-4" />
            Comment
          </button>
            </div>
          </div>

      {/* Main Form */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Information</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="supplier" className="text-sm font-medium text-gray-700">Supplier</Label>
              <Input 
                id="supplier"
                placeholder="Supplier No., Corporate/Personal No., Name, Bg/Pg"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="ocr" className="text-sm font-medium text-gray-700">OCR</Label>
              <Input id="ocr" className="mt-1" />
            </div>
          </div>

          {/* Middle Column */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoice-date" className="text-sm font-medium text-gray-700">Invoice date</Label>
                <div className="relative">
                  <Input 
                    id="invoice-date"
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => handleDateChange('invoiceDate', e)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="due-date" className="text-sm font-medium text-gray-700">Due date</Label>
                <div className="relative">
                  <Input 
                    id="due-date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleDateChange('dueDate', e)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="invoice-number" className="text-sm font-medium text-gray-700">Invoice number</Label>
              <Input id="invoice-number" className="mt-1" />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="total" className="text-sm font-medium text-gray-700">Total</Label>
                <Input 
                  id="total"
                  value={formData.total}
                  onChange={(e) => handleNumericChange('total', e)}
                  className="mt-1 text-right"
                />
              </div>
              <div>
                <Label htmlFor="vat" className="text-sm font-medium text-gray-700">VAT</Label>
                <Input 
                  id="vat"
                  value={formData.vat}
                  onChange={(e) => handleNumericChange('vat', e)}
                  className="mt-1 text-right"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="currency" className="text-sm font-medium text-gray-700">Currency</Label>
                <Select defaultValue="SEK">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEK">SEK</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="course" className="text-sm font-medium text-gray-700">Course</Label>
                <Input 
                  id="course"
                  value="1"
                  className="mt-1 text-gray-500 bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="unit" className="text-sm font-medium text-gray-700">Unit</Label>
                <Input 
                  id="unit"
                  value="1"
                  className="mt-1 text-right text-gray-500 bg-gray-100"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="mb-6">
        <div className="space-y-4">
          <button
            onClick={() => setAdditionalInfoExpanded(!additionalInfoExpanded)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50"
          >
            {additionalInfoExpanded ? (
              <ChevronDown className="w-4 h-4 text-blue-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-blue-600" />
            )}
            <span className="font-medium">Additional information</span>
          </button>

          <button
            onClick={() => setPreviousInvoiceExpanded(!previousInvoiceExpanded)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50"
          >
            {previousInvoiceExpanded ? (
              <ChevronDown className="w-4 h-4 text-blue-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-blue-600" />
            )}
            <span className="font-medium">Posting from previous invoice</span>
          </button>
        </div>
      </div>

      {/* Registration Toggle */}
      <div className="mb-6">
        <div className="flex border rounded-lg overflow-hidden w-fit">
          <button
            onClick={() => setAccountRegistration(true)}
            className={`px-4 py-2 text-sm font-medium ${
              accountRegistration 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Account registration
          </button>
          <button
            onClick={() => setAccountRegistration(false)}
            className={`px-4 py-2 text-sm font-medium ${
              !accountRegistration 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Item registration
          </button>
        </div>
      </div>

      {/* Account Registration Table */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Registration</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account name
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction info
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Debit
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="bg-gray-50">
                <td className="px-3 py-2 text-sm text-gray-900">2440</td>
                <td className="px-3 py-2 text-sm text-gray-900">Accounts payable</td>
                <td className="px-3 py-2">
                  <Input className="text-sm" />
                </td>
                <td className="px-3 py-2">
                  <Input className="text-sm text-right" />
                </td>
                <td className="px-3 py-2">
                  <Input className="text-sm text-right" />
                </td>
                <td className="px-3 py-2 text-center">
                  <FileText className="w-4 h-4 text-gray-600 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2">
                  <Input className="text-sm" />
                </td>
                <td className="px-3 py-2">
                  <Input className="text-sm" />
                </td>
                <td className="px-3 py-2">
                  <Input className="text-sm" />
                </td>
                <td className="px-3 py-2">
                  <Input className="text-sm text-right" />
                </td>
                <td className="px-3 py-2">
                  <Input className="text-sm text-right" />
                </td>
                <td className="px-3 py-2 text-center">
                  <div className="flex justify-center gap-1">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <Trash2 className="w-4 h-4 text-gray-600" />
                    <Plus className="w-4 h-4 text-gray-600" />
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={3} className="px-3 py-2 text-right text-sm font-medium text-gray-700">
                  Amount
                </td>
                <td className="px-3 py-2 text-right text-sm font-medium text-gray-700">0.00</td>
                <td className="px-3 py-2 text-right text-sm font-medium text-gray-700">0.00</td>
                <td className="px-3 py-2"></td>
              </tr>
              <tr>
                <td colSpan={3} className="px-3 py-2 text-right text-sm font-medium text-gray-700">
                  Difference
                </td>
                <td className="px-3 py-2 text-right text-sm font-medium text-gray-700">0.00</td>
                <td className="px-3 py-2 text-right text-sm font-medium text-gray-700">0.00</td>
                <td className="px-3 py-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Additional Fees */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Fees</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="invoice-fee" className="text-sm font-medium text-gray-700">Invoice fee</Label>
            <Input 
              id="invoice-fee"
              value={formData.invoiceFee}
              onChange={(e) => handleNumericChange('invoiceFee', e)}
              className="mt-1 text-right"
            />
          </div>
          <div>
            <Label htmlFor="shipping" className="text-sm font-medium text-gray-700">Shipping</Label>
            <Input 
              id="shipping"
              value={formData.shipping}
              onChange={(e) => handleNumericChange('shipping', e)}
              className="mt-1 text-right"
            />
          </div>
          <div>
            <Label htmlFor="ear-smoothing" className="text-sm font-medium text-gray-700">Ear smoothing</Label>
            <Input 
              id="ear-smoothing"
              value={formData.earSmoothing}
              onChange={(e) => handleNumericChange('earSmoothing', e)}
              className="mt-1 text-right"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onBack}>
            Cancel
          </Button>
          <Button variant="secondary" disabled>
            Create credit note
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onBack}>
            Cancel
          </Button>
          <Button>
            Save
          </Button>
          <Button>
            Book
          </Button>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
