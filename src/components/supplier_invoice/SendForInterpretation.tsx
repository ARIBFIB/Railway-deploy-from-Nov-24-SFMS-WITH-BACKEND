import React, { useState } from 'react';
import { 
  Mail, 
  Printer, 
  Plus, 
  Menu,
  ChevronDown
} from 'lucide-react';

const SendForInterpretation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [rowDensity, setRowDensity] = useState('0');

  const handleSelectAll = () => {
    // For empty state, select all would select an empty array
  };

  const handleSendFiles = () => {
    // Handle sending files logic
    console.log('Sending files...');
  };

  const handleAddFile = () => {
    // Handle adding file logic
    console.log('Adding file...');
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#F7F7F7]">
      {/* Header Section */}
      <div className="h-12 flex items-center px-6">
        <div className="flex items-center">
          <Mail size={16} className="text-[#757575] mr-2" />
          <h1 className="text-lg font-semibold text-[#1A1A1A] tracking-[0.3px]">SEND FOR INTERPRETATION</h1>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <div className="relative w-[260px]">
            <input
              placeholder="Source, File name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 border border-[#DADADA] rounded px-8 text-sm bg-white text-[#1A1A1A] placeholder-[#9E9E9E]"
            />
            <svg 
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-[#9E9E9E]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </div>
          
          <button 
            className="h-9 bg-[#FFC107] text-black text-sm font-semibold rounded-full px-4.5 hover:bg-[#FFB300] flex items-center"
            onClick={handleAddFile}
          >
            <Plus size={14} className="mr-1" />
            <span>+ Add file</span>
          </button>
        </div>
      </div>

      {/* Utility Actions Row */}
      <div className="px-6 py-2 flex items-center justify-end">
        <button className="flex items-center space-x-1 text-sm text-[#4A4A4A] hover:text-black">
          <Printer size={18} className="text-[#4A4A4A]" />
          <span>Print list</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="px-6 py-2 flex space-x-2">
        {[
          { key: 'all', label: 'All', color: '' },
          { key: 'not-sent', label: 'Not sent', color: '#E0E0E0' },
          { key: 'awaiting-interpretation', label: 'Awaiting interpretation', color: '#E1BEE7' },
          { key: 'could-not-be-sent', label: 'Could not be sent', color: '#FFE0B2' },
          { key: 'invalid-files', label: 'Invalid files', color: '#FFCDD2' }
        ].map((filter) => (
          <button
            key={filter.key}
            className={`h-8 px-3 text-sm flex items-center space-x-2 ${
              activeFilter === filter.key 
                ? 'bg-[#F5F5F5] font-medium' 
                : 'bg-white'
            } border border-[#DADADA] rounded`}
            onClick={() => setActiveFilter(filter.key)}
          >
            {filter.color && (
              <div 
                className="w-1 h-6 rounded" 
                style={{ backgroundColor: filter.color }}
              ></div>
            )}
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {/* View Controls and Table Header */}
      <div className="mx-6 mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-[#F0F0F0] rounded p-1 mr-2">
            <Menu size={16} className="text-[#4A4A4A]" />
          </div>
          <div className="bg-[#F0F0F0] rounded px-2 py-1 flex items-center">
            <span className="text-sm text-[#4A4A4A]">{rowDensity}</span>
            <ChevronDown size={16} className="text-[#4A4A4A] ml-1" />
          </div>
        </div>

        {/* Table Header */}
        <div className="w-full bg-white border border-[#E0E0E0] rounded">
          <div className="h-11 bg-[#FAFAFA] border-b-2 border-[#BDBDBD] flex items-center">
            <div className="w-9 flex items-center pl-2">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded text-[#1A73E8] focus:ring-[#1A73E8]"
                onChange={handleSelectAll}
              />
            </div>
            <div className="flex-1 text-xs font-semibold uppercase tracking-wider text-[#333333] px-2">
              Source
            </div>
            <div className="w-64 text-xs font-semibold uppercase tracking-wider text-[#333333] px-2">
              File Name
            </div>
            <div className="w-32 text-xs font-semibold uppercase tracking-wider text-[#333333] px-2">
              Sent
            </div>
            <div className="w-40 bg-[#BDBDBD] text-white text-xs font-semibold uppercase tracking-wider text-center py-1 rounded">
              Uploaded
            </div>
          </div>

          {/* Table Body - Empty State */}
          <div className="bg-white min-h-[200px] flex items-center justify-center border-t border-[#E0E0E0] rounded-b">
            <div className="text-center py-8">
              <p className="text-sm text-[#757575]">No files to interpret yet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action Bar */}
      <div className="h-14 bg-white border-t border-[#E0E0E0] px-6 flex items-center justify-between sticky bottom-0 z-10">
        <div className="flex items-center space-x-3">
          <button 
            disabled
            className="h-9 px-5 bg-[#D6D6D6] text-white text-sm font-semibold rounded-full cursor-not-allowed"
          >
            Delete
          </button>
        </div>
        <div>
          <p className="text-xs text-[#9E9E9E] italic">*See price list</p>
        </div>
        <div>
          <button 
            className="h-9 bg-[#81C784] text-white text-sm font-semibold rounded-full px-6 hover:bg-[#66BB6A] active:bg-[#4CAF50]"
            onClick={handleSendFiles}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendForInterpretation;