import React, { useState } from 'react';

const SalaryDetailsTab = () => {
  const [expandedSections, setExpandedSections] = useState({
    salaryDetails: true,
    sickWaiting: true,
    companyCar: true,
    personalContract: true,
    standardSalary: true
  });

  const [formData, setFormData] = useState({
    baseSalary: '',
    salaryCurrency: '',
    paymentFrequency: '',
    sickWaitingEnabled: 'yes',
    companyCar: 'no',
    obAdditionSimple: '',
    obSupplementQualified: '',
    obSupplementWeekend: '',
    obSupplement4: '',
    obSupplement5: '',
    unionFee: '',
    travelCompensation: '',
    salaryTypeTable: ''
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: string, value: string) => {
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

  const renderSectionHeader = (title: string, sectionKey: keyof typeof expandedSections) => (
    <div 
      className="flex items-center cursor-pointer mb-[8px]"
      onClick={() => toggleSection(sectionKey)}
    >
      <div className={`transform transition-transform duration-200 ${expandedSections[sectionKey] ? 'rotate-180' : ''}`}>
        <span className="text-[14px] text-[#2E7D32] mr-[6px]">▼</span>
      </div>
      <h3 className="text-[12px] font-semibold text-[#2B2B2B]">{title}</h3>
      <div className="w-[14px] h-[14px] rounded-full bg-[#03A9F4] flex items-center justify-center text-white text-[10px] ml-[4px] cursor-pointer">
        ?
      </div>
    </div>
  );

  return (
    <div className="bg-[#F3F3F3] p-[16px] font-sans text-[12px] leading-[16px] text-[#2B2B2B]" style={{ fontFamily: 'Inter, Roboto, "Segoe UI", Helvetica, Arial, sans-serif' }}>
      <div className="grid grid-cols-4 gap-[32px]" style={{ gridTemplateColumns: '340px 260px 300px 300px' }}>
        {/* Salary Details Column */}
        <div>
          {renderSectionHeader('Salary details', 'salaryDetails')}
          
          {expandedSections.salaryDetails && (
            <>
              <div className="mb-[16px]">
                <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
                  Base salary *
                </label>
                <input
                  type="number"
                  name="baseSalary"
                  value={formData.baseSalary}
                  onChange={handleChange}
                  className="w-full h-[28px] px-[8px] py-[6px] text-[12px] text-right text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px]"
                  placeholder="0,00"
                />
              </div>
              
              <div className="mb-[16px]">
                <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
                  Salary currency *
                </label>
                <select 
                  name="salaryCurrency"
                  value={formData.salaryCurrency}
                  onChange={handleChange}
                  className="w-full h-[28px] px-[8px] pr-[28px] py-[6px] text-[12px] text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px] appearance-none"
                >
                  <option value="">Select</option>
                  <option value="SEK">SEK</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="NOK">NOK</option>
                </select>
                <div className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[12px] text-[#6F6F6F] pointer-events-none">▼</div>
              </div>
              
              <div className="mb-[16px]">
                <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
                  Payment frequency *
                </label>
                <select 
                  name="paymentFrequency"
                  value={formData.paymentFrequency}
                  onChange={handleChange}
                  className="w-full h-[28px] px-[8px] pr-[28px] py-[6px] text-[12px] text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px] appearance-none"
                >
                  <option value="">Select</option>
                  <option value="monthly">Monthly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="weekly">Weekly</option>
                </select>
                <div className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[12px] text-[#6F6F6F] pointer-events-none">▼</div>
              </div>
              
              <button className="bg-[#BDBDBD] text-white text-[11px] font-medium h-[28px] px-[12px] rounded-[14px] flex items-center mb-[16px]">
                <span className="mr-[6px]">✏️</span>Change salary
              </button>
            </>
          )}
        </div>
        
        {/* Change Actions Column */}
        <div>
          {renderSectionHeader('Change actions', 'sickWaiting')}
          
          {expandedSections.sickWaiting && (
            <>
              <div className="mb-[16px]">
                <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
                  Data for sick waiting in case of illness
                </label>
                <button className="bg-[#BDBDBD] text-white text-[11px] font-medium h-[28px] px-[12px] rounded-[14px] flex items-center">
                  <span className="mr-[6px]">✏️</span>Change supplement
                </button>
              </div>
            </>
          )}
        </div>
        
        {/* Sick Waiting Data Column */}
        <div>
          {renderSectionHeader('Data for sick waiting in case of illness', 'companyCar')}
          
          {expandedSections.companyCar && (
            <>
              <div className="mb-[16px]">
                <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
                  Sick waiting in case of illness
                </label>
                <div className="h-[26px] border border-[#DADADA] rounded-[4px] overflow-hidden flex">
                  <button
                    className={`w-[52px] text-[12px] font-medium text-center ${formData.sickWaitingEnabled === 'yes' ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'}`}
                    onClick={() => handleToggleChange('sickWaitingEnabled', 'yes')}
                  >
                    Yes
                  </button>
                  <button
                    className={`w-[52px] text-[12px] font-medium text-center border-l border-[#DADADA] ${formData.sickWaitingEnabled === 'no' ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'}`}
                    onClick={() => handleToggleChange('sickWaitingEnabled', 'no')}
                  >
                    No
                  </button>
                </div>
              </div>
              
              <div className="mb-[16px]">
                <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
                  Has a company car
                </label>
                <div className="h-[26px] border border-[#DADADA] rounded-[4px] overflow-hidden flex">
                  <button
                    className={`w-[52px] text-[12px] font-medium text-center ${formData.companyCar === 'yes' ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'}`}
                    onClick={() => handleToggleChange('companyCar', 'yes')}
                  >
                    Yes
                  </button>
                  <button
                    className={`w-[52px] text-[12px] font-medium text-center border-l border-[#DADADA] ${formData.companyCar === 'no' ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'}`}
                    onClick={() => handleToggleChange('companyCar', 'no')}
                  >
                    No
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Sick Waiting Values Column */}
        <div>
          {renderSectionHeader('Sick waiting values', 'personalContract')}
          
          {expandedSections.personalContract && (
            <>
              <div className="mb-[16px]">
                <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
                  Personal contract values and salary type table
                </label>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Divider */}
      <div className="h-[1px] bg-[#E0E0E0] my-[12px]"></div>
      
      {/* Personal Contract Values Section */}
      <div className="mb-[16px]">
        {renderSectionHeader('Personal contract values and salary type table', 'standardSalary')}
        
        {expandedSections.standardSalary && (
          <>
            <div className="grid grid-cols-3 gap-[16px] mb-[16px]">
              <div>
                <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
                  OB addition simple
                </label>
                <input
                  type="number"
                  name="obAdditionSimple"
                  value={formData.obAdditionSimple}
                  onChange={handleChange}
                  className="w-[200px] h-[28px] px-[8px] py-[6px] text-[12px] text-right text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px]"
                  placeholder="0,00"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
                  OB supplement qualified
                </label>
                <input
                  type="number"
                  name="obSupplementQualified"
                  value={formData.obSupplementQualified}
                  onChange={handleChange}
                  className="w-[200px] h-[28px] px-[8px] py-[6px] text-[12px] text-right text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px]"
                  placeholder="0,00"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
                  OB supplement weekend
                </label>
                <input
                  type="number"
                  name="obSupplementWeekend"
                  value={formData.obSupplementWeekend}
                  onChange={handleChange}
                  className="w-[200px] h-[28px] px-[8px] py-[6px] text-[12px] text-right text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px]"
                  placeholder="0,00"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
                  OB supplement 4
                </label>
                <input
                  type="number"
                  name="obSupplement4"
                  value={formData.obSupplement4}
                  onChange={handleChange}
                  className="w-[200px] h-[28px] px-[8px] py-[6px] text-[12px] text-right text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px]"
                  placeholder="0,00"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
                  OB supplement 5
                </label>
                <input
                  type="number"
                  name="obSupplement5"
                  value={formData.obSupplement5}
                  onChange={handleChange}
                  className="w-[200px] h-[28px] px-[8px] py-[6px] text-[12px] text-right text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px]"
                  placeholder="0,00"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
                  Union fee (%)
                </label>
                <input
                  type="number"
                  name="unionFee"
                  value={formData.unionFee}
                  onChange={handleChange}
                  className="w-[200px] h-[28px] px-[8px] py-[6px] text-[12px] text-right text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px]"
                  placeholder="0,00"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
                  Travel time compensation
                </label>
                <input
                  type="number"
                  name="travelCompensation"
                  value={formData.travelCompensation}
                  onChange={handleChange}
                  className="w-[200px] h-[28px] px-[8px] py-[6px] text-[12px] text-right text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px]"
                  placeholder="0,00"
                />
              </div>
            </div>
            
            <div className="mb-[16px]">
              <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
                Salary type table
              </label>
              <select 
                name="salaryTypeTable"
                value={formData.salaryTypeTable}
                onChange={handleChange}
                className="w-full h-[28px] px-[8px] pr-[28px] py-[6px] text-[12px] text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px] appearance-none"
              >
                <option value="">Select</option>
                <option value="table1">Salary Table 1</option>
                <option value="table2">Salary Table 2</option>
                <option value="table3">Salary Table 3</option>
              </select>
              <div className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[12px] text-[#6F6F6F] pointer-events-none">▼</div>
            </div>
          </>
        )}
      </div>
      
      {/* Standard Salary Table */}
      <div className="mb-[16px]">
        <h3 className="text-[12px] font-semibold text-[#2B2B2B] mb-[8px]">Standard salary</h3>
        <div className="bg-white border border-[#E0E0E0] rounded-[6px] overflow-hidden">
          <div className="h-[36px] bg-[#FAFAFA] border-b-[2px] border-[#BDBDBD] grid grid-cols-8">
            {['Salary type', 'Name', 'Quantity', 'Unit', 'Amount', 'Total', 'Expenses', 'VAT'].map((header) => (
              <div 
                key={header}
                className="text-[11px] font-semibold text-[#2B2B2B] uppercase px-[10px] py-[12px] flex items-center tracking-[0.5px]"
              >
                {header}
              </div>
            ))}
          </div>
          <div className="h-[36px] grid grid-cols-8 border-b border-[#EEEEEE]">
            <div className="col-span-8 text-[12px] text-[#9E9E9E] italic px-[10px] py-[10px] flex items-center">
              Select salary type
            </div>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 h-[56px] bg-white border-t border-[#E0E0E0] flex justify-between items-center px-[16px] py-[12px] shadow-[-1px_0_2px_rgba(0,0,0,0.08)]">
        <button 
          className="bg-[#BDBDBD] text-white text-[12px] h-[30px] px-[14px] rounded-[16px]"
          onClick={handleDelete}
        >
          Delete
        </button>
        <div className="flex items-center space-x-2">
          <button 
            className="bg-[#9E9E9E] text-white text-[12px] h-[30px] px-[14px] rounded-[16px]"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            className="bg-[#2E7D32] text-white text-[12px] font-semibold h-[30px] px-[16px] rounded-[16px] hover:bg-[#256428] transition-colors"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalaryDetailsTab;