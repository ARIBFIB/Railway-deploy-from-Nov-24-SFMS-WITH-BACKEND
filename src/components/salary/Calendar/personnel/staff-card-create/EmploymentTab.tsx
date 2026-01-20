import React from 'react';

const EmploymentTab: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
      {/* Employment Details Section */}
      <div className="col-span-4">
        <h3 className="text-xs font-semibold text-[#2B2B2B] mb-2">Employment details</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Employee ID <span className="text-[#D32F2F]">*</span>
            </label>
            <input
              type="text"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Position <span className="text-[#D32F2F]">*</span>
            </label>
            <input
              type="text"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Department <span className="text-[#D32F2F]">*</span>
            </label>
            <select
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
            >
              <option value="">Select</option>
              <option value="hr">Human Resources</option>
              <option value="finance">Finance</option>
              <option value="it">IT</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="operations">Operations</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Employment type <span className="text-[#D32F2F]">*</span>
            </label>
            <select
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
            >
              <option value="">Select</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="temporary">Temporary</option>
              <option value="intern">Intern</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Start date <span className="text-[#D32F2F]">*</span>
            </label>
            <input
              type="date"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              End date
            </label>
            <input
              type="date"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Probation end date
            </label>
            <input
              type="date"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Employment status
            </label>
            <div className="flex h-7 border border-[#DADADA] rounded-[4px] overflow-hidden">
              <button
                className={`flex-1 text-xs ${
                  true ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'
                }`}
              >
                Active
              </button>
              <button
                className={`flex-1 text-xs ${
                  false ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Work Schedule Section */}
      <div className="col-span-4 mt-4">
        <h3 className="text-xs font-semibold text-[#2B2B2B] mb-2">Work schedule</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Work hours per week
            </label>
            <input
              type="number"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Work days per week
            </label>
            <input
              type="number"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Work start time
            </label>
            <input
              type="time"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Work end time
            </label>
            <input
              type="time"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Lunch break (minutes)
            </label>
            <input
              type="number"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Overtime allowed
            </label>
            <div className="flex h-7 border border-[#DADADA] rounded-[4px] overflow-hidden">
              <button
                className={`flex-1 text-xs ${
                  false ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'
                }`}
              >
                Yes
              </button>
              <button
                className={`flex-1 text-xs ${
                  true ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'
                }`}
              >
                No
              </button>
            </div>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Remote work allowed
            </label>
            <div className="flex h-7 border border-[#DADADA] rounded-[4px] overflow-hidden">
              <button
                className={`flex-1 text-xs ${
                  false ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'
                }`}
              >
                Yes
              </button>
              <button
                className={`flex-1 text-xs ${
                  true ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'
                }`}
              >
                No
              </button>
            </div>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Work location
            </label>
            <input
              type="text"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
        </div>
      </div>

      {/* Manager Information Section */}
      <div className="col-span-4 mt-4">
        <h3 className="text-xs font-semibold text-[#2B2B2B] mb-2">Manager information</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Manager name
            </label>
            <input
              type="text"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Manager email
            </label>
            <input
              type="email"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Manager phone
            </label>
            <input
              type="tel"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Reporting level
            </label>
            <input
              type="text"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmploymentTab;