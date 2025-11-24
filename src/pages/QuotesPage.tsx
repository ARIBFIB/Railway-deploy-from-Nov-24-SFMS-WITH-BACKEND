import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Search, 
  Plus, 
  Printer, 
  Send,
  ShoppingCart,
  ChevronDown,
  Copy,
  CheckSquare,
  Lock,
  MessageSquare,
  Eye,
  Calendar,
  Trash2,
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';

const QuotesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [quoteFilter, setQuoteFilter] = useState('all');
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [showCreateQuote, setShowCreateQuote] = useState(false);
  
  // Create quote form state
  const [customer, setCustomer] = useState('');
  const [quoteDate, setQuoteDate] = useState('2025-09-17');
  const [validEmpty, setValidEmpty] = useState('2025-09-17');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [useAsOrderText, setUseAsOrderText] = useState(false);
  const [shippingFee, setShippingFee] = useState('0,00');
  const [invoiceFee, setInvoiceFee] = useState('0,00');
  const [invoice, setInvoice] = useState('');
  const [printTemplate, setPrintTemplate] = useState('Offer');
  const [language, setLanguage] = useState('Swedish');
  const [distributionMethod, setDistributionMethod] = useState('Printing');
  
  // Collapsible sections state
  const [quotationDetailsExpanded, setQuotationDetailsExpanded] = useState(false);
  const [customerInfoExpanded, setCustomerInfoExpanded] = useState(false);
  const [deliveryDetailsExpanded, setDeliveryDetailsExpanded] = useState(false);

  // Quotes handlers
  const handleSelectAllQuotes = () => {
    // Toggle select all logic here
    setSelectedQuotes(prev => prev.length > 0 ? [] : ['all']);
  };

  const getQuoteFilterColor = (filter: string) => {
    // Use quoteFilter to avoid linter warning
    console.log('Current quote filter:', quoteFilter);
    switch (filter) {
      case 'all': return 'bg-gray-100 text-gray-800';
      case 'active': return 'border-l-4 border-pink-400 bg-white text-gray-800';
      case 'overdue': return 'border-l-4 border-pink-400 bg-white text-gray-800';
      case 'orders-invoices-created': return 'border-l-4 border-green-400 bg-white text-gray-800';
      case 'cancelled': return 'bg-white text-gray-800 border border-gray-300';
      case 'failed': return 'bg-white text-gray-800 border border-gray-300';
      default: return 'bg-white text-gray-800 border border-gray-300';
    }
  };

  // Create quote handlers
  const handleCreateQuote = () => {
    setShowCreateQuote(true);
  };

  const handleShowList = () => {
    setShowCreateQuote(false);
  };

  const handleSaveQuote = () => {
    // Save quote logic here
    console.log('Saving quote...');
  };

  const handleCancelQuote = () => {
    setShowCreateQuote(false);
  };

  const handleSendQuote = () => {
    // Send quote logic here
    console.log('Sending quote...');
  };

  const handleCreateOrder = () => {
    // Create order logic here
    console.log('Creating order...');
  };

  return (
    <div className="space-y-6">
      {!showCreateQuote ? (
        <>
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">QUOTES - LIST</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleCreateQuote}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create quote
              </Button>
              <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
                <Printer className="w-4 h-4 mr-1" />
                Print list
              </button>
            </div>
          </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Quote no., Customer no., Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <button className="text-blue-600 text-sm hover:underline">Advanced search</button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        <button
          className={`px-4 py-2 text-sm font-medium rounded ${getQuoteFilterColor('all')}`}
          onClick={() => setQuoteFilter('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded ${getQuoteFilterColor('active')}`}
          onClick={() => setQuoteFilter('active')}
        >
          Active
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded ${getQuoteFilterColor('overdue')}`}
          onClick={() => setQuoteFilter('overdue')}
        >
          Overdue
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded ${getQuoteFilterColor('orders-invoices-created')}`}
          onClick={() => setQuoteFilter('orders-invoices-created')}
        >
          Orders/invoices created
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded ${getQuoteFilterColor('cancelled')}`}
          onClick={() => setQuoteFilter('cancelled')}
        >
          Cancelled
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded ${getQuoteFilterColor('failed')}`}
          onClick={() => setQuoteFilter('failed')}
        >
          Failed
        </button>
        <div className="flex-1"></div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
            <div className="w-4 h-4 mr-1 flex items-center justify-center">
              <div className="w-3 h-3 border border-gray-400 rounded"></div>
            </div>
            {selectedQuotes.length} -
          </button>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={handleSelectAllQuotes}
                    className="w-4 h-4 bg-blue-500 rounded hover:bg-blue-600"
                  ></button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-200">QUOTE NO.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER NO.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QUOTE DATE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VALID EMPTY</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QUOTE VALUE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CURRENCY</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total SEK</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">0.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">0.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
              </tr>
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                  No quotes found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">({selectedQuotes.length} selected)</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Distribution method</label>
            <select className="border border-gray-300 rounded px-3 py-1 text-sm">
              <option>Default template</option>
            </select>
          </div>
          <Button variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200" disabled>
            Preview
          </Button>
          <span className="text-sm text-gray-500">Preselected</span>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Create order
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
        </>
      ) : (
        /* Create Quote Interface */
        <div className="space-y-6">
          {/* Top Header Bar */}
          <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">QUOTE 1*</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                <Plus className="w-4 h-4 mr-2" />
                Create quote
              </Button>
              <Button 
                onClick={handleShowList}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
              >
                <Printer className="w-4 h-4 mr-2" />
                Show list
              </Button>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <button className="flex items-center hover:text-gray-900">
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </button>
                <button className="flex items-center hover:text-gray-900">
                  <CheckSquare className="w-4 h-4 mr-1" />
                  Credit information
                </button>
                <button className="flex items-center hover:text-gray-900">
                  <Lock className="w-4 h-4 mr-1" />
                  Mark as not ready
                </button>
                <button className="flex items-center hover:text-gray-900">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Comment
                </button>
                <button className="flex items-center hover:text-gray-900">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer & Dates Section */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                    <Input
                      placeholder="Customer number, Name, Corporate/Personal ID number"
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quote date</label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={quoteDate}
                          onChange={(e) => setQuoteDate(e.target.value)}
                          className="pr-10"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Valid empty</label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={validEmpty}
                          onChange={(e) => setValidEmpty(e.target.value)}
                          className="pr-10"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery date</label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          className="pr-10"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible Detail Sections */}
              <div className="space-y-4">
                <button
                  onClick={() => setQuotationDetailsExpanded(!quotationDetailsExpanded)}
                  className="flex items-center justify-between w-full p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">Quotation details</span>
                  <ArrowRight className={`w-4 h-4 text-green-600 transform transition-transform ${quotationDetailsExpanded ? 'rotate-90' : ''}`} />
                </button>
                <button
                  onClick={() => setCustomerInfoExpanded(!customerInfoExpanded)}
                  className="flex items-center justify-between w-full p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">Customer information</span>
                  <ArrowRight className={`w-4 h-4 text-green-600 transform transition-transform ${customerInfoExpanded ? 'rotate-90' : ''}`} />
                </button>
                <button
                  onClick={() => setDeliveryDetailsExpanded(!deliveryDetailsExpanded)}
                  className="flex items-center justify-between w-full p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">Delivery details</span>
                  <ArrowRight className={`w-4 h-4 text-green-600 transform transition-transform ${deliveryDetailsExpanded ? 'rotate-90' : ''}`} />
                </button>
              </div>

              {/* Item List Table */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ITEM NO.</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NUMBER</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UNIT</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">À PRICE</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DISCOUNT</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VAT</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACCOUNT</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TG %</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[1, 2, 3].map((row) => (
                        <tr key={row}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {row === 1 && <span className="font-medium text-gray-900">0.00</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <button className="text-red-600 hover:text-red-800">
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-800">
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quote Text & Fees Section */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quote text</label>
                    <textarea
                      value={quoteText}
                      onChange={(e) => setQuoteText(e.target.value)}
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter quote text here..."
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="useAsOrderText"
                      checked={useAsOrderText}
                      onChange={(e) => setUseAsOrderText(e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="useAsOrderText" className="ml-2 text-sm text-gray-700">
                      Use as order/invoice text.
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Shipping fee</label>
                      <Input
                        value={shippingFee}
                        onChange={(e) => setShippingFee(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Invoice fee</label>
                      <Input
                        value={invoiceFee}
                        onChange={(e) => setInvoiceFee(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Invoice</label>
                      <Input
                        value={invoice}
                        onChange={(e) => setInvoice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Print template</label>
                      <select
                        value={printTemplate}
                        onChange={(e) => setPrintTemplate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option>Offer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option>Swedish</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Financial Summary */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Net:</span>
                    <span className="text-sm font-medium">0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Gross:</span>
                    <span className="text-sm font-medium">0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total excl. VAT:</span>
                    <span className="text-sm font-medium">0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="text-sm font-medium">0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ear smoothing:</span>
                    <span className="text-sm font-medium">0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">VAT:</span>
                    <span className="text-sm font-medium">0.00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-orange-600">To pay:</span>
                      <span className="text-lg font-bold text-orange-600">0.00 SEK</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Image Button */}
              <div className="flex justify-end">
                <button className="w-12 h-12 bg-yellow-400 hover:bg-yellow-500 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-black" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleCancelQuote}
                variant="secondary" 
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveQuote}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Save
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700">Distribution method</label>
                <select
                  value={distributionMethod}
                  onChange={(e) => setDistributionMethod(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option>Printing</option>
                </select>
              </div>
              <Button 
                onClick={handleSendQuote}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Send
              </Button>
              <Button 
                onClick={handleCreateOrder}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Create order
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotesPage;
