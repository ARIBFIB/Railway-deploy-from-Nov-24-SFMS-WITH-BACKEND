import React, { useState } from 'react';

const EmploymentTab = () => {
  const [formData, setFormData] = useState({
    formOfEmployment: '',
    salaryForm: '',
    staffType: '',
    agreementForSalaries: '',
    employmentEnds: '',
    probationUntil: '',
    schedule: 'standard',
    accountGrossSalary: '',
    accountEmployerContributions: '',
    allocationTemplate: '',
    active: 'yes'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAllocationTemplate = () => {
    console.log('Add allocation template:', formData.allocationTemplate);
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
    <div className="bg-[#F3F3F3] p-[16px] font-sans text-[12px] leading-[16px] text-[#2B2B2B]" style={{ fontFamily: 'Inter, Roboto, "Segoe UI", Helvetica, Arial, sans-serif' }}>
      <div className="grid grid-cols-4 gap-[32px]" style={{ gridTemplateColumns: '320px 320px 260px 220px' }}>
        {/* Employment Column */}
        <div>
          <div className="mb-[10px] flex items-center">
            <h3 className="text-[12px] font-semibold text-[#2B2B2B]">Employment</h3>
            <div className="w-[14px] h-[14px] rounded-full bg-[#03A9F4] flex items-center justify-center text-white text-[10px] ml-[4px] cursor-pointer">
              ?
            </div>
          </div>
          
          <div className="mb-[14px]">
            <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
              Form of employment *
            </label>
            <select 
              name="formOfEmployment"
              value={formData.formOfEmployment}
              onChange={handleChange}
              className="w-full h-[28px] px-[8px] pr-[28px] py-[6px] text-[12px] text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px] appearance-none"
            >
              <option value="">Select</option>
              <option value="permanent">Permanent</option>
              <option value="temporary">Temporary</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
            <div className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[12px] text-[#6F6F6F] pointer-events-none">▼</div>
          </div>
          
          <div className="mb-[14px]">
            <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
              Salary form *
            </label>
            <select 
              name="salaryForm"
              value={formData.salaryForm}
              onChange={handleChange}
              className="w-full h-[28px] px-[8px] pr-[28px] py-[6px] text-[12px] text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px] appearance-none"
            >
              <option value="">Select</option>
              <option value="monthly">Monthly</option>
              <option value="hourly">Hourly</option>
              <option value="weekly">Weekly</option>
            </select>
            <div className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[12px] text-[#6F6F6F] pointer-events-none">▼</div>
          </div>
          
          <div className="mb-[14px]">
            <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
              Staff type *
            </label>
            <select 
              name="staffType"
              value={formData.staffType}
              onChange={handleChange}
              className="w-full h-[28px] px-[8px] pr-[28px] py-[6px] text-[12px] text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px] appearance-none"
            >
              <option value="">Select</option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="executive">Executive</option>
            </select>
            <div className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[12px] text-[#6F6F6F] pointer-events-none">▼</div>
          </div>
          
          <div className="mb-[14px]">
            <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
              Agreement for salaries *
            </label>
            <select 
              name="agreementForSalaries"
              value={formData.agreementForSalaries}
              onChange={handleChange}
              className="w-full h-[28px] px-[8px] pr-[28px] py-[6px] text-[12px] text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px] appearance-none"
            >
              <option value="">Select</option>
              <option value="collective">Collective</option>
              <option value="individual">Individual</option>
            </select>
            <div className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[12px] text-[#6F6F6F] pointer-events-none">▼</div>
          </div>
          
          <div className="mb-[14px]">
            <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
              Employment ends
            </label>
            <div className="relative">
              <input
                type="date"
                name="employmentEnds"
                value={formData.employmentEnds}
                onChange={handleChange}
                className="w-full h-[28px] px-[8px] pr-[28px] py-[6px] text-[12px] text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px]"
              />
              <div className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[14px] text-[#9E9E9E] pointer-events-none">📅</div>
            </div>
          </div>
          
          <div className="mb-[14px]">
            <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
              Probation until
            </label>
            <div className="relative">
              <input
                type="date"
                name="probationUntil"
                value={formData.probationUntil}
                onChange={handleChange}
                className="w-full h-[28px] px-[8px] pr-[28px] py-[6px] text-[12px] text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px]"
              />
              <div className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[14px] text-[#9E9E9E] pointer-events-none">📅</div>
            </div>
          </div>
        </div>
        
        {/* Times Column */}
        <div>
          <div className="mb-[10px] flex items-center">
            <h3 className="text-[12px] font-semibold text-[#2B2B2B]">Times</h3>
            <div className="w-[14px] h-[14px] rounded-full bg-[#03A9F4] flex items-center justify-center text-white text-[10px] ml-[4px] cursor-pointer">
              ?
            </div>
          </div>
          
          <div className="mb-[14px]">
            <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
              Schedule
            </label>
            <input
              type="text"
              value={formData.schedule}
              readOnly
              className="w-full h-[28px] px-[8px] py-[6px] text-[12px] text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px]"
            />
          </div>
          
          <div className="flex gap-[8px] mb-[14px]">
            <button className="bg-[#BDBDBD] text-white text-[11px] font-medium h-[28px] px-[12px] rounded-[14px] flex items-center">
              <span className="mr-[6px]">✏️</span>Change schedule
            </button>
            <button className="bg-[#FFC107] text-[#000000] text-[11px] font-semibold h-[28px] px-[14px] rounded-[14px] flex items-center">
              <span className="mr-[6px]">+</span>Create new
            </button>
          </div>
        </div>
        
        {/* Accounting Column */}
        <div>
          <div className="mb-[10px] flex items-center">
            <h3 className="text-[12px] font-semibold text-[#2B2B2B]">Accounting</h3>
            <div className="w-[14px] h-[14px] rounded-full bg-[#03A9F4] flex items-center justify-center text-white text-[10px] ml-[4px] cursor-pointer">
              ?
            </div>
          </div>
          
          <div className="mb-[14px]">
            <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
              Account gross salary
            </label>
            <input
              type="text"
              value={formData.accountGrossSalary}
              readOnly
              className="w-full h-[28px] px-[8px] py-[6px] text-[12px] text-right text-[#6F6F6F] bg-white border border-[#DADADA] rounded-[4px]"
              placeholder="0,00"
            />
          </div>
          
          <div className="mb-[14px]">
            <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
              Account employer's contributions
            </label>
            <input
              type="text"
              value={formData.accountEmployerContributions}
              readOnly
              className="w-full h-[28px] px-[8px] py-[6px] text-[12px] text-right text-[#6F6F6F] bg-white border border-[#DADADA] rounded-[4px]"
              placeholder="0,00"
            />
          </div>
        </div>
        
        {/* Personnel Categories Column */}
        <div>
          <div className="mb-[10px] flex items-center">
            <h3 className="text-[12px] font-semibold text-[#2B2B2B]">Personnel categories</h3>
            <div className="w-[14px] h-[14px] rounded-full bg-[#03A9F4] flex items-center justify-center text-white text-[10px] ml-[4px] cursor-pointer">
              ?
            </div>
          </div>
          
          <div className="mb-[14px]">
            <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
              Allocation template
            </label>
            <div className="flex items-center">
              <input
                type="text"
                name="allocationTemplate"
                value={formData.allocationTemplate}
                onChange={handleChange}
                className="w-[160px] h-[28px] px-[8px] py-[6px] text-[12px] text-[#2B2B2B] bg-white border border-[#DADADA] rounded-[4px]"
                placeholder="Enter template name"
              />
              <button 
                className="w-[28px] h-[28px] bg-[#FFC107] rounded-full flex items-center justify-center ml-[8px] cursor-pointer"
                onClick={handleAddAllocationTemplate}
              >
                <span className="text-[14px] text-[#000000]">+</span>
              </button>
            </div>
          </div>
          
          <div className="mb-[14px]">
            <label className="block text-[11px] font-medium text-[#4A4A4A] mb-[4px]">
              Active
            </label>
            <div className="h-[26px] border border-[#DADADA] rounded-[4px] overflow-hidden flex">
              <button
                className={`w-[52px] text-[12px] font-medium text-center ${formData.active === 'yes' ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'}`}
                onClick={() => handleToggleChange('active', 'yes')}
              >
                Yes
              </button>
              <button
                className={`w-[52px] text-[12px] font-medium text-center border-l border-[#DADADA] ${formData.active === 'no' ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'}`}
                onClick={() => handleToggleChange('active', 'no')}
              >
                No
              </button>
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

export default EmploymentTab;