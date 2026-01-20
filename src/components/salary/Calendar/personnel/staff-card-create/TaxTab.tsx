import React, { useState } from 'react';

const TaxTab = () => {
  const [formData, setFormData] = useState({
    taxTable: '',
    taxColumn: '',
    mainEmployer: '',
    automaticCalculation: 'yes',
    oneTimeAmount: '',
    oneTimeTax: '',
    employerContribution: 'yes',
    sportsperson: 'no',
    workExpenses: '',
    deductions: '',
    monthlyDeduction: ''
  });

  const [errors, setErrors] = useState({
    taxTable: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing in the tax table field
    if (name === 'taxTable') {
      setErrors(prev => ({ ...prev, taxTable: false }));
    }
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Simple validation - check if tax table is filled
    if (!formData.taxTable) {
      setErrors({ taxTable: true });
      return;
    }
    
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
  };

  const handleDelete = () => {
    console.log('Delete clicked');
  };

  return (
    <div className="bg-[#F3F3F3] p-[16px] font-sans text-[12px] leading-[16px]" style={{ fontFamily: 'Inter, Roboto, "Segoe UI", Helvetica, Arial, sans-serif' }}>
      <div className="mb-[12px]">
        <h3 className="text-[13px] font-semibold text-[#2B2B2B] mb-[12px]">Tax</h3>
        <button className="bg-[#FFC107] text-[#000000] text-[12px] font-semibold h-[30px] px-[14px] rounded-[16px] border-none hover:bg-[#FFB300] transition-colors">
          Request for tax
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-[32px]" style={{ gridTemplateColumns: '320px 260px 260px' }}>
        <div>
          <div className="mb-[14px]">
            <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
              Tax table * <span className="text-[#D32F2F] ml-[2px]">*</span>
            </label>
            <select 
              name="taxTable"
              value={formData.taxTable}
              onChange={handleChange}
              className={`w-full h-[28px] px-[8px] py-[6px] text-[12px] text-[#2B2B2B] bg-white border ${errors.taxTable ? 'border-[#F44336]' : 'border-[#DADADA]'} rounded-[4px] appearance-none`}
            >
              <option value="">Select tax table</option>
              <option value="table1">Tax Table 1</option>
              <option value="table2">Tax Table 2</option>
            </select>
          </div>
          
          <div className="mb-[14px]">
            <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
              Tax column *
            </label>
            <select 
              name="taxColumn"
              value={formData.taxColumn}
              onChange={handleChange}
              className="w-full h-[28px] px-[8px] py-[6px] text-[12px] text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px] appearance-none"
            >
              <option value="">Select tax column</option>
              <option value="column1">Column 1</option>
              <option value="column2">Column 2</option>
            </select>
          </div>
          
          <div className="mb-[14px]">
            <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
              Main employer (tax in accordance with tax table)
            </label>
            <select 
              name="mainEmployer"
              value={formData.mainEmployer}
              onChange={handleChange}
              className="w-full h-[28px] px-[8px] pr-[28px] py-[6px] text-[12px] text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px] appearance-none relative"
            >
              <option value="">Select main employer</option>
              <option value="employer1">Employer 1</option>
              <option value="employer2">Employer 2</option>
            </select>
            <div className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[12px] text-[#6F6F6F] pointer-events-none">▼</div>
          </div>
          
          <div className="mb-[14px]">
            <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
              Automatic calculation of one-time tax
            </label>
            <div className="flex items-center">
              <div className="h-[26px] border border-[#DADADA] rounded-[4px] overflow-hidden flex">
                <button
                  className={`w-[52px] text-[12px] font-medium text-center ${formData.automaticCalculation === 'yes' ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'}`}
                  onClick={() => handleRadioChange('automaticCalculation', 'yes')}
                >
                  Yes
                </button>
                <button
                  className={`w-[52px] text-[12px] font-medium text-center border-l border-[#DADADA] ${formData.automaticCalculation === 'no' ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'}`}
                  onClick={() => handleRadioChange('automaticCalculation', 'no')}
                >
                  No
                </button>
              </div>
              <div className="w-[14px] h-[14px] rounded-full bg-[#03A9F4] flex items-center justify-center text-white text-[10px] ml-[4px] cursor-pointer">
                ?
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="mb-[14px]">
            <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
              One-time amount
            </label>
            <input
              type="number"
              name="oneTimeAmount"
              value={formData.oneTimeAmount}
              onChange={handleChange}
              className="w-full h-[28px] px-[8px] py-[6px] text-[12px] text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px]"
              placeholder="0,00"
            />
          </div>
          
          <div className="mb-[14px]">
            <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
              One-time tax
            </label>
            <input
              type="number"
              name="oneTimeTax"
              value={formData.oneTimeTax}
              onChange={handleChange}
              className="w-full h-[28px] px-[8px] py-[6px] text-[12px] text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px]"
              placeholder="0,00"
            />
            <div className="mt-[4px] text-[12px] text-[#1E88E5] cursor-pointer hover:underline ml-[8px]">One-time amount</div>
          </div>
          
          <div className="mb-[14px]">
            <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
              Employer's contribution
            </label>
            <div className="flex items-center">
              <div className="h-[26px] border border-[#DADADA] rounded-[4px] overflow-hidden flex">
                <button
                  className={`w-[52px] text-[12px] font-medium text-center ${formData.employerContribution === 'yes' ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'}`}
                  onClick={() => handleRadioChange('employerContribution', 'yes')}
                >
                  Yes
                </button>
                <button
                  className={`w-[52px] text-[12px] font-medium text-center border-l border-[#DADADA] ${formData.employerContribution === 'no' ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'}`}
                  onClick={() => handleRadioChange('employerContribution', 'no')}
                >
                  No
                </button>
              </div>
            </div>
          </div>
          
          <div className="mb-[14px]">
            <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
              Sportsperson
            </label>
            <div className="flex items-center">
              <div className="h-[26px] border border-[#DADADA] rounded-[4px] overflow-hidden flex">
                <button
                  className={`w-[52px] text-[12px] font-medium text-center ${formData.sportsperson === 'yes' ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'}`}
                  onClick={() => handleRadioChange('sportsperson', 'yes')}
                >
                  Yes
                </button>
                <button
                  className={`w-[52px] text-[12px] font-medium text-center border-l border-[#DADADA] ${formData.sportsperson === 'no' ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'}`}
                  onClick={() => handleRadioChange('sportsperson', 'no')}
                >
                  No
                </button>
              </div>
              <div className="w-[14px] h-[14px] rounded-full bg-[#03A9F4] flex items-center justify-center text-white text-[10px] ml-[4px] cursor-pointer">
                ?
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="mb-[8px]">
            <h4 className="text-[12px] font-semibold text-[#2B2B2B] mb-[8px]">Employer's contribution</h4>
            
            <div className="mb-[14px]">
              <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
                Deductions for work expenses (%)
              </label>
              <input
                type="number"
                name="workExpenses"
                value={formData.workExpenses}
                onChange={handleChange}
                className="w-full h-[28px] px-[8px] py-[6px] text-[12px] text-right text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px] font-medium"
                placeholder="0,00"
              />
              <div className="w-[14px] h-[14px] rounded-full bg-[#03A9F4] flex items-center justify-center text-white text-[10px] ml-[4px] cursor-pointer mt-[4px]">
                ?
              </div>
            </div>
            
            <div className="mb-[14px]">
              <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
                Deductions
              </label>
              <input
                type="number"
                name="deductions"
                value={formData.deductions}
                onChange={handleChange}
                className="w-full h-[28px] px-[8px] py-[6px] text-[12px] text-right text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px] font-medium"
                placeholder="0,00"
              />
            </div>
            
            <div className="mb-[14px]">
              <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
                Monthly deduction
              </label>
              <input
                type="number"
                name="monthlyDeduction"
                value={formData.monthlyDeduction}
                onChange={handleChange}
                className="w-full h-[28px] px-[8px] py-[6px] text-[12px] text-right text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px] font-medium"
                placeholder="0,00"
              />
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

export default TaxTab;