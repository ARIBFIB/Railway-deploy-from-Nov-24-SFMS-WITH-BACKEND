import React, { useState } from 'react';

const ReportsTab = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [leaveBlank, setLeaveBlank] = useState(false);
  const [specNumber, setSpecNumber] = useState('1');
  const [workplaceNumberTax, setWorkplaceNumberTax] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [placeOfWork, setPlaceOfWork] = useState('');
  const [collectionExpanded, setCollectionExpanded] = useState(true);
  const [collectumITP, setCollectumITP] = useState('yes');
  const [differentType, setDifferentType] = useState('yes');
  const [forumsExpanded, setForumsExpanded] = useState(true);
  const [statisticsExpanded, setStatisticsExpanded] = useState(true);
  const [outsideExpanded, setOutsideExpanded] = useState(true);
  const [globalRulesExpanded, setGlobalRulesExpanded] = useState(true);
  const [scbSalaryInclude, setScbSalaryInclude] = useState('yes');
  const [snSalaryInclude, setSnSalaryInclude] = useState('yes');
  const [scbShortTermInclude, setScbShortTermInclude] = useState('yes');
  const [startDate, setStartDate] = useState('');
  const [asl65Checked, setAsl65Checked] = useState(false);
  const [kp65Checked, setKp65Checked] = useState(false);
  const [annualReporting, setAnnualReporting] = useState('Not signed');
  const [outsideAnnualReporting, setOutsideAnnualReporting] = useState('Not signed');
  const [occupationalCodeSSYK, setOccupationalCodeSSYK] = useState('');
  const [occupationalCodeNYK, setOccupationalCodeNYK] = useState('');
  const [workplaceNumber, setWorkplaceNumber] = useState('');
  const [federationNumber, setFederationNumber] = useState('');
  const [contractCode, setContractCode] = useState('');
  const [jobStatus, setJobStatus] = useState('Other employees');
  const [hourlyPaidEmployee, setHourlyPaidEmployee] = useState('no');
  const [categoryPayroll, setCategoryPayroll] = useState('');
  const [workplaceNumberStat, setWorkplaceNumberStat] = useState('');
  const [weekendSalary, setWeekendSalary] = useState('no');
  const [workingTimeType, setWorkingTimeType] = useState('');

  return (
    <div className="bg-[#F7F7F7] p-[16px] pb-[80px] font-sans text-[12px]" style={{ fontFamily: 'Inter, system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      {/* The Swedish Tax Agency Section */}
      <div className="w-full bg-white p-[16px] border-b border-[#E6E6E6]">
        {/* Section Header (Dropdown Trigger) */}
        <div 
          className="h-[40px] w-full flex items-center gap-[8px] cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? setIsExpanded(!isExpanded) : null}
          aria-expanded={isExpanded}
        >
          <svg 
            className={`w-[14px] h-[14px] text-[#1A7F37] transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          <h3 className="text-[14px] font-bold text-[#2B2B2B] leading-[20px]">
            The Swedish Tax Agency
          </h3>
        </div>

        {/* Content Area (Expanded State) */}
        {isExpanded && (
          <div className="mt-[12px]">
            <div className="grid grid-cols-2 gap-[16px]">
              {/* Specification number for PAYE tax return */}
              <div>
                <label className="block text-[13px] font-medium text-[#2B2B2B] mb-[6px]">
                  Specification number for PAYE tax return
                </label>
                <input
                  type="text"
                  className={`h-[36px] w-full px-[12px] text-[13px] border rounded-[4px] ${
                    leaveBlank 
                      ? 'bg-[#F5F5F5] text-[#9B9B9B] border-[#CFCFCF] cursor-not-allowed' 
                      : 'bg-white border-[#CFCFCF] focus:border-[#1A7F37]'
                  }`}
                  value={specNumber}
                  onChange={(e) => setSpecNumber(e.target.value)}
                  disabled={leaveBlank}
                />
              </div>

              {/* Workplace number to PAYE tax returns per employee */}
              <div>
                <label className="block text-[13px] font-medium text-[#2B2B2B] mb-[6px]">
                  Workplace number to PAYE tax returns per employee
                </label>
                <input
                  type="text"
                  className={`h-[36px] w-full px-[12px] text-[13px] border rounded-[4px] ${
                    leaveBlank 
                      ? 'bg-[#F5F5F5] text-[#9B9B9B] border-[#CFCFCF] cursor-not-allowed' 
                      : 'bg-white border-[#CFCFCF] focus:border-[#1A7F37]'
                  }`}
                  value={workplaceNumberTax}
                  onChange={(e) => setWorkplaceNumberTax(e.target.value)}
                  disabled={leaveBlank}
                  placeholder=""
                />
              </div>

              {/* Street address of the workplace */}
              <div className="col-span-2">
                <label className="block text-[13px] font-medium text-[#2B2B2B] mb-[6px]">
                  Street address of the workplace
                </label>
                <input
                  type="text"
                  className={`h-[36px] w-full px-[12px] text-[13px] border rounded-[4px] ${
                    leaveBlank 
                      ? 'bg-[#F5F5F5] text-[#9B9B9B] border-[#CFCFCF] cursor-not-allowed' 
                      : 'bg-white border-[#CFCFCF] focus:border-[#1A7F37]'
                  }`}
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  disabled={leaveBlank}
                />
              </div>

              {/* Place of work */}
              <div className="col-span-2">
                <label className="block text-[13px] font-medium text-[#2B2B2B] mb-[6px]">
                  Place of work
                </label>
                <input
                  type="text"
                  className={`h-[36px] w-full px-[12px] text-[13px] border rounded-[4px] ${
                    leaveBlank 
                      ? 'bg-[#F5F5F5] text-[#9B9B9B] border-[#CFCFCF] cursor-not-allowed' 
                      : 'bg-white border-[#CFCFCF] focus:border-[#1A7F37]'
                  }`}
                  value={placeOfWork}
                  onChange={(e) => setPlaceOfWork(e.target.value)}
                  disabled={leaveBlank}
                />
              </div>
            </div>

            {/* Checkbox: Leave blank */}
            <div className="mt-[16px] flex items-center">
              <input
                type="checkbox"
                id="leaveBlank"
                className="w-[16px] h-[16px] border border-[#CFCFCF] rounded-[3px] text-[#1A7F37] focus:ring-[#1A7F37]"
                checked={leaveBlank}
                onChange={(e) => setLeaveBlank(e.target.checked)}
              />
              <label htmlFor="leaveBlank" className="ml-[8px] text-[13px] text-[#2B2B2B]">
                Leave blank
              </label>
            </div>
          </div>
        )}
      </div>
      
      {/* Collection Section */}
      <div className="w-full bg-white p-[12px_12px_14px_12px] mb-[12px] border-b border-[#E6E6E6]">
        {/* Section Header (Collapsible) */}
        <div 
          className="h-[36px] py-[6px] px-[8px] flex items-center justify-between cursor-pointer"
          onClick={() => setCollectionExpanded(!collectionExpanded)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? setCollectionExpanded(!collectionExpanded) : null}
          aria-expanded={collectionExpanded}
        >
          <h3 className="text-[14px] font-bold text-[#2E2E2E] leading-[20px]">
            Collection
          </h3>
          <svg 
            className={`w-[14px] h-[14px] text-[#1A7F37] transition-transform duration-200 ${collectionExpanded ? 'rotate-90' : 'rotate-0'}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        
        {/* Content Area (Expanded State) */}
        {collectionExpanded && (
          <div className="pt-[10px] space-y-[12px]">
            {/* Field 1 - Collectum - ITP */}
            <div>
              <label className="block text-[12px] text-[#4A4A4A] mb-[4px]">
                Collectum - ITP
              </label>
              <div className="inline-flex h-[28px] border border-[#CFCFCF] rounded-[4px]">
                <button
                  className={`w-[56px] h-[28px] text-[12px] font-medium border-none ${collectumITP === 'yes' ? 'bg-[#E0E0E0] text-[#4A4A4A]' : 'bg-white text-[#2E2E2E]'}`}
                  onClick={() => setCollectumITP('yes')}
                >
                  Yes
                </button>
                <button
                  className={`w-[56px] h-[28px] text-[12px] font-medium border-l border-[#CFCFCF] ${collectumITP === 'no' ? 'bg-[#E0E0E0] text-[#4A4A4A]' : 'bg-white text-[#2E2E2E]'}`}
                  onClick={() => setCollectumITP('no')}
                >
                  No
                </button>
              </div>
            </div>
            
            {/* Field 2 - Different type */}
            <div>
              <label className="block text-[12px] text-[#4A4A4A] mb-[4px]">
                Different type
              </label>
              <div className="inline-flex h-[28px] border border-[#CFCFCF] rounded-[4px]">
                <button
                  className={`w-[56px] h-[28px] text-[12px] font-medium border-none ${differentType === 'yes' ? 'bg-[#E0E0E0] text-[#4A4A4A]' : 'bg-white text-[#2E2E2E]'}`}
                  onClick={() => setDifferentType('yes')}
                >
                  Yes
                </button>
                <button
                  className={`w-[56px] h-[28px] text-[12px] font-medium border-l border-[#CFCFCF] ${differentType === 'no' ? 'bg-[#E0E0E0] text-[#4A4A4A]' : 'bg-white text-[#2E2E2E]'}`}
                  onClick={() => setDifferentType('no')}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Divider (Bottom of Section) */}
        <div className="mt-[14px] h-[1px] bg-[#EAEAEA]"></div>
      </div>
      
      {/* Forums Section */}
      <div className="w-full bg-white p-[12px_12px_16px_12px] border-b border-[#E6E6E6]">
        {/* Section Header (Collapsible) */}
        <div 
          className="h-[36px] flex items-center gap-[6px] cursor-pointer"
          onClick={() => setForumsExpanded(!forumsExpanded)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? setForumsExpanded(!forumsExpanded) : null}
          aria-expanded={forumsExpanded}
        >
          <svg 
            className={`w-[14px] h-[14px] text-[#1A7F37] transition-transform duration-200 ${forumsExpanded ? 'rotate-0' : '-rotate-90'}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          <h3 className="text-[14px] font-bold text-[#2E2E2E]">
            Forums
          </h3>
        </div>
        
        {/* Content Area (Expanded State) */}
        {forumsExpanded && (
          <div className="grid grid-cols-1 gap-[14px] mt-[10px]">
            {/* Monthly Reporting (Left Block) */}
            <div>
              <h4 className="text-[13px] font-bold text-[#2E2E2E] mb-[8px]">
                Monthly reporting
              </h4>
              
              <div className="flex items-center gap-[8px] mb-[12px]">
                <div className="flex-1">
                  <div className="flex items-center gap-[4px] mb-[4px]">
                    <label className="text-[12px] text-[#2E2E2E]">Start date *</label>
                    <select
                      className="h-[28px] w-full px-[8px] text-[12px] border border-[#CFCFCF] rounded-[3px] bg-white"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    >
                      <option value="">Not drawn</option>
                    </select>
                  </div>
                </div>
                <button className="h-[28px] px-[12px] bg-[#D0D0D0] text-white text-[12px] rounded-[14px] flex items-center gap-[4px]">
                  <svg className="w-[12px] h-[12px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Change
                </button>
              </div>
              
              {/* Optional Checkboxes */}
              <div className="mb-[8px]">
                <label className="text-[12px] text-[#6F6F6F] block mb-[6px]">Optional</label>
                <div className="flex items-center gap-[12px]">
                  <label className="flex items-center gap-[4px]">
                    <input
                      type="checkbox"
                      className="w-[14px] h-[14px] border border-[#CFCFCF] text-[#1A7F37]"
                      checked={asl65Checked}
                      onChange={(e) => setAsl65Checked(e.target.checked)}
                    />
                    <span className="text-[12px]">ASL65</span>
                  </label>
                  <label className="flex items-center gap-[4px]">
                    <input
                      type="checkbox"
                      className="w-[14px] h-[14px] border border-[#CFCFCF] text-[#1A7F37]"
                      checked={kp65Checked}
                      onChange={(e) => setKp65Checked(e.target.checked)}
                    />
                    <span className="text-[12px]">KP65</span>
                  </label>
                </div>
              </div>
              
              <a href="#" className="text-[12px] text-[#1A73E8] no-underline hover:underline">
                Read more at Fora.se
              </a>
            </div>
            
            {/* Annual Reporting (Right Block) */}
            <div>
              <h4 className="text-[13px] font-bold text-[#2E2E2E] mb-[8px]">
                Annual reporting
              </h4>
              
              <div className="mb-[8px]">
                <label className="text-[12px] text-[#2E2E2E] block mb-[4px]">Forum type</label>
                <select
                  className="h-[28px] w-full px-[8px] text-[12px] border border-[#CFCFCF] rounded-[3px] bg-white"
                  value={annualReporting}
                  onChange={(e) => setAnnualReporting(e.target.value)}
                >
                  <option value="Not signed">Not signed</option>
                </select>
              </div>
              
              <a href="#" className="text-[12px] text-[#1A73E8] no-underline hover:underline">
                Read more on fora.se
              </a>
            </div>
          </div>
        )}
      </div>
      
      {/* Statistics Section */}
      <div className="w-full bg-white p-[12px_12px_16px_12px] border-b border-[#E6E6E6]">
        {/* Section Header (Collapsible) */}
        <div 
          className="h-[36px] flex items-center gap-[6px] cursor-pointer"
          onClick={() => setStatisticsExpanded(!statisticsExpanded)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? setStatisticsExpanded(!statisticsExpanded) : null}
          aria-expanded={statisticsExpanded}
        >
          <svg 
            className={`w-[14px] h-[14px] text-[#1A7F37] transition-transform duration-200 ${statisticsExpanded ? 'rotate-0' : '-rotate-90'}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          <h3 className="text-[14px] font-bold text-[#2E2E2E]">
            Statistics
          </h3>
        </div>
        
        {/* Content Area (Expanded State) */}
        {statisticsExpanded && (
          <div className="space-y-[12px] mt-[10px]">
            {/* Category Payroll Mapping */}
            <div>
              <label className="text-[12px] text-[#2E2E2E] block mb-[4px]">Category payroll mapping</label>
              <input
                type="text"
                className="h-[28px] w-full px-[8px] text-[12px] border border-[#CFCFCF] rounded-[3px]"
                value={categoryPayroll}
                onChange={(e) => setCategoryPayroll(e.target.value)}
                placeholder=""
              />
            </div>
            
            {/* Workplace number / CFAR */}
            <div>
              <label className="text-[12px] text-[#2E2E2E] block mb-[4px]">Workplace number / CFAR</label>
              <input
                type="text"
                className="h-[28px] w-full px-[8px] text-[12px] border border-[#CFCFCF] rounded-[3px]"
                value={workplaceNumberStat}
                onChange={(e) => setWorkplaceNumberStat(e.target.value)}
                placeholder=""
              />
            </div>
            
            {/* Weekend Salary (Toggle) */}
            <div>
              <label className="text-[12px] text-[#2E2E2E] block mb-[4px]">Weekend salary</label>
              <div className="inline-flex h-[28px] border border-[#CFCFCF] rounded-[4px]">
                <button
                  className={`w-[56px] h-[28px] text-[12px] font-medium border-none ${weekendSalary === 'yes' ? 'bg-[#E0E0E0] text-[#4A4A4A]' : 'bg-white text-[#2E2E2E]'}`}
                  onClick={() => setWeekendSalary('yes')}
                >
                  Yes
                </button>
                <button
                  className={`w-[56px] h-[28px] text-[12px] font-medium border-l border-[#CFCFCF] ${weekendSalary === 'no' ? 'bg-[#E0E0E0] text-[#4A4A4A]' : 'bg-white text-[#2E2E2E]'}`}
                  onClick={() => setWeekendSalary('no')}
                >
                  No
                </button>
              </div>
            </div>
            
            {/* Working Time Type (Dropdown) */}
            <div>
              <label className="text-[12px] text-[#2E2E2E] block mb-[4px]">Working time type</label>
              <select
                className="h-[28px] w-full px-[8px] text-[12px] border border-[#CFCFCF] rounded-[3px] bg-white"
                value={workingTimeType}
                onChange={(e) => setWorkingTimeType(e.target.value)}
              >
                <option value="">Select type</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Outside Section */}
      <div className="w-full bg-white p-[12px_12px_16px_12px] border-b border-[#E6E6E6]">
        {/* Section Header (Accordion) */}
        <div 
          className="h-[36px] flex items-center gap-[6px] cursor-pointer"
          onClick={() => setOutsideExpanded(!outsideExpanded)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? setOutsideExpanded(!outsideExpanded) : null}
          aria-expanded={outsideExpanded}
        >
          <svg 
            className={`w-[14px] h-[14px] text-[#1A7F37] transition-transform duration-200 ${outsideExpanded ? 'rotate-0' : '-rotate-90'}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          <h3 className="text-[14px] font-bold text-[#2E2E2E]">
            Outside
          </h3>
        </div>
        
        {/* Content Layout (XS Responsive) */}
        {outsideExpanded && (
          <div className="grid grid-cols-1 gap-[16px] mt-[10px]">
            {/* Monthly Reporting Block */}
            <div>
              <h4 className="text-[13px] font-bold text-[#2E2E2E] mb-[8px]">
                Monthly reporting
              </h4>
              
              <div className="flex items-center gap-[8px] mb-[12px]">
                <div className="flex-1">
                  <div className="flex items-center gap-[4px] mb-[4px]">
                    <label className="text-[12px] text-[#2E2E2E]">Start date *</label>
                    <select
                      className="h-[28px] w-full px-[8px] text-[12px] border border-[#CFCFCF] rounded-[3px] bg-white"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    >
                      <option value="">Not drawn</option>
                    </select>
                  </div>
                </div>
                <button className="h-[28px] px-[12px] bg-[#CFCFCF] text-white text-[12px] rounded-[14px] flex items-center gap-[4px] opacity-60 cursor-not-allowed" disabled>
                  <svg className="w-[12px] h-[12px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Change
                </button>
              </div>
              
              {/* Optional Section */}
              <div className="mb-[8px]">
                <label className="text-[12px] text-[#6F6F6F] block mb-[4px]">Optional</label>
                <div className="flex items-center gap-[12px]">
                  <label className="flex items-center gap-[4px]">
                    <input
                      type="checkbox"
                      className="w-[14px] h-[14px] border border-[#CFCFCF] rounded-[2px] text-[#1A7F37]"
                      checked={asl65Checked}
                      onChange={(e) => setAsl65Checked(e.target.checked)}
                    />
                    <span className="text-[12px] text-[#9E9E9E]">ASL65</span>
                  </label>
                  <label className="flex items-center gap-[4px]">
                    <input
                      type="checkbox"
                      className="w-[14px] h-[14px] border border-[#CFCFCF] rounded-[2px] text-[#1A7F37]"
                      checked={kp65Checked}
                      onChange={(e) => setKp65Checked(e.target.checked)}
                    />
                    <span className="text-[12px] text-[#9E9E9E]">KP65</span>
                  </label>
                </div>
              </div>
              
              <a href="#" className="text-[12px] text-[#1A73E8] no-underline hover:underline">
                Read more at Fora.se
              </a>
            </div>
            
            {/* Annual Reporting Block */}
            <div>
              <h4 className="text-[13px] font-bold text-[#2E2E2E] mb-[8px]">
                Annual reporting
              </h4>
              
              <div className="mb-[8px]">
                <label className="text-[12px] text-[#2E2E2E] block mb-[4px]">Fora type</label>
                <select
                  className="h-[28px] w-full px-[8px] text-[12px] border border-[#CFCFCF] rounded-[3px] bg-white"
                  value={outsideAnnualReporting}
                  onChange={(e) => setOutsideAnnualReporting(e.target.value)}
                >
                  <option value="Not signed">Not signed</option>
                </select>
              </div>
              
              <a href="#" className="text-[12px] text-[#1A73E8] no-underline hover:underline">
                Read more on fora.se
              </a>
            </div>
          </div>
        )}
      </div>
      
      {/* SCB Salary Structure Statistics (SLP) Section */}
      <div className="w-full bg-white p-[12px_12px_16px_12px] border-b border-[#E6E6E6]">
        {/* Section Header (Collapsible) */}
        <div 
          className="h-[36px] flex items-center gap-[6px] cursor-pointer"
          onClick={() => setGlobalRulesExpanded(!globalRulesExpanded)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? setGlobalRulesExpanded(!globalRulesExpanded) : null}
          aria-expanded={globalRulesExpanded}
        >
          <svg 
            className={`w-[14px] h-[14px] text-[#1A7F37] transition-transform duration-200 ${globalRulesExpanded ? 'rotate-0' : '-rotate-90'}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          <h3 className="text-[14px] font-bold text-[#2E2E2E]">
            SCB Salary Structure Statistics (SLP)
          </h3>
        </div>
        
        {/* Content Area (Expanded State) */}
        {globalRulesExpanded && (
          <div className="space-y-[12px] mt-[10px]">
            {/* Include (Yes / No Toggle) */}
            <div className="mb-[8px]">
              <label className="text-[12px] text-[#2E2E2E] block mb-[4px]">Include</label>
              <div className="inline-flex h-[28px] border border-[#CFCFCF] rounded-[4px]">
                <button
                  className={`w-[56px] h-[28px] text-[12px] font-medium border-none ${scbSalaryInclude === 'yes' ? 'bg-white text-[#2E2E2E]' : 'bg-[#E5E5E5] text-[#9E9E9E]'}`}
                  onClick={() => setScbSalaryInclude('yes')}
                >
                  Yes
                </button>
                <button
                  className={`w-[56px] h-[28px] text-[12px] font-medium border-l border-[#CFCFCF] ${scbSalaryInclude === 'no' ? 'bg-white text-[#2E2E2E]' : 'bg-[#E5E5E5] text-[#9E9E9E]'}`}
                  onClick={() => setScbSalaryInclude('no')}
                >
                  No
                </button>
              </div>
            </div>
            
            {/* Occupational code (SSYK 2012) */}
            <div>
              <label className="text-[12px] text-[#2E2E2E] block mb-[4px]">Occupational code (SSYK 2012)</label>
              <input
                type="text"
                className="h-[28px] w-[200px] px-[8px] text-[12px] border border-[#CFCFCF] rounded-[3px]"
                value={occupationalCodeSSYK}
                onChange={(e) => setOccupationalCodeSSYK(e.target.value)}
                placeholder=""
              />
            </div>
          </div>
        )}
      </div>
      
      {/* SN Salary Statistics Section */}
      <div className="w-full bg-white p-[12px_12px_16px_12px] border-b border-[#E6E6E6]">
        {/* Section Header (Collapsible) */}
        <div 
          className="h-[36px] flex items-center gap-[6px] cursor-pointer"
          onClick={() => setStatisticsExpanded(!statisticsExpanded)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? setStatisticsExpanded(!statisticsExpanded) : null}
          aria-expanded={statisticsExpanded}
        >
          <svg 
            className={`w-[14px] h-[14px] text-[#1A7F37] transition-transform duration-200 ${statisticsExpanded ? 'rotate-0' : '-rotate-90'}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          <h3 className="text-[14px] font-bold text-[#2E2E2E]">
            SN Salary Statistics
          </h3>
        </div>
        
        {/* Content Area (Expanded State) */}
        {statisticsExpanded && (
          <div className="space-y-[12px] mt-[10px]">
            {/* Include Toggle */}
            <div className="mb-[8px]">
              <label className="text-[12px] text-[#2E2E2E] block mb-[4px]">Include</label>
              <div className="inline-flex h-[28px] border border-[#CFCFCF] rounded-[4px]">
                <button
                  className={`w-[56px] h-[28px] text-[12px] font-medium border-none ${snSalaryInclude === 'yes' ? 'bg-white text-[#2E2E2E]' : 'bg-[#E5E5E5] text-[#9E9E9E]'}`}
                  onClick={() => setSnSalaryInclude('yes')}
                >
                  Yes
                </button>
                <button
                  className={`w-[56px] h-[28px] text-[12px] font-medium border-l border-[#CFCFCF] ${snSalaryInclude === 'no' ? 'bg-white text-[#2E2E2E]' : 'bg-[#E5E5E5] text-[#9E9E9E]'}`}
                  onClick={() => setSnSalaryInclude('no')}
                >
                  No
                </button>
              </div>
            </div>
            
            {/* Input Fields (XS Stack) */}
            <div className="space-y-[8px]">
              {/* Occupational code (NYK 14) */}
              <div>
                <label className="text-[12px] text-[#2E2E2E] block mb-[4px]">Occupational code (NYK 14)</label>
                <input
                  type="text"
                  className="h-[28px] w-[200px] px-[8px] text-[12px] border border-[#CFCFCF] rounded-[3px]"
                  value={occupationalCodeNYK}
                  onChange={(e) => setOccupationalCodeNYK(e.target.value)}
                  placeholder=""
                />
              </div>
              
              {/* Work place number */}
              <div>
                <label className="text-[12px] text-[#2E2E2E] block mb-[4px]">Work place number</label>
                <input
                  type="text"
                  className="h-[28px] w-[200px] px-[8px] text-[12px] border border-[#CFCFCF] rounded-[3px]"
                  value={workplaceNumber}
                  onChange={(e) => setWorkplaceNumber(e.target.value)}
                  placeholder=""
                />
              </div>
              
              {/* Federation number White-collars */}
              <div>
                <label className="text-[12px] text-[#2E2E2E] block mb-[4px]">Federation number White-collars</label>
                <input
                  type="text"
                  className="h-[28px] w-full px-[8px] text-[12px] border border-[#CFCFCF] rounded-[3px]"
                  value={federationNumber}
                  onChange={(e) => setFederationNumber(e.target.value)}
                  placeholder=""
                />
              </div>
              
              {/* White-collar contract code */}
              <div>
                <label className="text-[12px] text-[#2E2E2E] block mb-[4px]">White-collar contract code</label>
                <input
                  type="text"
                  className="h-[28px] w-full px-[8px] text-[12px] border border-[#CFCFCF] rounded-[3px]"
                  value={contractCode}
                  onChange={(e) => setContractCode(e.target.value)}
                  placeholder=""
                />
              </div>
              
              {/* Job status (Dropdown) */}
              <div>
                <label className="text-[12px] text-[#2E2E2E] block mb-[4px]">Job status</label>
                <div className="relative">
                  <select
                    className="h-[28px] w-full px-[8px] pr-[28px] text-[12px] border border-[#CFCFCF] rounded-[3px] bg-white appearance-none"
                    value={jobStatus}
                    onChange={(e) => setJobStatus(e.target.value)}
                  >
                    <option value="Other employees">Other employees</option>
                    <option value="Manager">Manager</option>
                    <option value="Worker">Worker</option>
                    <option value="Trainee">Trainee</option>
                  </select>
                  <div className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#6F6F6F] pointer-events-none">
                    ▶
                  </div>
                </div>
              </div>
              
              {/* Hourly paid employee to be reported in field 13 (Toggle) */}
              <div>
                <label className="text-[12px] text-[#2E2E2E] block mb-[4px]">Hourly paid employee to be reported in field 13</label>
                <div className="inline-flex h-[28px] border border-[#CFCFCF] rounded-[4px]">
                  <button
                    className={`w-[56px] h-[28px] text-[12px] font-medium border-none ${hourlyPaidEmployee === 'yes' ? 'bg-white text-[#2E2E2E]' : 'bg-[#E5E5E5] text-[#9E9E9E]'}`}
                    onClick={() => setHourlyPaidEmployee('yes')}
                  >
                    Yes
                  </button>
                  <button
                    className={`w-[56px] h-[28px] text-[12px] font-medium border-l border-[#CFCFCF] ${hourlyPaidEmployee === 'no' ? 'bg-white text-[#2E2E2E]' : 'bg-[#E5E5E5] text-[#9E9E9E]'}`}
                    onClick={() => setHourlyPaidEmployee('no')}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* SCB Short-term Statistics (KLP) Section */}
      <div className="w-full bg-white p-[12px_12px_16px_12px] border-b border-[#E6E6E6]">
        {/* Section Header (Collapsible) */}
        <div 
          className="h-[36px] flex items-center gap-[6px] cursor-pointer"
          onClick={() => setOutsideExpanded(!outsideExpanded)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? setOutsideExpanded(!outsideExpanded) : null}
          aria-expanded={outsideExpanded}
        >
          <svg 
            className={`w-[14px] h-[14px] text-[#1A7F37] transition-transform duration-200 ${outsideExpanded ? 'rotate-0' : '-rotate-90'}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          <h3 className="text-[14px] font-bold text-[#2E2E2E]">
            SCB Short-term Statistics (KLP)
          </h3>
        </div>
        
        {/* Content Area (Expanded State) */}
        {outsideExpanded && (
          <div className="space-y-[12px] mt-[10px]">
            {/* Include (KLP) Toggle */}
            <div>
              <label className="text-[12px] text-[#2E2E2E] block mb-[4px]">Include (KLP)</label>
              <div className="inline-flex h-[28px] w-full border border-[#CFCFCF] rounded-[4px]">
                <button
                  className={`w-[56px] h-[28px] text-[12px] font-medium border-none ${scbShortTermInclude === 'yes' ? 'bg-white text-[#2E2E2E]' : 'bg-[#E5E5E5] text-[#9E9E9E]'}`}
                  onClick={() => setScbShortTermInclude('yes')}
                >
                  Yes
                </button>
                <button
                  className={`w-[56px] h-[28px] text-[12px] font-medium border-l border-[#CFCFCF] ${scbShortTermInclude === 'no' ? 'bg-white text-[#2E2E2E]' : 'bg-[#E5E5E5] text-[#9E9E9E]'}`}
                  onClick={() => setScbShortTermInclude('no')}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-[64px] bg-white border-t border-[#E0E0E0] flex justify-between items-center px-[24px] z-[1000]">
        <button 
          className="h-[36px] px-[20px] bg-[#D6D6D6] text-white text-[13px] font-bold rounded-[18px] cursor-not-allowed"
          disabled
          aria-label="Delete record"
        >
          Delete
        </button>
        <div className="flex items-center space-x-[12px]">
          <button 
            className="h-[36px] px-[20px] bg-[#8E8E8E] text-white text-[13px] font-bold rounded-[18px] cursor-pointer"
            aria-label="Cancel changes"
          >
            Cancel
          </button>
          <button 
            className="h-[36px] px-[22px] bg-[#007A33] text-white text-[13px] font-bold rounded-[18px] cursor-pointer hover:bg-[#00662A]"
            aria-label="Save changes"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;