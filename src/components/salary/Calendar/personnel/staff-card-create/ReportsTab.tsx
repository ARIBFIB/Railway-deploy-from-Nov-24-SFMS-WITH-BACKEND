import React from 'react';

const ReportsTab: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
      {/* Report Generation Section */}
      <div className="col-span-4">
        <h3 className="text-xs font-semibold text-[#2B2B2B] mb-2">Report generation</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Report type
            </label>
            <select
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
            >
              <option value="">Select</option>
              <option value="payroll">Payroll Report</option>
              <option value="tax">Tax Report</option>
              <option value="attendance">Attendance Report</option>
              <option value="leave">Leave Report</option>
              <option value="salary">Salary Report</option>
              <option value="benefits">Benefits Report</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Report format
            </label>
            <select
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
            >
              <option value="">Select</option>
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
              <option value="xml">XML</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Report period
            </label>
            <select
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
            >
              <option value="">Select</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Report schedule
            </label>
            <select
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
            >
              <option value="">Select</option>
              <option value="manual">Manual</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Generated Reports Section */}
      <div className="col-span-4 mt-4">
        <h3 className="text-xs font-semibold text-[#2B2B2B] mb-2">Generated reports</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E0E0E0]">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">Report Name</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">Date</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">Format</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[#2B2B2B] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E0]">
              <tr>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">Payroll Report Jan 2024</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">2024-01-31</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">PDF</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">Generated</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">
                  <button className="text-[#2E7D32] hover:underline mr-2">Download</button>
                  <button className="text-[#2B2B2B] hover:underline">View</button>
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">Tax Report Q1 2024</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">2024-03-31</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">Excel</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">Generated</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">
                  <button className="text-[#2E7D32] hover:underline mr-2">Download</button>
                  <button className="text-[#2B2B2B] hover:underline">View</button>
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">Leave Summary Report</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">2024-02-15</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">PDF</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">Scheduled</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#2B2B2B]">
                  <button className="text-[#2B2B2B] hover:underline">Cancel</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Settings Section */}
      <div className="col-span-4 mt-4">
        <h3 className="text-xs font-semibold text-[#2B2B2B] mb-2">Report settings</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
          <div className="col-span-1">
            <label className="flex items-center space-x-1.5">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 border border-[#BDBDBD] text-[#2E7D32]"
              />
              <span className="text-xs text-[#2B2B2B]">Auto-generate reports</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="flex items-center space-x-1.5">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 border border-[#BDBDBD] text-[#2E7D32]"
              />
              <span className="text-xs text-[#2B2B2B]">Email reports to manager</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="flex items-center space-x-1.5">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 border border-[#BDBDBD] text-[#2E7D32]"
              />
              <span className="text-xs text-[#2B2B2B]">Archive old reports</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="flex items-center space-x-1.5">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 border border-[#BDBDBD] text-[#2E7D32]"
              />
              <span className="text-xs text-[#2B2B2B]">Include in dashboard</span>
            </label>
          </div>
        </div>
      </div>

      {/* Report Access Section */}
      <div className="col-span-4 mt-4">
        <h3 className="text-xs font-semibold text-[#2B2B2B] mb-2">Report access</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Access level
            </label>
            <select
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
            >
              <option value="">Select</option>
              <option value="view">View Only</option>
              <option value="edit">View & Edit</option>
              <option value="admin">Full Access</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Share with
            </label>
            <input
              type="text"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder="Enter email addresses"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Valid until
            </label>
            <input
              type="date"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Access code
            </label>
            <input
              type="text"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder="Auto-generated"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;