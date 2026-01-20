import React from 'react';

const BalanceBroughtForwardTab: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
      {/* Balance Information Section */}
      <div className="col-span-4">
        <h3 className="text-xs font-semibold text-[#2B2B2B] mb-2">Balance information</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Previous year balance
            </label>
            <input
              type="number"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Year
            </label>
            <input
              type="text"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder="YYYY"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Balance type
            </label>
            <select
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
            >
              <option value="">Select</option>
              <option value="holiday">Holiday</option>
              <option value="sick-leave">Sick Leave</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Currency
            </label>
            <select
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
            >
              <option value="">Select</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="SEK">SEK</option>
              <option value="NOK">NOK</option>
              <option value="DKK">DKK</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Adjustment amount
            </label>
            <input
              type="number"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Adjustment reason
            </label>
            <input
              type="text"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Adjustment date
            </label>
            <input
              type="date"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Status
            </label>
            <select
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
            >
              <option value="">Select</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Balance History Section */}
      <div className="col-span-4 mt-4">
        <h3 className="text-xs font-semibold text-[#2B2B2B] mb-2">Balance history</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E0E0E0]">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">Year</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">Balance Type</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">Amount</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">Currency</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">Date Added</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E0]">
              <tr>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">2023</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">Holiday</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">5.0</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">Days</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">2023-12-31</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">Approved</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">2022</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">Sick Leave</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">3.0</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">Days</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">2022-12-31</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">Approved</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">2021</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">Holiday</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">7.5</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">Days</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">2021-12-31</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">Approved</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Balance Adjustment Section */}
      <div className="col-span-4 mt-4">
        <h3 className="text-xs font-semibold text-[#2B2B2B] mb-2">Balance adjustment</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Adjustment type
            </label>
            <select
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
            >
              <option value="">Select</option>
              <option value="add">Add</option>
              <option value="subtract">Subtract</option>
              <option value="reset">Reset</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Adjustment amount
            </label>
            <input
              type="number"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Adjustment date
            </label>
            <input
              type="date"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Adjustment reason
            </label>
            <input
              type="text"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
        </div>
      </div>

      {/* Notes Section */}
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

export default BalanceBroughtForwardTab;