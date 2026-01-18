import React, { useState } from 'react';
import PAYETaxReturn from './PAYETaxReturn';
import PostingBasis from './PostingBasis';

const SalaryRun = () => {
  const [activeTab, setActiveTab] = useState<'salary-run' | 'paye-tax-return' | 'posting-basis'>('salary-run');

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Top App Header */}
      <div className="h-[56px] px-[16px] py-[12px] flex items-center justify-between bg-white border-b border-[#E5E5E5]">
        <div className="text-[14px] font-semibold text-[#1F1F1F] tracking-[0.6px] uppercase">
          SALARY RUN
        </div>
        <div className="flex items-center gap-[8px]">
          <button className="h-[32px] px-[12px] text-[12px] font-semibold text-black bg-[#FFC107] rounded-[16px] flex items-center">
            <span className="text-[12px] mr-[6px]">+</span>
            Create payslip
          </button>
          <button className="h-[32px] px-[14px] text-[12px] font-semibold text-white bg-[#0B7A3E] rounded-[16px]">
            Send pay slip digitally
          </button>
        </div>
      </div>
      
      {/* Secondary Action Row */}
      <div className="h-[40px] px-[16px] py-[8px] flex justify-end items-center gap-[20px]">
        <div className="flex items-center gap-[6px] text-[#5F6368] text-[12px] font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span>Show scheduled</span>
        </div>
        <div className="flex items-center gap-[6px] text-[#BDBDBD] text-[12px] font-medium opacity-40">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Comments</span>
        </div>
        <div className="flex items-center gap-[6px] text-[#5F6368] text-[12px] font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          <span>Retroactive salary</span>
        </div>
        <div className="flex items-center gap-[6px] text-[#5F6368] text-[12px] font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          <span>Delete salary period</span>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="h-[44px] flex items-center border-b border-[#E0E0E0] overflow-x-auto">
        <div className="flex w-full">
          <button
            onClick={() => setActiveTab('salary-run')}
            className={`px-[12px] py-[10px] text-[13px] font-medium ${
              activeTab === 'salary-run' ? 'text-[#0B7A3E]' : 'text-[#5F6368]'
            }`}
          >
            Salary run
            {activeTab === 'salary-run' && (
              <div className="h-[2px] bg-[#0B7A3E] w-full mt-[4px]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('paye-tax-return')}
            className={`px-[12px] py-[10px] text-[13px] font-medium ${
              activeTab === 'paye-tax-return' ? 'text-[#0B7A3E]' : 'text-[#5F6368]'
            }`}
          >
            PAYE tax return
            {activeTab === 'paye-tax-return' && (
              <div className="h-[2px] bg-[#0B7A3E] w-full mt-[4px]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('posting-basis')}
            className={`px-[12px] py-[10px] text-[13px] font-medium ${
              activeTab === 'posting-basis' ? 'text-[#0B7A3E]' : 'text-[#5F6368]'
            }`}
          >
            Posting basis
            {activeTab === 'posting-basis' && (
              <div className="h-[2px] bg-[#0B7A3E] w-full mt-[4px]"></div>
            )}
          </button>
        </div>
      </div>
      
      {/* Content based on active tab */}
      {activeTab === 'salary-run' && (
        <>
          {/* Primary Info Card (Hero Panel) */}
          <div className="mx-[16px] my-[20px] p-[16px] bg-[#7E7A8F] rounded-[12px]">
            <div>
              <h2 className="text-[14px] font-semibold text-white mb-[8px]">Time to pay salary.</h2>
              <p className="text-[12px] leading-[1.5] text-[#F1F1F1] mb-[6px]">
                Click Create pay slip at the top right to create the payrun. You can also activate our help guide under Create pay slip that will guide you all the way through the payrun.
              </p>
              <p className="text-[12px] leading-[1.5] text-[#F1F1F1]">
                If you need to review any of the different settings that you can make in Fortnox's salary, you will find more information under Read more settings.
              </p>
            </div>
            
            <div className="mt-[12px] flex flex-wrap gap-[10px]">
              <button className="h-[32px] px-[14px] bg-white text-[#1F1F1F] text-[12px] font-semibold rounded-[16px]">
                Create Salary run
              </button>
              <button className="h-[32px] px-[14px] bg-transparent border border-white text-white text-[12px] rounded-[16px]">
                Read more
              </button>
            </div>
            
            {/* Illustration */}
            <div className="mt-[12px] flex justify-center">
              <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="20" width="100" height="40" rx="5" fill="#4F6D6D"/>
                <rect x="15" y="25" width="90" height="10" rx="2" fill="#6E8E8E"/>
                <circle cx="30" cy="50" r="5" fill="#F4C430"/>
                <circle cx="40" cy="45" r="4" fill="#F4C430"/>
                <circle cx="35" cy="55" r="3" fill="#F4C430"/>
                <polygon points="80,40 100,50 80,60" fill="#FFFFFF"/>
              </svg>
            </div>
          </div>
          
          {/* Information Alert Card */}
          <div className="mx-[16px] p-[16px] border border-[#DADADA] rounded-[10px] bg-white">
            <div className="flex items-start gap-[12px]">
              <div className="w-[32px] h-[32px] flex items-center justify-center border-2 border-[#0B7A3E] rounded-full text-[#0B7A3E] text-[16px] font-bold">
                i
              </div>
              <div className="text-[12px] leading-[1.5] text-[#1F1F1F]">
                Fortnox Lön now supports sending a payment file directly to Danske Bank according to the new Pain.001 format. What you need is to activate a bank connection.{' '}
                <a href="#" className="text-[#0B7A3E] font-medium underline">Read more here</a>{' '}
                about how to get started.{' '}
                <a href="#" className="text-[#0B7A3E] font-medium underline">here</a>.
              </div>
            </div>
          </div>
        </>
      )}
      
      {activeTab === 'paye-tax-return' && (
        <PAYETaxReturn />
      )}
      
      {activeTab === 'posting-basis' && (
        <PostingBasis />
      )}
    </div>
  );
};

export default SalaryRun;