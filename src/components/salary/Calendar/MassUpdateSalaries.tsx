import React, { useState } from 'react';

const MassUpdateSalaries = () => {
  const [activeTab, setActiveTab] = useState('mass-update');
  const [staffTypeFilter, setStaffTypeFilter] = useState('All');
  const [salaryFormFilter, setSalaryFormFilter] = useState('All');
  const [dateOfNewSalary, setDateOfNewSalary] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Changed', 'Unchanged'
  const [salaries, setSalaries] = useState([
    { id: '1', firstName: 'John', surname: 'Doe', staffType: 'White-collar', salaryForm: 'Monthly paid', currentSalary: '35000', newSalaryDate: '', newSalary: '' },
    { id: '2', firstName: 'Jane', surname: 'Smith', staffType: 'Blue-collar', salaryForm: 'Hourly paid', currentSalary: '25000', newSalaryDate: '', newSalary: '' },
    { id: '3', firstName: 'Robert', surname: 'Johnson', staffType: 'White-collar', salaryForm: 'Monthly paid', currentSalary: '40000', newSalaryDate: '', newSalary: '' },
  ]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSalaryChange = (id: string, field: string, value: string) => {
    setSalaries(prev => prev.map(emp => 
      emp.id === id ? { ...emp, [field]: value } : emp
    ));
  };

  const handleStaffTypeChange = (type: string) => {
    setStaffTypeFilter(type);
  };

  const handleSalaryFormChange = (form: string) => {
    setSalaryFormFilter(form);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  const filteredSalaries = salaries.filter(emp => {
    if (statusFilter === 'Changed') {
      return emp.newSalary !== '' || emp.newSalaryDate !== '';
    } else if (statusFilter === 'Unchanged') {
      return emp.newSalary === '' && emp.newSalaryDate === '';
    }
    return true;
  });

  const hasUnsavedChanges = salaries.some(emp => emp.newSalary !== '' || emp.newSalaryDate !== '');

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, Roboto, system-ui' }}>
      {/* Page Header */}
      <div className="h-[48px] px-[16px] flex items-center justify-between bg-white border-b border-[#E6E6E6]">
        <div className="text-[14px] font-semibold text-[#333333] tracking-[0.4px] uppercase">
          MASS UPDATE SALARIES
        </div>
      </div>

      {/* Tabs Section */}
      <div className="h-[40px] px-[16px] flex gap-[24px] items-end border-b border-[#E0E0E0] bg-white">
        <button
          className={`text-[13px] font-semibold pb-[10px] border-b-2 border-[#0A8F3C]`}
          onClick={() => handleTabChange('mass-update')}
        >
          Mass update salaries
        </button>
        <button
          className={`text-[13px] font-medium pb-[10px] ${
            activeTab === 'retroactive-salary' 
              ? 'text-[#000000] font-semibold' 
              : 'text-[#6F6F6F] hover:text-[#333333]'
          }`}
          onClick={() => handleTabChange('retroactive-salary')}
        >
          Retroactive salary
        </button>
      </div>

      {/* Instruction / Helper Text Section */}
      <div className="p-[16px] max-w-[920px]">
        <p className="text-[13px] text-[#333333] leading-[1.5]">
          Here you can update the salaries of the staff register for all employees at the same time.
        </p>
        <ol className="mt-[8px] text-[13px] text-[#333333] leading-[1.5] list-decimal list-inside">
          <li className="ml-[16px]">Fill in the date the new salary will apply from, in the field Date for new salary.</li>
          <li className="ml-[16px]">Fill in the new salaries of the employees in the column New salary.</li>
          <li className="ml-[16px]">Save the information you have filled in on the employees and they will be transferred to the personnel register.</li>
        </ol>
      </div>

      {/* Filters Section */}
      <div className="p-[16px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[16px] items-end">
        {/* Staff Type Segmented Control */}
        <div>
          <label className="block text-[13px] text-[#333333] mb-[4px]">Staff type</label>
          <div className="flex h-[32px] border border-[#CFCFCF] rounded-[3px] overflow-hidden">
            {['All', 'Blue-collar', 'White-collar'].map((type) => (
              <button
                key={type}
                className={`flex-1 text-[13px] ${
                  staffTypeFilter === type
                    ? 'bg-white text-[#333333]'
                    : 'bg-[#E0E0E0] text-[#6F6F6F]'
                }`}
                onClick={() => handleStaffTypeChange(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Salary Form Segmented Control */}
        <div>
          <label className="block text-[13px] text-[#333333] mb-[4px]">Salary form</label>
          <div className="flex h-[32px] border border-[#CFCFCF] rounded-[3px] overflow-hidden">
            {['All', 'Hourly paid', 'Monthly paid'].map((form) => (
              <button
                key={form}
                className={`flex-1 text-[13px] ${
                  salaryFormFilter === form
                    ? 'bg-white text-[#333333]'
                    : 'bg-[#E0E0E0] text-[#6F6F6F]'
                }`}
                onClick={() => handleSalaryFormChange(form)}
              >
                {form}
              </button>
            ))}
          </div>
        </div>

        {/* Date Field */}
        <div>
          <label className="block text-[13px] text-[#333333] mb-[4px]">Date of new salary</label>
          <div className="relative">
            <input
              type="date"
              value={dateOfNewSalary}
              onChange={(e) => setDateOfNewSalary(e.target.value)}
              className="w-full h-[32px] px-[8px] text-[13px] border border-[#CFCFCF] rounded-[3px] bg-white pr-[28px]"
            />
            <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[14px] text-[#6F6F6F]">📅</span>
          </div>
        </div>
      </div>

      {/* Status Filter Buttons */}
      <div className="px-[16px] flex gap-[8px]">
        {['All', 'Changed', 'Unchanged'].map((status) => (
          <button
            key={status}
            className={`h-[32px] px-[16px] text-[13px] border border-[#D0D0D0] bg-white ${
              statusFilter === status
                ? 'border-l-[4px] border-l-[#FFF3B0] text-[#333333]'
                : ''
            }`}
            onClick={() => handleStatusFilterChange(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div className="m-[16px] border border-[#E0E0E0] rounded-[6px] bg-white">
        <div className="h-[40px] border-b border-[#D0D0D0] grid grid-cols-[90px_180px_160px_160px_180px_160px_220px_160px]">
          <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
            ANST. ID
          </div>
          <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
            First name
          </div>
          <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
            Surname
          </div>
          <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
            Staff type
          </div>
          <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
            Salary form
          </div>
          <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
            Current salary
          </div>
          <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
            New salary shall apply from
          </div>
          <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
            New salary
          </div>
        </div>

        {filteredSalaries.map((employee) => {
          const isChanged = employee.newSalary !== '' || employee.newSalaryDate !== '';
          return (
            <div 
              key={employee.id} 
              className={`h-[40px] border-b border-[#E0E0E0] grid grid-cols-[90px_180px_160px_160px_180px_160px_220px_160px] ${
                isChanged ? 'bg-[#FFFDE7]' : 'bg-white'
              }`}
            >
              <div className="px-[8px] flex items-center border-r border-[#E0E0E0]">{employee.id}</div>
              <div className="px-[8px] flex items-center border-r border-[#E0E0E0]">{employee.firstName}</div>
              <div className="px-[8px] flex items-center border-r border-[#E0E0E0]">{employee.surname}</div>
              <div className="px-[8px] flex items-center border-r border-[#E0E0E0]">{employee.staffType}</div>
              <div className="px-[8px] flex items-center border-r border-[#E0E0E0]">{employee.salaryForm}</div>
              <div className="px-[8px] flex items-center border-r border-[#E0E0E0]">{employee.currentSalary}</div>
              <div className="px-[8px] flex items-center border-r border-[#E0E0E0]">
                <input
                  type="date"
                  value={employee.newSalaryDate}
                  onChange={(e) => handleSalaryChange(employee.id, 'newSalaryDate', e.target.value)}
                  className="w-full h-[28px] px-[4px] text-[13px] border border-[#D0D0D0] rounded-[2px] bg-white"
                />
              </div>
              <div className="px-[8px] flex items-center">
                <input
                  type="text"
                  value={employee.newSalary}
                  onChange={(e) => handleSalaryChange(employee.id, 'newSalary', e.target.value)}
                  className="w-full h-[28px] px-[4px] text-[13px] border border-[#D0D0D0] rounded-[2px] bg-white"
                  placeholder="Enter amount"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Action Bar */}
      <div className="h-[64px] px-[16px] flex justify-between items-center bg-[#F5F5F5] border-t border-[#E0E0E0]">
        <div className="flex gap-[8px]">
          <button className="h-[32px] px-[16px] text-[13px] bg-[#8C8C8C] text-white rounded-[20px]">
            Cancel
          </button>
          <button 
            className="h-[32px] px-[16px] text-[13px] bg-[#9E9E9E] text-white"
            disabled={!hasUnsavedChanges}
          >
            Reset all (changed)
          </button>
        </div>
        <button 
          className={`h-[32px] px-[16px] text-[13px] font-semibold text-white rounded-[20px] ${
            hasUnsavedChanges ? 'bg-[#9AC9A6]' : 'bg-[#C8E6C9]'
          }`}
          disabled={!hasUnsavedChanges}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default MassUpdateSalaries;