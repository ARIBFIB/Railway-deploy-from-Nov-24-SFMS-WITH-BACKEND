import React from 'react';

const ATFATKTab: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
      {/* ATF/ATK Information Section */}
      <div className="col-span-4">
        <h3 className="text-xs font-semibold text-[#2B2B2B] mb-2">ATF/ATK information</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              ATF/ATK number
            </label>
            <input
              type="text"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              ATF/ATK type
            </label>
            <select
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
            >
              <option value="">Select</option>
              <option value="atf">ATF</option>
              <option value="atk">ATK</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              ATF/ATK start date
            </label>
            <input
              type="date"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              ATF/ATK end date
            </label>
            <input
              type="date"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              ATF/ATK category
            </label>
            <select
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
            >
              <option value="">Select</option>
              <option value="category1">Category 1</option>
              <option value="category2">Category 2</option>
              <option value="category3">Category 3</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              ATF/ATK percentage
            </label>
            <input
              type="number"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              ATF/ATK amount
            </label>
            <input
              type="number"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              ATF/ATK status
            </label>
            <select
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
            >
              <option value="">Select</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* ATF/ATK Settings Section */}
      <div className="col-span-4 mt-4">
        <h3 className="text-xs font-semibold text-[#2B2B2B] mb-2">ATF/ATK settings</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              ATF/ATK calculation method
            </label>
            <select
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
            >
              <option value="">Select</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
              <option value="tiered">Tiered</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              ATF/ATK frequency
            </label>
            <select
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
            >
              <option value="">Select</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              ATF/ATK approval required
            </label>
            <div className="flex h-7 border border-[#DADADA] rounded-[4px] overflow-hidden">
              <button
                className={`flex-1 text-xs ${
                  true ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'
                }`}
              >
                Yes
              </button>
              <button
                className={`flex-1 text-xs ${
                  false ? 'bg-[#E0E0E0] text-[#2B2B2B]' : 'bg-white text-[#6F6F6F]'
                }`}
              >
                No
              </button>
            </div>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              ATF/ATK automatic renewal
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
        </div>
      </div>

      {/* ATF/ATK Compliance Section */}
      <div className="col-span-4 mt-4">
        <h3 className="text-xs font-semibold text-[#2B2B2B] mb-2">ATF/ATK compliance</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Compliance status
            </label>
            <select
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
            >
              <option value="">Select</option>
              <option value="compliant">Compliant</option>
              <option value="non-compliant">Non-compliant</option>
              <option value="pending-review">Pending Review</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Last compliance check
            </label>
            <input
              type="date"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Next compliance due
            </label>
            <input
              type="date"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Compliance officer
            </label>
            <input
              type="text"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
        </div>
      </div>

      {/* ATF/ATK Notes Section */}
      <div className="col-span-4 mt-4">
        <h3 className="text-xs font-semibold text-[#2B2B2B] mb-2">Notes</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
          <div className="col-span-4">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Additional notes
            </label>
            <textarea
              className="w-full h-20 px-2 py-1 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white resize-none"
              placeholder=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATFATKTab;