import React, { useState } from 'react';

const HolidayTab = () => {
  const [activeRule, setActiveRule] = useState<'equal' | 'percent'>('equal');
  const [activeRule2, setActiveRule2] = useState<'equal' | 'percent'>('equal');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isExpanded2, setIsExpanded2] = useState(true);
  const [financialSummaryExpanded, setFinancialSummaryExpanded] = useState(true);
  const [variableSupplementExpanded, setVariableSupplementExpanded] = useState(true);
  const [holidayAdvanceExpanded, setHolidayAdvanceExpanded] = useState(true);
  const [settingsExpanded, setSettingsExpanded] = useState(true);
  const [includedInHolidayCalc, setIncludedInHolidayCalc] = useState(true);
  const [soleCustody, setSoleCustody] = useState(true);
  const [calculateAmountOnly, setCalculateAmountOnly] = useState(false);
  const [formData, setFormData] = useState({
    startDay: '',
    calculatedTo: '',
    holidayEntitlement: '',
    totalHolidayPayTotal: '',
    totalHolidayPayPaid: '',
    variableSupplementTotal: '',
    variableSupplementPaid: '',
    holidayAdvanceDebt: '',
    holidayAdvancePaid: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
  };

  const handleDelete = () => {
    console.log('Delete clicked');
  };

  return (
    <div className="bg-[#F7F7F7] p-[16px] pb-[80px] font-sans text-[12px]" style={{ fontFamily: 'Inter, Roboto, system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="bg-white mb-[16px]">
        {/* Current Holiday Year Section */}
        <div className="p-0 mb-[16px] bg-white">
          <h3 className="text-[13px] font-semibold text-[#2E2E2E] mb-[12px]">Current holiday year</h3>
          
          {/* Rule Toggle Group */}
          <div className="inline-flex mb-[16px]">
            <button
              className={`h-[28px] min-w-[140px] px-[12px] text-[12px] border border-[#DADCE0] rounded-l-[4px] ${activeRule === 'equal' ? 'bg-white text-[#2E2E2E] font-medium' : 'bg-[#E6E6E6] text-[#7A7A7A] font-normal'}`}
              onClick={() => setActiveRule('equal')}
            >
              Equal pay rule
            </button>
            <button
              className={`h-[28px] min-w-[140px] px-[12px] text-[12px] border border-[#DADCE0] rounded-r-[4px] ${activeRule === 'percent' ? 'bg-white text-[#2E2E2E] font-medium' : 'bg-[#E6E6E6] text-[#7A7A7A] font-normal'}`}
              onClick={() => setActiveRule('percent')}
            >
              Percent rule
            </button>
            <div className="w-[14px] h-[14px] rounded-full bg-[#1A73E8] flex items-center justify-center text-white text-[10px] ml-[8px] cursor-pointer align-middle">
              ?
            </div>
          </div>
          
          {/* Fields Layout */}
          <div>
            <div className="flex gap-[16px] mb-[12px]">
              {/* Start Day Field */}
              <div>
                <label className="block text-[11px] text-[#5F6368] mb-[4px]">
                  Start day
                </label>
                <input
                  type="date"
                  name="startDay"
                  value={formData.startDay}
                  onChange={handleChange}
                  className="h-[28px] w-[220px] px-[8px] py-[4px] border border-[#DADCE0] rounded-[4px] bg-white text-[12px] text-[#2E2E2E] focus:border-[#1A73E8] hover:border-[#BDBDBD]"
                />
              </div>
              
              {/* Calculated To Field */}
              <div>
                <label className="block text-[11px] text-[#5F6368] mb-[4px]">
                  Calculated to
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="calculatedTo"
                    value={formData.calculatedTo}
                    onChange={handleChange}
                    className="h-[28px] w-[220px] px-[8px] pr-[32px] py-[4px] border border-[#DADCE0] rounded-[4px] text-[12px] focus:border-[#1A73E8] hover:border-[#BDBDBD]"
                  />
                  <div className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[14px] text-[#9E9E9E] pointer-events-none">📅</div>
                </div>
              </div>
            </div>
            
            {/* Holiday Entitlement Field - On next line */}
            <div>
              <label className="block text-[11px] text-[#5F6368] mb-[4px]">
                Holiday entitlement
              </label>
              <input
                type="number"
                name="holidayEntitlement"
                value={formData.holidayEntitlement}
                onChange={handleChange}
                className="h-[28px] w-[120px] px-[8px] py-[4px] border border-[#DADCE0] rounded-[4px] text-[12px] text-right text-[#9E9E9E] bg-white focus:border-[#1A73E8] hover:border-[#BDBDBD]"
                placeholder="0"
              />
            </div>
          </div>
        </div>
        
        {/* Holidays Table Section */}
        <div className="p-0 mb-[16px] bg-white">
          <h3 className="text-[13px] font-semibold text-[#2E2E2E] mb-[8px]">Holidays</h3>
          
          <div className="bg-white border border-[#E0E0E0] rounded-[8px] overflow-hidden inline-block">
            <table className="table-fixed border-collapse" style={{ borderSpacing: 0 }}>
              <thead>
                <tr className="h-[36px]">
                  <th className="w-[160px] text-[11px] font-semibold uppercase text-[#3C4043] bg-white px-[10px] py-[8px] border-b-[2px] border-[#BDBDBD] text-left align-middle rounded-tl-[8px]">
                    Label
                  </th>
                  <th className="w-[120px] text-[11px] font-semibold uppercase text-[#3C4043] bg-white px-[10px] py-[8px] border-b-[2px] border-[#BDBDBD] border-l border-[#E0E0E0] text-right align-middle">
                    Salary per day
                  </th>
                  <th className="w-[120px] text-[11px] font-semibold uppercase text-[#3C4043] bg-white px-[10px] py-[8px] border-b-[2px] border-[#BDBDBD] border-l border-[#E0E0E0] text-right align-middle">
                    Number of days
                  </th>
                  <th className="w-[130px] text-[11px] font-semibold uppercase text-[#3C4043] bg-white px-[10px] py-[8px] border-b-[2px] border-[#BDBDBD] border-l border-[#E0E0E0] text-right align-middle">
                    Registered days
                  </th>
                  <th className="w-[110px] text-[11px] font-semibold uppercase text-[#3C4043] bg-white px-[10px] py-[8px] border-b-[2px] border-[#BDBDBD] border-l border-[#E0E0E0] text-right align-middle">
                    Paid days
                  </th>
                  <th className="w-[130px] text-[11px] font-semibold uppercase text-[#3C4043] bg-white px-[10px] py-[8px] border-b-[2px] border-[#BDBDBD] border-l border-[#E0E0E0] text-right align-middle">
                    Remaining days
                  </th>
                  <th className="w-[140px] text-[11px] font-semibold uppercase text-[#3C4043] bg-white px-[10px] py-[8px] border-b-[2px] border-[#BDBDBD] border-l border-[#E0E0E0] text-right align-middle rounded-tr-[8px]">
                    Employment rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Paid days row */}
                <tr className="h-[36px] hover:bg-[#F8F9FA] border-b border-[#E0E0E0]">
                  <td className="text-[12px] font-medium text-[#2E2E2E] pl-[16px] pr-[10px] py-[8px] align-middle">
                    Paid days
                  </td>
                  <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#000000] font-medium px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#000000] font-semibold px-[10px] py-[8px] text-right align-middle">
                    100,00
                  </td>
                </tr>
                
                {/* Saved days row */}
                <tr className="h-[36px] hover:bg-[#F8F9FA] border-b border-[#E0E0E0]">
                  <td className="text-[12px] font-medium text-[#2E2E2E] pl-[16px] pr-[10px] py-[8px] align-middle">
                    Saved days
                  </td>
                  <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#000000] font-medium px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#000000] font-semibold px-[10px] py-[8px] text-right align-middle">
                    100,00
                  </td>
                </tr>
                
                {/* Unpaid days row */}
                <tr className="h-[36px] hover:bg-[#F8F9FA] border-b border-[#E0E0E0]">
                  <td className="text-[12px] font-medium text-[#2E2E2E] pl-[16px] pr-[10px] py-[8px] align-middle">
                    Unpaid days
                  </td>
                  <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#000000] font-medium px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#000000] font-semibold px-[10px] py-[8px] text-right align-middle">
                    100,00
                  </td>
                </tr>
                
                {/* Advance days row */}
                <tr className="h-[36px] hover:bg-[#F8F9FA] rounded-bl-[8px] rounded-br-[8px]">
                  <td className="text-[12px] font-medium text-[#2E2E2E] pl-[16px] pr-[10px] py-[8px] align-middle">
                    Advance days
                  </td>
                  <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#000000] font-medium px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                    0,00
                  </td>
                  <td className="text-[12px] text-[#000000] font-semibold px-[10px] py-[8px] text-right align-middle">
                    100,00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Saved Holiday Days per Qualifying Year Section */}
        <div className="mb-[16px] bg-white">
          {/* Collapsible Section Header */}
          <div 
            className="h-[40px] w-full flex items-center justify-between px-[16px] py-[12px] bg-white border-t border-[#E5E5E5] cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? setIsExpanded(!isExpanded) : null}
            aria-expanded={isExpanded}
          >
            <div className="flex items-center gap-[8px]">
              <span className="text-[14px] text-[#1A7F37]">✓</span>
              <h3 className="text-[14px] font-semibold text-[#2B2B2B]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Saved holiday days per qualifying year
              </h3>
            </div>
            <svg 
              className={`w-[10px] h-[10px] text-[#1A7F37] transition-transform duration-200 ${isExpanded ? 'rotate-90' : 'rotate-0'}`}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          
          {/* Collapsible Content */}
          <div 
            className={`overflow-hidden transition-all duration-200 ease ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="p-[12px_16px_16px] bg-white">
              <div className="bg-white border border-[#E0E0E0] rounded-[8px] overflow-hidden inline-block">
                <table className="table-fixed border-collapse" style={{ borderSpacing: 0 }}>
                  <thead>
                    <tr className="h-[36px]">
                      <th className="w-[200px] text-[11px] font-semibold uppercase text-[#3C4043] bg-white px-[10px] py-[8px] border-b-[2px] border-[#BDBDBD] text-left">
                        Label
                      </th>
                      <th className="w-[120px] text-[11px] font-semibold uppercase text-[#3C4043] bg-white px-[10px] py-[8px] border-b-[2px] border-[#BDBDBD] border-l border-[#E0E0E0] text-right">
                        Number of days
                      </th>
                      <th className="w-[140px] text-[11px] font-semibold uppercase text-[#3C4043] bg-white px-[10px] py-[8px] border-b-[2px] border-[#BDBDBD] border-l border-[#E0E0E0] text-right">
                        Registered days
                      </th>
                      <th className="w-[120px] text-[11px] font-semibold uppercase text-[#3C4043] bg-white px-[10px] py-[8px] border-b-[2px] border-[#BDBDBD] border-l border-[#E0E0E0] text-right">
                        Paid days
                      </th>
                      <th className="w-[150px] text-[11px] font-semibold uppercase text-[#3C4043] bg-white px-[10px] py-[8px] border-b-[2px] border-[#BDBDBD] border-l border-[#E0E0E0] text-right rounded-tr-[8px]">
                        Employment rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Saved days - 1 year */}
                    <tr className="h-[36px] hover:bg-[#F8F9FA] border-b border-[#E0E0E0]">
                      <td className="text-[12px] font-medium text-[#2E2E2E] pl-[16px] pr-[10px] py-[8px] align-middle">
                        Saved days - 1 year
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#000000] font-semibold px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                    </tr>
                    
                    {/* Saved days - 2 years */}
                    <tr className="h-[36px] hover:bg-[#F8F9FA] border-b border-[#E0E0E0]">
                      <td className="text-[12px] font-medium text-[#2E2E2E] pl-[16px] pr-[10px] py-[8px] align-middle">
                        Saved days - 2 years
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#000000] font-semibold px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                    </tr>
                    
                    {/* Saved days - 3 years */}
                    <tr className="h-[36px] hover:bg-[#F8F9FA] border-b border-[#E0E0E0]">
                      <td className="text-[12px] font-medium text-[#2E2E2E] pl-[16px] pr-[10px] py-[8px] align-middle">
                        Saved days - 3 years
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#000000] font-semibold px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                    </tr>
                    
                    {/* Saved days - 4 years */}
                    <tr className="h-[36px] hover:bg-[#F8F9FA] border-b border-[#E0E0E0]">
                      <td className="text-[12px] font-medium text-[#2E2E2E] pl-[16px] pr-[10px] py-[8px] align-middle">
                        Saved days - 4 years
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#000000] font-semibold px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                    </tr>
                    
                    {/* Saved days - 5 years */}
                    <tr className="h-[36px] hover:bg-[#F8F9FA] border-b border-[#E0E0E0]">
                      <td className="text-[12px] font-medium text-[#2E2E2E] pl-[16px] pr-[10px] py-[8px] align-middle">
                        Saved days - 5 years
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#000000] font-semibold px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                    </tr>
                    
                    {/* Saved days - 6+ years */}
                    <tr className="h-[36px] hover:bg-[#F8F9FA] rounded-bl-[8px] rounded-br-[8px]">
                      <td className="text-[12px] font-medium text-[#2E2E2E] pl-[16px] pr-[10px] py-[8px] align-middle">
                        Saved days - 6+ years
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#000000] font-semibold px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Holiday-entitled absence from parental leave - Register children Section */}
        <div className="mb-[16px] bg-white">
          {/* Collapsible Section Header */}
          <div 
            className="h-[40px] w-full flex items-center justify-between px-[16px] py-[12px] bg-white border-t border-[#E5E5E5] cursor-pointer"
            onClick={() => setIsExpanded2(!isExpanded2)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? setIsExpanded2(!isExpanded2) : null}
            aria-expanded={isExpanded2}
          >
            <div className="flex items-center gap-[8px]">
              <span className="text-[14px] text-[#1A7F37]">✓</span>
              <h3 className="text-[14px] font-semibold text-[#2B2B2B]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Holiday-entitled absence from parental leave - Register children
              </h3>
            </div>
            <svg 
              className={`w-[10px] h-[10px] text-[#1A7F37] transition-transform duration-200 ${isExpanded2 ? 'rotate-90' : 'rotate-0'}`}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          
          {/* Collapsible Content */}
          <div 
            className={`overflow-hidden transition-all duration-200 ease ${isExpanded2 ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="p-[12px_16px_16px] bg-white">
              <div className="bg-white border border-[#E0E0E0] rounded-[8px] overflow-hidden inline-block">
                <table className="table-fixed border-collapse" style={{ borderSpacing: 0 }}>
                  <thead>
                    <tr className="h-[36px]">
                      <th className="w-[180px] text-[11px] font-semibold uppercase text-[#3C4043] bg-white px-[10px] py-[8px] border-b-[2px] border-[#BDBDBD] text-left">
                        Children
                      </th>
                      <th className="w-[120px] text-[11px] font-semibold uppercase text-[#3C4043] bg-white px-[10px] py-[8px] border-b-[2px] border-[#BDBDBD] border-l border-[#E0E0E0] text-right">
                        Granted days
                      </th>
                      <th className="w-[180px] text-[11px] font-semibold uppercase text-[#3C4043] bg-white px-[10px] py-[8px] border-b-[2px] border-[#BDBDBD] border-l border-[#E0E0E0] text-right">
                        Ingoing withdrawn days
                      </th>
                      <th className="w-[120px] text-[11px] font-semibold uppercase text-[#3C4043] bg-white px-[10px] py-[8px] border-b-[2px] border-[#BDBDBD] border-l border-[#E0E0E0] text-right">
                        Days taken
                      </th>
                      <th className="w-[180px] text-[11px] font-semibold uppercase text-[#3C4043] bg-white px-[10px] py-[8px] border-b-[2px] border-[#BDBDBD] border-l border-[#E0E0E0] text-right">
                        Total withdrawn days
                      </th>
                      <th className="w-[44px] text-[11px] font-semibold uppercase text-[#3C4043] bg-white px-[10px] py-[8px] border-b-[2px] border-[#BDBDBD] border-l border-[#E0E0E0] text-center rounded-tr-[8px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Child row */}
                    <tr className="h-[36px] hover:bg-[#F8F9FA] border-b border-[#E0E0E0]">
                      <td className="text-[12px] font-medium text-[#2E2E2E] pl-[16px] pr-[10px] py-[8px] align-middle">
                        Child 1
                      </td>
                      <td className="text-[12px] text-[#000000] font-medium px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#000000] font-medium px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#757575] px-[10px] py-[8px] text-center align-middle">
                        <button className="w-[14px] h-[14px] hover:text-[#D32F2F] hover:bg-[#F5F5F5] flex items-center justify-center rounded">
                          🗑️
                        </button>
                      </td>
                    </tr>
                    
                    {/* Additional child rows */}
                    <tr className="h-[36px] hover:bg-[#F8F9FA] border-b border-[#E0E0E0]">
                      <td className="text-[12px] font-medium text-[#2E2E2E] pl-[16px] pr-[10px] py-[8px] align-middle">
                        Child 2
                      </td>
                      <td className="text-[12px] text-[#000000] font-medium px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#000000] font-medium px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#9E9E9E] px-[10px] py-[8px] text-right align-middle">
                        0,00
                      </td>
                      <td className="text-[12px] text-[#757575] px-[10px] py-[8px] text-center align-middle">
                        <button className="w-[14px] h-[14px] hover:text-[#D32F2F] hover:bg-[#F5F5F5] flex items-center justify-center rounded">
                          🗑️
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Financial Summary Sections */}
        {/* Total holiday pay */}
        <div className="w-full bg-white mb-[16px]">
          {/* Collapsible Section Header */}
          <div 
            className="h-[40px] w-full flex items-center justify-between px-[16px] py-[12px] bg-white border-t border-[#E5E5E5] cursor-pointer"
            onClick={() => setFinancialSummaryExpanded(!financialSummaryExpanded)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? setFinancialSummaryExpanded(!financialSummaryExpanded) : null}
            aria-expanded={financialSummaryExpanded}
          >
            <div className="flex items-center gap-[8px]">
              <span className="text-[14px] text-[#1A7F37]">✓</span>
              <h3 className="text-[14px] font-semibold text-[#2B2B2B]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Total holiday pay
              </h3>
            </div>
            <svg 
              className={`w-[10px] h-[10px] text-[#1A7F37] transition-transform duration-200 ${financialSummaryExpanded ? 'rotate-90' : 'rotate-0'}`}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          
          {/* Collapsible Content */}
          <div 
            className={`overflow-hidden transition-all duration-200 ease ${financialSummaryExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="p-[12px_16px_16px] bg-white">
              <div className="grid grid-cols-3 gap-[12px]">
                <div>
                  <label className="text-[12px] font-normal text-[#3C4043] mb-[2px] block">
                    Total
                  </label>
                  <div className="relative">
                    <select
                      className="h-[32px] w-[200px] px-[8px] py-[6px] text-[12px] font-medium text-right bg-white border border-[#CFCFCF] rounded-[4px] text-[#000000] appearance-none"
                      value={formData.totalHolidayPayTotal}
                      onChange={(e) => setFormData({...formData, totalHolidayPayTotal: e.target.value})}
                    >
                      <option value="">0,00</option>
                      <option value="1000,00">1000,00</option>
                      <option value="2000,00">2000,00</option>
                      <option value="3000,00">3000,00</option>
                    </select>
                    <div className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#6F6F6F] pointer-events-none">▼</div>
                  </div>
                </div>
                
                <div>
                  <label className="text-[12px] font-normal text-[#3C4043] mb-[2px] block">
                    Paid
                  </label>
                  <div className="relative">
                    <select
                      className="h-[32px] w-[200px] px-[8px] py-[6px] text-[12px] font-medium text-right bg-white border border-[#CFCFCF] rounded-[4px] text-[#000000] appearance-none"
                      value={formData.totalHolidayPayPaid}
                      onChange={(e) => setFormData({...formData, totalHolidayPayPaid: e.target.value})}
                    >
                      <option value="">0,00</option>
                      <option value="500,00">500,00</option>
                      <option value="1000,00">1000,00</option>
                      <option value="1500,00">1500,00</option>
                    </select>
                    <div className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#6F6F6F] pointer-events-none">▼</div>
                  </div>
                </div>
                
                <div>
                  <label className="text-[12px] font-normal text-[#3C4043] mb-[2px] block">
                    Remaining
                  </label>
                  <input
                    type="text"
                    className="h-[32px] w-[200px] px-[8px] py-[6px] text-[12px] font-medium text-right bg-[#F9F9F9] border border-[#DADADA] rounded-[4px] text-[#9E9E9E] cursor-not-allowed"
                    value={formData.totalHolidayPayTotal && formData.totalHolidayPayPaid ? 
                      (parseFloat(formData.totalHolidayPayTotal.replace(',', '.') || '0') - parseFloat(formData.totalHolidayPayPaid.replace(',', '.') || '0')).toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace('.', ',') : '0,00'}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Variable supplement */}
        <div className="w-full bg-white mb-[16px]">
          {/* Collapsible Section Header */}
          <div 
            className="h-[40px] w-full flex items-center justify-between px-[16px] py-[12px] bg-white border-t border-[#E5E5E5] cursor-pointer"
            onClick={() => setVariableSupplementExpanded(!variableSupplementExpanded)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? setVariableSupplementExpanded(!variableSupplementExpanded) : null}
            aria-expanded={variableSupplementExpanded}
          >
            <div className="flex items-center gap-[8px]">
              <span className="text-[14px] text-[#1A7F37]">✓</span>
              <h3 className="text-[14px] font-semibold text-[#2B2B2B]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Variable supplement
              </h3>
            </div>
            <svg 
              className={`w-[10px] h-[10px] text-[#1A7F37] transition-transform duration-200 ${variableSupplementExpanded ? 'rotate-90' : 'rotate-0'}`}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          
          {/* Collapsible Content */}
          <div 
            className={`overflow-hidden transition-all duration-200 ease ${variableSupplementExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="p-[12px_16px_16px] bg-white">
              <div className="grid grid-cols-3 gap-[12px]">
                <div>
                  <label className="text-[12px] font-normal text-[#3C4043] mb-[2px] block">
                    Total
                  </label>
                  <div className="relative">
                    <select
                      className="h-[32px] w-[200px] px-[8px] py-[6px] text-[12px] font-medium text-right bg-white border border-[#CFCFCF] rounded-[4px] text-[#000000] appearance-none"
                      value={formData.variableSupplementTotal}
                      onChange={(e) => setFormData({...formData, variableSupplementTotal: e.target.value})}
                    >
                      <option value="">0,00</option>
                      <option value="500,00">500,00</option>
                      <option value="1000,00">1000,00</option>
                      <option value="1500,00">1500,00</option>
                    </select>
                    <div className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#6F6F6F] pointer-events-none">▼</div>
                  </div>
                </div>
                
                <div>
                  <label className="text-[12px] font-normal text-[#3C4043] mb-[2px] block">
                    Paid
                  </label>
                  <div className="relative">
                    <select
                      className="h-[32px] w-[200px] px-[8px] py-[6px] text-[12px] font-medium text-right bg-white border border-[#CFCFCF] rounded-[4px] text-[#000000] appearance-none"
                      value={formData.variableSupplementPaid}
                      onChange={(e) => setFormData({...formData, variableSupplementPaid: e.target.value})}
                    >
                      <option value="">0,00</option>
                      <option value="250,00">250,00</option>
                      <option value="500,00">500,00</option>
                      <option value="750,00">750,00</option>
                    </select>
                    <div className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#6F6F6F] pointer-events-none">▼</div>
                  </div>
                </div>
                
                <div>
                  <label className="text-[12px] font-normal text-[#3C4043] mb-[2px] block">
                    Remaining
                  </label>
                  <input
                    type="text"
                    className="h-[32px] w-[200px] px-[8px] py-[6px] text-[12px] font-medium text-right bg-[#F9F9F9] border border-[#DADADA] rounded-[4px] text-[#9E9E9E] cursor-not-allowed"
                    value={formData.variableSupplementTotal && formData.variableSupplementPaid ? 
                      (parseFloat(formData.variableSupplementTotal.replace(',', '.') || '0') - parseFloat(formData.variableSupplementPaid.replace(',', '.') || '0')).toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace('.', ',') : '0,00'}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Holiday in advance in SEK */}
        <div className="w-full bg-white mb-[16px]">
          {/* Collapsible Section Header */}
          <div 
            className="h-[40px] w-full flex items-center justify-between px-[16px] py-[12px] bg-white border-t border-[#E5E5E5] cursor-pointer"
            onClick={() => setHolidayAdvanceExpanded(!holidayAdvanceExpanded)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? setHolidayAdvanceExpanded(!holidayAdvanceExpanded) : null}
            aria-expanded={holidayAdvanceExpanded}
          >
            <div className="flex items-center gap-[8px]">
              <span className="text-[14px] text-[#1A7F37]">✓</span>
              <h3 className="text-[14px] font-semibold text-[#2B2B2B]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Holiday in advance in SEK
              </h3>
            </div>
            <svg 
              className={`w-[10px] h-[10px] text-[#1A7F37] transition-transform duration-200 ${holidayAdvanceExpanded ? 'rotate-90' : 'rotate-0'}`}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          
          {/* Collapsible Content */}
          <div 
            className={`overflow-hidden transition-all duration-200 ease ${holidayAdvanceExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="p-[12px_16px_16px] bg-white">
              <div className="grid grid-cols-3 gap-[12px]">
                <div>
                  <label className="text-[12px] font-normal text-[#3C4043] mb-[2px] block">
                    Detailed debt
                  </label>
                  <div className="relative">
                    <select
                      className="h-[32px] w-[200px] px-[8px] py-[6px] text-[12px] font-medium text-right bg-white border border-[#CFCFCF] rounded-[4px] text-[#000000] appearance-none"
                      value={formData.holidayAdvanceDebt}
                      onChange={(e) => setFormData({...formData, holidayAdvanceDebt: e.target.value})}
                    >
                      <option value="">0,00</option>
                      <option value="1000,00">1000,00</option>
                      <option value="2000,00">2000,00</option>
                      <option value="3000,00">3000,00</option>
                    </select>
                    <div className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#6F6F6F] pointer-events-none">▼</div>
                  </div>
                </div>
                
                <div>
                  <label className="text-[12px] font-normal text-[#3C4043] mb-[2px] block">
                    Amount paid out
                  </label>
                  <div className="relative">
                    <select
                      className="h-[32px] w-[200px] px-[8px] py-[6px] text-[12px] font-medium text-right bg-white border border-[#CFCFCF] rounded-[4px] text-[#000000] appearance-none"
                      value={formData.holidayAdvancePaid}
                      onChange={(e) => setFormData({...formData, holidayAdvancePaid: e.target.value})}
                    >
                      <option value="">0,00</option>
                      <option value="500,00">500,00</option>
                      <option value="1000,00">1000,00</option>
                      <option value="1500,00">1500,00</option>
                    </select>
                    <div className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#6F6F6F] pointer-events-none">▼</div>
                  </div>
                </div>
                
                <div>
                  <label className="text-[12px] font-normal text-[#3C4043] mb-[2px] block">
                    Total debt
                  </label>
                  <input
                    type="text"
                    className="h-[32px] w-[200px] px-[8px] py-[6px] text-[12px] font-medium text-right bg-[#F9F9F9] border border-[#DADADA] rounded-[4px] text-[#9E9E9E] cursor-not-allowed"
                    value={formData.holidayAdvanceDebt && formData.holidayAdvancePaid ? 
                      (parseFloat(formData.holidayAdvanceDebt.replace(',', '.') || '0') - parseFloat(formData.holidayAdvancePaid.replace(',', '.') || '0')).toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace('.', ',') : '0,00'}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Settings for Holiday Preparation */}
      <div className="w-full bg-white mb-[16px]">
        {/* Collapsible Section Header */}
        <div 
          className="h-[40px] w-full flex items-center justify-between px-[16px] py-[12px] bg-white border-t border-[#E5E5E5] cursor-pointer"
          onClick={() => setSettingsExpanded(!settingsExpanded)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? setSettingsExpanded(!settingsExpanded) : null}
          aria-expanded={settingsExpanded}
        >
          <div className="flex items-center gap-[8px]">
            <span className="text-[14px] text-[#1A7F37]">✓</span>
            <h3 className="text-[14px] font-semibold text-[#2B2B2B]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Settings for Holiday preparation
            </h3>
          </div>
          <svg 
            className={`w-[10px] h-[10px] text-[#1A7F37] transition-transform duration-200 ${settingsExpanded ? 'rotate-90' : 'rotate-0'}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        
        {/* Collapsible Content */}
        <div 
          className={`overflow-hidden transition-all duration-200 ease ${settingsExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="p-[12px_16px_16px] bg-white">
            {/* Rule Selector (Top Toggle) */}
            <div className="inline-flex h-[32px] border border-[#CFCFCF] rounded-[4px] mb-[14px]">
              <button
                className={`w-[140px] text-[12px] font-medium ${activeRule2 === 'equal' ? 'bg-white text-black' : 'bg-[#E5E5E5] text-[#6F6F6F]'}`}
                onClick={() => setActiveRule2('equal')}
              >
                Equal pay rule
              </button>
              <button
                className={`w-[140px] text-[12px] font-medium ${activeRule2 === 'percent' ? 'bg-white text-black' : 'bg-[#E5E5E5] text-[#6F6F6F]'}`}
                onClick={() => setActiveRule2('percent')}
              >
                Percent rule
              </button>
            </div>
            
            {/* Settings Grid */}
            <div className="grid grid-cols-3 gap-[60px]">
              {/* Setting 1: Must be included in the holiday calculation */}
              <div>
                <div className="flex items-center gap-[6px] mb-[4px]">
                  <span className="text-[13px] font-normal text-[#2E2E2E]">
                    Must be included in the holiday calculation
                  </span>
                  <div className="w-[14px] h-[14px] rounded-full bg-[#1E88E5] flex items-center justify-center text-white text-[10px] cursor-help">
                    ?
                  </div>
                </div>
                <div className="inline-flex h-[30px] border border-[#CFCFCF] rounded-[4px]">
                  <button
                    className={`w-[56px] text-[12px] font-medium text-center ${includedInHolidayCalc ? 'bg-white text-black' : 'bg-[#E5E5E5] text-[#6F6F6F]'}`}
                    onClick={() => setIncludedInHolidayCalc(true)}
                  >
                    Yes
                  </button>
                  <button
                    className={`w-[56px] text-[12px] font-medium text-center ${!includedInHolidayCalc ? 'bg-white text-black' : 'bg-[#E5E5E5] text-[#6F6F6F]'}`}
                    onClick={() => setIncludedInHolidayCalc(false)}
                  >
                    No
                  </button>
                </div>
              </div>
              
              {/* Setting 2: Sole custody */}
              <div>
                <div className="flex items-center gap-[6px] mb-[4px]">
                  <span className="text-[13px] font-normal text-[#2E2E2E]">
                    Sole custody
                  </span>
                  <div className="w-[14px] h-[14px] rounded-full bg-[#1E88E5] flex items-center justify-center text-white text-[10px] cursor-help">
                    ?
                  </div>
                </div>
                <div className="inline-flex h-[30px] border border-[#CFCFCF] rounded-[4px]">
                  <button
                    className={`w-[56px] text-[12px] font-medium text-center ${soleCustody ? 'bg-white text-black' : 'bg-[#E5E5E5] text-[#6F6F6F]'}`}
                    onClick={() => setSoleCustody(true)}
                  >
                    Yes
                  </button>
                  <button
                    className={`w-[56px] text-[12px] font-medium text-center ${!soleCustody ? 'bg-white text-black' : 'bg-[#E5E5E5] text-[#6F6F6F]'}`}
                    onClick={() => setSoleCustody(false)}
                  >
                    No
                  </button>
                </div>
              </div>
              
              {/* Setting 3: Calculate only the amount, not days */}
              <div>
                <div className="flex items-center gap-[6px] mb-[4px]">
                  <span className="text-[13px] font-normal text-[#2E2E2E]">
                    Calculate only the amount, not days
                  </span>
                  <div className="w-[14px] h-[14px] rounded-full bg-[#1E88E5] flex items-center justify-center text-white text-[10px] cursor-help">
                    ?
                  </div>
                </div>
                <div className="inline-flex h-[30px] border border-[#CFCFCF] rounded-[4px]">
                  <button
                    className={`w-[56px] text-[12px] font-medium text-center ${calculateAmountOnly ? 'bg-white text-black' : 'bg-[#E5E5E5] text-[#6F6F6F]'}`}
                    onClick={() => setCalculateAmountOnly(true)}
                  >
                    Yes
                  </button>
                  <button
                    className={`w-[56px] text-[12px] font-medium text-center ${!calculateAmountOnly ? 'bg-white text-black' : 'bg-[#E5E5E5] text-[#6F6F6F]'}`}
                    onClick={() => setCalculateAmountOnly(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            onClick={handleCancel}
            aria-label="Cancel changes"
          >
            Cancel
          </button>
          <button 
            className="h-[36px] px-[22px] bg-[#007A33] text-white text-[13px] font-bold rounded-[18px] cursor-pointer hover:bg-[#00662A]"
            onClick={handleSubmit}
            aria-label="Save changes"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default HolidayTab;