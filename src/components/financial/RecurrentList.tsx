import React, { useState } from 'react';
import { CreateRecurringForm } from './CreateRecurringForm';

export const RecurrentList: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const handleCreateClick = () => {
    setShowCreateForm(true);
  };
  
  const handleCancel = () => {
    setShowCreateForm(false);
  };
  
  const handleSave = (recurringData: any) => {
    // Handle saving recurring data
    console.log('Saving recurring data:', recurringData);
    setShowCreateForm(false);
  };
  
  if (showCreateForm) {
    return <CreateRecurringForm onCancel={handleCancel} onSave={handleSave} />;
  }
  
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-[#202124] mb-4">Recurring</h2>
      <div className="border border-[#DADADA] rounded-lg p-8 max-w-4xl">
        <div className="flex flex-col md:flex-row">
          {/* Left Section - Primary Content */}
          <div className="md:w-3/5 pr-8">
            <h3 className="text-xl font-semibold text-[#0B3A2E] mb-3">Create Recurring Invoice</h3>
            <p className="text-[#4A4A4A] mb-6">
              Set up recurring invoices to automatically send to your customers at regular intervals. Perfect for subscriptions, memberships, or regular services.
            </p>
            <button 
              onClick={handleCreateClick}
              className="bg-[#0A7A3B] hover:bg-[#066630] text-white font-semibold rounded-full px-6 py-3 text-base"
            >
              Create Recurring
            </button>
          </div>
          
          {/* Vertical Divider */}
          <div className="hidden md:block w-px bg-[#E0E0E0] mx-4"></div>
          
          {/* Right Section - Help Card */}
          <div className="md:w-2/5 mt-6 md:mt-0 md:border-l md:border-[#E0E0E0] md:pl-8">
            <div className="bg-[#FAD1DE] rounded-xl p-6 h-full">
              <h4 className="text-lg font-semibold text-[#0B3A2E] mb-3">Need help?</h4>
              <p className="text-[#4A4A4A] mb-4">
                Learn how to set up recurring invoices and automate your billing process.
              </p>
              <a href="#" className="text-[#0B3A2E] font-medium underline hover:text-[#066630] inline-block mb-4">
                Show help section
              </a>
              <div className="flex justify-end">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow">
                  <img 
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23cccccc'/%3E%3Ctext x='12' y='16' font-size='12' text-anchor='middle' fill='%23666666'%3EAV%3C/text%3E%3C/svg%3E" 
                    alt="Support" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};