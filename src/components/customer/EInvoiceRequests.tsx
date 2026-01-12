import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface EInvoiceRequest {
  id: string;
  companyName: string;
  orgNo: string;
  email: string;
  phone: string;
  status: 'received' | 'sent';
}

interface EInvoiceRequestsProps {
  onClose: () => void;
}

const EInvoiceRequests: React.FC<EInvoiceRequestsProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

  // Sample data for demonstration
  const sampleRequests: EInvoiceRequest[] = [
    {
      id: '1',
      companyName: 'ABC Company Ltd',
      orgNo: '123456-7890',
      email: 'contact@abccompany.se',
      phone: '+46 70 123 45 67',
      status: 'received'
    },
    {
      id: '2',
      companyName: 'XYZ Industries AB',
      orgNo: '987654-3210',
      email: 'info@xyzindustries.se',
      phone: '+46 31 987 65 43',
      status: 'received'
    }
  ];

  const receivedRequests = sampleRequests.filter(req => req.status === 'received');
  const sentRequests = sampleRequests.filter(req => req.status === 'sent');

  const toggleRequestSelection = (id: string) => {
    if (selectedRequests.includes(id)) {
      setSelectedRequests(selectedRequests.filter(requestId => requestId !== id));
    } else {
      setSelectedRequests([...selectedRequests, id]);
    }
  };

  const toggleAllSelection = () => {
    if (selectedRequests.length === (activeTab === 'received' ? receivedRequests : sentRequests).length) {
      setSelectedRequests([]);
    } else {
      const allIds = (activeTab === 'received' ? receivedRequests : sentRequests).map(req => req.id);
      setSelectedRequests(allIds);
    }
  };

  const handleAccept = () => {
    // Handle accept action
    console.log('Accepting requests:', selectedRequests);
  };

  const handleDecline = () => {
    // Handle decline action
    console.log('Declining requests:', selectedRequests);
  };

  const currentRequests = activeTab === 'received' ? receivedRequests : sentRequests;

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-4 bg-white min-h-screen">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-[#0B3D2E] mb-3">
        E-invoice requests
      </h1>

      {/* Description Text */}
      <p className="text-sm text-[#4B5563] max-w-[900px] mb-6 leading-relaxed">
        Here you can view both sent and received e-invoice invitations from your customers...
      </p>

      {/* Tab Navigation */}
      <div className="flex gap-6 mb-6">
        <button
          onClick={() => setActiveTab('received')}
          className={`pb-1.5 text-lg font-semibold relative ${
            activeTab === 'received' ? 'text-[#0B3D2E]' : 'text-[#6B7280] hover:text-[#0B3D2E]'
          }`}
        >
          Received
          {activeTab === 'received' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0B3D2E]"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`pb-1.5 text-lg font-medium relative ${
            activeTab === 'sent' ? 'text-[#0B3D2E]' : 'text-[#6B7280] hover:text-[#0B3D2E]'
          }`}
        >
          Sent
          {activeTab === 'sent' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0B3D2E]"></div>
          )}
        </button>
      </div>

      {/* Table Header */}
      <div className="w-full border-b border-[#E5E7EB] pb-3 mb-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1">
            <input
              type="checkbox"
              checked={
                selectedRequests.length > 0 && 
                selectedRequests.length === currentRequests.length
              }
              onChange={toggleAllSelection}
              className="w-4.5 h-4.5 border border-[#6B7280] rounded bg-white"
            />
          </div>
          <div className="col-span-3">
            <span className="text-xs font-semibold text-[#0B3D2E] uppercase tracking-[0.5px]">
              Company Name
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-xs font-semibold text-[#0B3D2E] uppercase tracking-[0.5px]">
              Org No
            </span>
          </div>
          <div className="col-span-3">
            <span className="text-xs font-semibold text-[#0B3D2E] uppercase tracking-[0.5px]">
              Email
            </span>
          </div>
          <div className="col-span-3">
            <span className="text-xs font-semibold text-[#0B3D2E] uppercase tracking-[0.5px]">
              Phone
            </span>
          </div>
        </div>
      </div>

      {/* Table Content or Empty State */}
      {currentRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[260px] py-10">
          <Star size={48} strokeWidth={2} fill="none" className="text-[#0B3D2E] mb-4" />
          <p className="text-sm text-[#6B7280] text-center">
            There are no {activeTab} requests
          </p>
        </div>
      ) : (
        <div className="mb-20">
          {currentRequests.map((request) => (
            <div
              key={request.id}
              className={`grid grid-cols-12 gap-4 py-3 border-b border-[#E5E7EB] last:border-b-0 ${
                selectedRequests.includes(request.id) ? 'bg-[#F0FDF4]' : 'hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={selectedRequests.includes(request.id)}
                  onChange={() => toggleRequestSelection(request.id)}
                  className="w-4.5 h-4.5 border border-[#6B7280] rounded bg-white"
                />
              </div>
              <div className="col-span-3 flex items-center">
                <span className="text-sm text-[#111827]">{request.companyName}</span>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-[#111827]">{request.orgNo}</span>
              </div>
              <div className="col-span-3 flex items-center">
                <span className="text-sm text-[#111827]">{request.email}</span>
              </div>
              <div className="col-span-3 flex items-center">
                <span className="text-sm text-[#111827]">{request.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] h-18 flex items-center justify-between px-6">
        <button
          onClick={onClose}
          className="h-10 px-6 bg-white border-2 border-[#0B3D2E] text-[#0B3D2E] rounded-full text-sm font-semibold hover:bg-[#F0FDF4]"
        >
          Close
        </button>
        <div className="flex items-center gap-3">
          <button
            disabled={selectedRequests.length === 0}
            className={`h-10 px-6 rounded-full text-sm font-semibold ${
              selectedRequests.length === 0
                ? 'bg-white border-2 border-[#D1D5DB] text-[#9CA3AF] cursor-not-allowed'
                : 'bg-white border-2 border-[#D1D5DB] text-[#9CA3AF] hover:bg-gray-50'
            }`}
          >
            Decline
          </button>
          <button
            disabled={selectedRequests.length === 0}
            className={`h-10 px-7 rounded-full text-sm font-semibold ${
              selectedRequests.length === 0
                ? 'bg-[#C7CFCB] text-white cursor-not-allowed'
                : 'bg-[#0B3D2E] text-white hover:bg-[#0F4D3A]'
            }`}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default EInvoiceRequests;