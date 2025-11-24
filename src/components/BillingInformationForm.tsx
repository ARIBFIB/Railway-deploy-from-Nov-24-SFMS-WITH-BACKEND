import React from 'react';
import { Info, Check, ChevronDown } from 'lucide-react';

interface BillingInformationFormProps {
  formData: any;
  handleInputChange: (field: string, value: string) => void;
}

export const BillingInformationForm: React.FC<BillingInformationFormProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-8">
      {/* Payment and delivery terms, Billing, References, Accounting */}
      <div className="grid grid-cols-3 gap-6">
        {/* Payment and delivery terms */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Payment and delivery terms</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment terms</label>
            <select
              value={formData.paymentTerms}
              onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select payment terms</option>
              <option value="net30">Net 30</option>
              <option value="net15">Net 15</option>
              <option value="due_on_receipt">Due on receipt</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery terms</label>
            <select
              value={formData.deliveryTerms}
              onChange={(e) => handleInputChange('deliveryTerms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select delivery terms</option>
              <option value="fob">FOB</option>
              <option value="cif">CIF</option>
              <option value="exw">EXW</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery method</label>
            <select
              value={formData.deliveryMethod}
              onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select delivery method</option>
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="overnight">Overnight</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interest invoicing</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="interestInvoicing"
                  value="yes"
                  checked={formData.interestInvoicing === 'yes'}
                  onChange={(e) => handleInputChange('interestInvoicing', e.target.value)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="interestInvoicing"
                  value="no"
                  checked={formData.interestInvoicing === 'no'}
                  onChange={(e) => handleInputChange('interestInvoicing', e.target.value)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
        </div>

        {/* Billing */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Billing</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price list</label>
            <select
              value={formData.priceList}
              onChange={(e) => handleInputChange('priceList', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Price list A">Price list A</option>
              <option value="Price list B">Price list B</option>
              <option value="Price list C">Price list C</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="SEK">SEK</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Invoice discount (%)</label>
            <input
              type="text"
              value={formData.invoiceDiscount}
              onChange={(e) => handleInputChange('invoiceDiscount', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Invoice fee</label>
            <input
              type="text"
              value={formData.invoiceFee}
              onChange={(e) => handleInputChange('invoiceFee', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shipping fee</label>
            <input
              type="text"
              value={formData.shippingFee}
              onChange={(e) => handleInputChange('shippingFee', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prices incl. VAT</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pricesInclVAT"
                  value="yes"
                  checked={formData.pricesInclVAT === 'yes'}
                  onChange={(e) => handleInputChange('pricesInclVAT', e.target.value)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pricesInclVAT"
                  value="no"
                  checked={formData.pricesInclVAT === 'no'}
                  onChange={(e) => handleInputChange('pricesInclVAT', e.target.value)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
        </div>

        {/* References */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">References</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Our reference</label>
            <input
              type="text"
              value={formData.ourReference}
              onChange={(e) => handleInputChange('ourReference', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="First name, Last name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Service Representative</label>
            <select
              value={formData.customerServiceRep}
              onChange={(e) => handleInputChange('customerServiceRep', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select representative</option>
              <option value="rep1">Representative 1</option>
              <option value="rep2">Representative 2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">External reference</label>
            <input
              type="text"
              value={formData.externalReference}
              onChange={(e) => handleInputChange('externalReference', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your reference</label>
            <div className="border border-gray-300 rounded-md">
              <div className="grid grid-cols-2 border-b border-gray-200">
                <div className="px-3 py-2 bg-gray-50 text-sm font-medium text-gray-700">PRESELECTED</div>
                <div className="px-3 py-2 bg-gray-50 text-sm font-medium text-gray-700">NAME</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="px-3 py-2 flex items-center">
                  <input type="radio" checked className="mr-2" />
                </div>
                <div className="px-3 py-2 text-sm text-gray-700">Ingen förvald</div>
              </div>
            </div>
            <button className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
              Add reference
            </button>
          </div>
        </div>
      </div>

      {/* Accounting */}
      <div className="grid grid-cols-1 gap-6">
        <div className="max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Accounting</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">VAT number</label>
              <input
                type="text"
                value={formData.vatNumber}
                onChange={(e) => handleInputChange('vatNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                VAT type
                <Info className="w-4 h-4 ml-2 text-blue-500" />
              </label>
              <select
                value={formData.vatType}
                onChange={(e) => handleInputChange('vatType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="SEE">SEE</option>
                <option value="EU">EU</option>
                <option value="NON_EU">NON-EU</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sales account</label>
              <input
                type="text"
                value={formData.salesAccount}
                onChange={(e) => handleInputChange('salesAccount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Account, Name"
              />
            </div>
          </div>
        </div>
      </div>

      {/* E-document Section */}
      <div className="border-t pt-8">
        <div className="flex items-center mb-6">
          <Check className="w-5 h-5 text-green-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">E-document</h2>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Invoice */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Invoice</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distribution method</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleInputChange('invoiceDistributionMethod', 'e-invoice')}
                  className={`px-3 py-2 text-sm rounded ${
                    formData.invoiceDistributionMethod === 'e-invoice'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}
                >
                  E-invoice
                </button>
                <button
                  onClick={() => handleInputChange('invoiceDistributionMethod', 'email')}
                  className={`px-3 py-2 text-sm rounded ${
                    formData.invoiceDistributionMethod === 'email'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}
                >
                  E-mail
                </button>
                <button
                  onClick={() => handleInputChange('invoiceDistributionMethod', 'printing')}
                  className={`px-3 py-2 text-sm rounded ${
                    formData.invoiceDistributionMethod === 'printing'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}
                >
                  Printing
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
              <input
                type="email"
                value={formData.invoiceEmail}
                onChange={(e) => handleInputChange('invoiceEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email for reminders</label>
              <input
                type="email"
                value={formData.invoiceEmailReminders}
                onChange={(e) => handleInputChange('invoiceEmailReminders', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Copy</label>
              <input
                type="email"
                value={formData.invoiceCopy}
                onChange={(e) => handleInputChange('invoiceCopy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secret copy</label>
              <input
                type="email"
                value={formData.invoiceSecretCopy}
                onChange={(e) => handleInputChange('invoiceSecretCopy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                GLN number
                <Info className="w-4 h-4 ml-2 text-blue-500" />
              </label>
              <input
                type="text"
                value={formData.invoiceGlnNumber}
                onChange={(e) => handleInputChange('invoiceGlnNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                GLN number for delivery
                <Info className="w-4 h-4 ml-2 text-blue-500" />
              </label>
              <input
                type="text"
                value={formData.invoiceGlnDelivery}
                onChange={(e) => handleInputChange('invoiceGlnDelivery', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Offer */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Offer</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distribution method</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleInputChange('offerDistributionMethod', 'email')}
                  className={`px-3 py-2 text-sm rounded ${
                    formData.offerDistributionMethod === 'email'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}
                >
                  E-mail
                </button>
                <button
                  onClick={() => handleInputChange('offerDistributionMethod', 'printing')}
                  className={`px-3 py-2 text-sm rounded ${
                    formData.offerDistributionMethod === 'printing'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}
                >
                  Printing
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
              <input
                type="email"
                value={formData.offerEmail}
                onChange={(e) => handleInputChange('offerEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Copy</label>
              <input
                type="email"
                value={formData.offerCopy}
                onChange={(e) => handleInputChange('offerCopy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secret copy</label>
              <input
                type="email"
                value={formData.offerSecretCopy}
                onChange={(e) => handleInputChange('offerSecretCopy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Order */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Order</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distribution method</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleInputChange('orderDistributionMethod', 'email')}
                  className={`px-3 py-2 text-sm rounded ${
                    formData.orderDistributionMethod === 'email'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}
                >
                  E-mail
                </button>
                <button
                  onClick={() => handleInputChange('orderDistributionMethod', 'printing')}
                  className={`px-3 py-2 text-sm rounded ${
                    formData.orderDistributionMethod === 'printing'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}
                >
                  Printing
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
              <input
                type="email"
                value={formData.orderEmail}
                onChange={(e) => handleInputChange('orderEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Copy</label>
              <input
                type="email"
                value={formData.orderCopy}
                onChange={(e) => handleInputChange('orderCopy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secret copy</label>
              <input
                type="email"
                value={formData.orderSecretCopy}
                onChange={(e) => handleInputChange('orderSecretCopy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Invoice text and Preselected templates */}
      <div className="border-t pt-8">
        <div className="space-y-6">
          {/* Invoice text */}
          <div>
            <div className="flex items-center mb-4">
              <ChevronDown className="w-5 h-5 text-green-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Invoice text</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Invoice text</label>
              <textarea
                value={formData.invoiceText}
                onChange={(e) => handleInputChange('invoiceText', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter invoice text..."
              />
            </div>
          </div>

          {/* Preselected templates */}
          <div>
            <div className="flex items-center mb-4">
              <ChevronDown className="w-5 h-5 text-green-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Preselected templates</h3>
            </div>
            
            <div className="grid grid-cols-4 gap-6">
              {/* Invoice */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Invoice</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                  <select
                    value={formData.invoiceTemplate}
                    onChange={(e) => handleInputChange('invoiceTemplate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Nothing selected</option>
                    <option value="template1">Template 1</option>
                    <option value="template2">Template 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={formData.invoiceLanguage}
                    onChange={(e) => handleInputChange('invoiceLanguage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Nothing selected</option>
                    <option value="en">English</option>
                    <option value="sv">Swedish</option>
                  </select>
                </div>
              </div>

              {/* Offer */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Offer</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                  <select
                    value={formData.offerTemplate}
                    onChange={(e) => handleInputChange('offerTemplate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Nothing selected</option>
                    <option value="template1">Template 1</option>
                    <option value="template2">Template 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={formData.offerLanguage}
                    onChange={(e) => handleInputChange('offerLanguage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Nothing selected</option>
                    <option value="en">English</option>
                    <option value="sv">Swedish</option>
                  </select>
                </div>
              </div>

              {/* Order */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Order</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                  <select
                    value={formData.orderTemplate}
                    onChange={(e) => handleInputChange('orderTemplate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Nothing selected</option>
                    <option value="template1">Template 1</option>
                    <option value="template2">Template 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={formData.orderLanguage}
                    onChange={(e) => handleInputChange('orderLanguage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Nothing selected</option>
                    <option value="en">English</option>
                    <option value="sv">Swedish</option>
                  </select>
                </div>
              </div>

              {/* Cash invoice */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Cash invoice</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                  <select
                    value={formData.cashInvoiceTemplate}
                    onChange={(e) => handleInputChange('cashInvoiceTemplate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Nothing selected</option>
                    <option value="template1">Template 1</option>
                    <option value="template2">Template 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={formData.cashInvoiceLanguage}
                    onChange={(e) => handleInputChange('cashInvoiceLanguage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Nothing selected</option>
                    <option value="en">English</option>
                    <option value="sv">Swedish</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
