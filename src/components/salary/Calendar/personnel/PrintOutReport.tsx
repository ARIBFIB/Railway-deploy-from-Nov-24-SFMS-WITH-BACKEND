import React, { useState, useEffect } from 'react';

const PrintOutReport = () => {
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    staffType: 'all',
    status: 'all',
    dateRange: 'current-month'
  });

  // Mock data for demonstration
  useEffect(() => {
    // Simulate fetching report data
    setTimeout(() => {
      const mockData = [
        { id: 1, employmentId: 'EMP001', firstName: 'John', surname: 'Doe', personalId: '198501011234', staffType: 'White-collar', agreement: 'Full-time', calendarPermissions: 'Full' },
        { id: 2, employmentId: 'EMP002', firstName: 'Jane', surname: 'Smith', personalId: '199005155678', staffType: 'Blue-collar', agreement: 'Part-time', calendarPermissions: 'Limited' },
        { id: 3, employmentId: 'EMP003', firstName: 'Robert', surname: 'Johnson', personalId: '198211229012', staffType: 'White-collar', agreement: 'Full-time', calendarPermissions: 'Full' },
        { id: 4, employmentId: 'EMP004', firstName: 'Emily', surname: 'Williams', personalId: '198803103456', staffType: 'White-collar', agreement: 'Full-time', calendarPermissions: 'Full' },
        { id: 5, employmentId: 'EMP005', firstName: 'Michael', surname: 'Brown', personalId: '197912057890', staffType: 'Blue-collar', agreement: 'Part-time', calendarPermissions: 'Limited' },
      ];
      setReportData(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div 
      className="min-h-screen bg-[#F5F5F5] p-[20px]"
      style={{ 
        fontFamily: 'Inter, Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: '12px',
        lineHeight: '1.4'
      }}
    >
      {/* Print-specific styles for when printing */}
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background-color: white !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            box-shadow: none !important;
            border: none !important;
            background-color: white !important;
            margin: 0 !important;
            padding: 20px !important;
          }
        }
      `}</style>

      <div className="print-container bg-white rounded-[8px] shadow-md p-[24px] mx-auto max-w-6xl">
        {/* Header with company info and controls */}
        <div className="flex justify-between items-start mb-[24px]">
          <div>
            <h1 className="text-[20px] font-bold text-[#1F2937] mb-[4px]">Personnel Register Report</h1>
            <p className="text-[12px] text-[#6B7280]">
              Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
          
          <div className="no-print flex space-x-[12px]">
            <button 
              className="h-[32px] px-[16px] bg-[#F3F4F6] text-[#374151] text-[12px] font-medium rounded-[6px] border border-[#D1D5DB] hover:bg-[#E5E7EB] transition-colors"
              onClick={() => window.history.back()}
            >
              Back to Personnel
            </button>
            <button 
              className="h-[32px] px-[16px] bg-[#0B8F5A] text-white text-[12px] font-semibold rounded-[6px] hover:bg-[#0AA06A] transition-colors"
              onClick={handlePrint}
            >
              Print Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="no-print grid grid-cols-1 md:grid-cols-3 gap-[16px] mb-[24px] p-[16px] bg-[#F9FAFB] rounded-[6px] border border-[#E5E7EB]">
          <div>
            <label className="block text-[11px] font-medium text-[#374151] mb-[6px]">Staff Type</label>
            <select
              value={filters.staffType}
              onChange={(e) => handleFilterChange('staffType', e.target.value)}
              className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] px-[10px] focus:outline-none focus:ring-1 focus:ring-[#6AAE8A]"
            >
              <option value="all">All</option>
              <option value="white-collar">White-collar</option>
              <option value="blue-collar">Blue-collar</option>
            </select>
          </div>
          
          <div>
            <label className="block text-[11px] font-medium text-[#374151] mb-[6px]">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] px-[10px] focus:outline-none focus:ring-1 focus:ring-[#6AAE8A]"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div>
            <label className="block text-[11px] font-medium text-[#374151] mb-[6px]">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] px-[10px] focus:outline-none focus:ring-1 focus:ring-[#6AAE8A]"
            >
              <option value="current-month">Current Month</option>
              <option value="last-month">Last Month</option>
              <option value="current-quarter">Current Quarter</option>
              <option value="year-to-date">Year to Date</option>
            </select>
          </div>
        </div>

        {/* Report Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px] mb-[24px] no-print">
          <div className="bg-[#F0FDF4] p-[12px] rounded-[6px] border border-[#BBF7D0]">
            <p className="text-[11px] text-[#4B5563]">Total Employees</p>
            <p className="text-[16px] font-semibold text-[#059669]">{reportData.length}</p>
          </div>
          <div className="bg-[#EFF6FF] p-[12px] rounded-[6px] border border-[#BFDBFE]">
            <p className="text-[11px] text-[#4B5563]">Active</p>
            <p className="text-[16px] font-semibold text-[#2563EB]">{reportData.filter(emp => emp.status !== 'inactive').length}</p>
          </div>
          <div className="bg-[#FEF3C7] p-[12px] rounded-[6px] border border-[#FDE68A]">
            <p className="text-[11px] text-[#4B5563]">White-collar</p>
            <p className="text-[16px] font-semibold text-[#D97706]">{reportData.filter(emp => emp.staffType === 'White-collar').length}</p>
          </div>
          <div className="bg-[#FEE2E2] p-[12px] rounded-[6px] border border-[#FECACA]">
            <p className="text-[11px] text-[#4B5563]">Blue-collar</p>
            <p className="text-[16px] font-semibold text-[#DC2626]">{reportData.filter(emp => emp.staffType === 'Blue-collar').length}</p>
          </div>
        </div>

        {/* Report Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E5E7EB]">
            <thead className="bg-[#F9FAFB]">
              <tr>
                <th className="px-[12px] py-[10px] text-left text-[11px] font-semibold text-[#374151] uppercase tracking-[0.5px] border-r border-[#E5E7EB]">
                  Employment ID
                </th>
                <th className="px-[12px] py-[10px] text-left text-[11px] font-semibold text-[#374151] uppercase tracking-[0.5px] border-r border-[#E5E7EB]">
                  First Name
                </th>
                <th className="px-[12px] py-[10px] text-left text-[11px] font-semibold text-[#374151] uppercase tracking-[0.5px] border-r border-[#E5E7EB]">
                  Surname
                </th>
                <th className="px-[12px] py-[10px] text-left text-[11px] font-semibold text-[#374151] uppercase tracking-[0.5px] border-r border-[#E5E7EB]">
                  Personal Identity Number
                </th>
                <th className="px-[12px] py-[10px] text-left text-[11px] font-semibold text-[#374151] uppercase tracking-[0.5px] border-r border-[#E5E7EB]">
                  Staff Type
                </th>
                <th className="px-[12px] py-[10px] text-left text-[11px] font-semibold text-[#374151] uppercase tracking-[0.5px] border-r border-[#E5E7EB]">
                  Agreement
                </th>
                <th className="px-[12px] py-[10px] text-left text-[11px] font-semibold text-[#374151] uppercase tracking-[0.5px]">
                  Calendar Permissions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#F3F4F6]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-[12px] py-[20px] text-center text-[12px] text-[#6B7280]">
                    Loading report data...
                  </td>
                </tr>
              ) : reportData.length > 0 ? (
                reportData.map((employee) => (
                  <tr key={employee.id} className="hover:bg-[#F9FAFB]">
                    <td className="px-[12px] py-[10px] text-[12px] text-[#1F2937] border-r border-[#E5E7EB]">
                      {employee.employmentId}
                    </td>
                    <td className="px-[12px] py-[10px] text-[12px] text-[#1F2937] border-r border-[#E5E7EB]">
                      {employee.firstName}
                    </td>
                    <td className="px-[12px] py-[10px] text-[12px] text-[#1F2937] border-r border-[#E5E7EB]">
                      {employee.surname}
                    </td>
                    <td className="px-[12px] py-[10px] text-[12px] text-[#1F2937] border-r border-[#E5E7EB]">
                      {employee.personalId}
                    </td>
                    <td className="px-[12px] py-[10px] text-[12px] text-[#1F2937] border-r border-[#E5E7EB]">
                      {employee.staffType}
                    </td>
                    <td className="px-[12px] py-[10px] text-[12px] text-[#1F2937] border-r border-[#E5E7EB]">
                      {employee.agreement}
                    </td>
                    <td className="px-[12px] py-[10px] text-[12px] text-[#1F2937]">
                      {employee.calendarPermissions}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-[12px] py-[20px] text-center text-[12px] text-[#6B7280]">
                    No employees found matching the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Print instructions */}
        <div className="mt-[24px] p-[16px] bg-[#FEF7ED] rounded-[6px] border border-[#FCD34D] text-[12px] text-[#92400E] no-print">
          <p className="font-medium">Printing Instructions:</p>
          <ul className="list-disc list-inside mt-[4px] space-y-[2px]">
            <li>Click the "Print Report" button to open the print dialog</li>
            <li>Adjust print settings as needed in your browser's print dialog</li>
            <li>For best results, select "Landscape" orientation and "Fit to Page"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrintOutReport;