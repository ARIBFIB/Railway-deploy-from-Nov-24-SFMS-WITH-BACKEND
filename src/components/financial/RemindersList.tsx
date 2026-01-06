import React from 'react';
import { Search } from 'lucide-react';

export const RemindersList: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header Section */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#202124] mb-4">REMINDERS – LIST</h2>
            
            <div className="relative w-96 mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9E9E9E] w-4 h-4" />
              <input
                type="text"
                placeholder="Invoice no., OCR, Cust. no., Name"
                className="h-9 w-full pl-10 border border-[#DADCE0] rounded text-[#202124]"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-sm text-[#1A73E8] hover:underline">Extended Search</button>
            <button className="text-[#5F6368] hover:text-[#202124] flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 5H7v8h6v-8z" clipRule="evenodd" />
              </svg>
              <span className="ml-1">Print list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards Section */}
      <div className="grid grid-cols-2 gap-6 px-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.08)]">
          <div className="flex items-center space-x-4">
            <div className="bg-[#E8A69B] w-10 h-10 rounded-full flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 4a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-[#5F6368]">Unpaid overdue total</p>
              <p className="text-xl font-semibold text-[#202124]">0 kr</p>
              <p className="text-sm text-[#5F6368]">(0 st)</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.08)]">
          <div className="flex items-center space-x-4">
            <div className="bg-[#9CC9DD] w-10 h-10 rounded-full flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6v3.586l-.707.707a1 1 0 00.293 1.707l1.707 1.707a1 1 0 001.414 0l1.707-1.707a1 1 0 00.293-1.707L10 11.586V8a4 4 0 118 0v3.586l.707.707a1 1 0 00.293 1.707l1.707 1.707a1 1 0 001.414 0l1.707-1.707a1 1 0 00.293-1.707L22 11.586V8a6 6 0 00-6-6h-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-[#5F6368]">Reminders to send</p>
              <p className="text-xl font-semibold text-[#202124]">0 kr</p>
              <p className="text-sm text-[#5F6368]">(0 st)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs Section */}
      <div className="px-4 mb-4 flex justify-between items-center">
        <div className="flex space-x-2">
          {[
            { value: 'all-unpaid-due', label: 'All unpaid due', color: 'bg-[#F8BDBD]' },
            { value: 'reminders-to-send', label: 'Reminders to send', color: 'bg-[#FAD2D2]' },
            { value: 'external-processing', label: 'External processing', color: 'bg-[#FFF3B0]' },
            { value: 'failed', label: 'Failed', color: 'bg-white' },
          ].map((filter) => (
            <button
              key={filter.value}
              className={`px-3 py-2 text-sm border rounded ${filter.color} border-[#DADCE0] font-medium`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-[#5F6368]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <select className="h-9 border border-[#DADCE0] rounded px-3 text-[#202124] text-sm">
            <option>100</option>
            <option>200</option>
            <option>500</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="mx-4 mb-24">
        <div className="border border-[#E0E0E0] rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-white">
                <th className="px-4 py-3 text-xs font-semibold text-[#202124] uppercase text-left w-12">Checkbox</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#202124] uppercase text-left bg-[#BDBDBD] text-white">Invoice Number</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#202124] uppercase text-left">OCR</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#202124] uppercase text-left">Type</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#202124] uppercase text-left">Customer No.</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#202124] uppercase text-left">Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#202124] uppercase text-left">Invoice Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#202124] uppercase text-left">Due Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#202124] uppercase text-right">Total</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#202124] uppercase text-right">Balance</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#202124] uppercase text-center">Currency</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#202124] uppercase text-center">Sent</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#202124] uppercase text-center">Quantity</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#202124] uppercase text-center">Reminder Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#E0E0E0] hover:bg-[#F8F9FA] h-12">
                <td className="px-4 py-3 text-center">
                  <input type="checkbox" className="text-[#1A73E8]" />
                </td>
                <td className="px-4 py-3 text-sm">-</td>
                <td className="px-4 py-3 text-sm">-</td>
                <td className="px-4 py-3 text-sm">-</td>
                <td className="px-4 py-3 text-sm">-</td>
                <td className="px-4 py-3 text-sm">-</td>
                <td className="px-4 py-3 text-sm">-</td>
                <td className="px-4 py-3 text-sm">-</td>
                <td className="px-4 py-3 text-sm text-right">-</td>
                <td className="px-4 py-3 text-sm text-right">-</td>
                <td className="px-4 py-3 text-sm text-center">-</td>
                <td className="px-4 py-3 text-sm text-center">-</td>
                <td className="px-4 py-3 text-sm text-center">-</td>
                <td className="px-4 py-3 text-sm text-center">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] h-18 flex items-center px-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-[#5F6368]">(0 selected)</span>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm text-[#5F6368]">Change reminder date to</label>
            <input
              type="date"
              className="h-9 border border-[#DADCE0] rounded px-3 text-[#202124] text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm text-[#5F6368]">Printout template</label>
            <select className="h-9 border border-[#DADCE0] rounded px-3 text-[#202124] text-sm">
              <option>Påminnelse</option>
              <option>Reminder</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm text-[#5F6368]">Language</label>
            <select className="h-9 border border-[#DADCE0] rounded px-3 text-[#202124] text-sm">
              <option>Swedish</option>
              <option>English</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm text-[#5F6368]">Distribution method</label>
            <select className="h-9 border border-[#DADCE0] rounded px-3 text-[#202124] text-sm">
              <option>Default</option>
              <option>Email</option>
              <option>Post</option>
            </select>
          </div>
        </div>
        
        <div className="ml-auto flex items-center space-x-3">
          <button className="bg-[#9E9E9E] text-white font-semibold rounded-full px-5 py-2.5 text-sm">
            Preview
          </button>
          <button className="bg-[#9FD3B5] hover:bg-[#0F9D58] text-white font-semibold rounded-full px-5 py-2.5 text-sm">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};