import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Plus, MoreHorizontal, Printer, RotateCcw, Trash2, Eye, EyeOff, Book, Upload, Download, FileText, RefreshCw, Users, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import CreateEmployeeModal from '../components/CreateEmployeeModal';
import { StaffCategories } from '../components/StaffCategories';
import { personnelService } from '../services/personnelService';

interface Employee {
  id: string;
  employmentId: string;
  firstName: string;
  lastName: string;
  socialSecurityNumber: string;
  staffType: string;
  agreementForSalaries: string;
  agreementTemplate: string;
  salaryForm: string;
  typeOfPaySlip: string;
  calendarPermissions: string;
  isActive: boolean;
  isComplete: boolean;
}

const PersonnelRegisterPage: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'notComplete' | 'inactive'>('active');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [salaryYear, setSalaryYear] = useState('2025');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'staff' | 'categories'>('staff');

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab === 'categories') {
      setActiveTab('categories');
    } else {
      setActiveTab('staff');
    }
  }, [location.search]);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalItems = employees.length;
  // Load employees from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const apiEmployees = await personnelService.list({ status: statusFilter, search: searchTerm });
        if (!mounted) return;
        const mapped: Employee[] = apiEmployees.map(e => ({
          id: e.id,
          employmentId: e.employment_id,
          firstName: e.first_name,
          lastName: e.last_name,
          socialSecurityNumber: e.social_security_number || '',
          staffType: e.staff_type || '',
          agreementForSalaries: e.agreement_for_salaries || '',
          agreementTemplate: e.agreement_template || '',
          salaryForm: e.salary_form || '',
          typeOfPaySlip: e.type_of_pay_slip || '',
          calendarPermissions: e.calendar_permissions || '',
          isActive: e.is_active,
          isComplete: e.is_complete
        }));
        setEmployees(mapped);
      } catch (e) {
        console.error('Failed to load employees', e);
        setError('Failed to load employees');
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [statusFilter, searchTerm]);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map((employee) => employee.id));
    }
  };

  const handleCreateEmployee = () => {
    setShowCreateModal(true);
  };

  const handleCreateModalClose = () => {
    setShowCreateModal(false);
  };

  const handleCreateModalSave = (employeeData: any) => {
    const newEmployee: Employee = {
      id: Date.now().toString(),
      employmentId: employeeData.employmentId,
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      socialSecurityNumber: employeeData.socialSecurityNumber,
      staffType: 'Worker',
      agreementForSalaries: 'Trade',
      agreementTemplate: 'Worker',
      salaryForm: 'Monthly salary',
      typeOfPaySlip: employeeData.typeOfPaySlip === 'digital' ? 'Digital' : 'Paper',
      calendarPermissions: employeeData.calendar === 'yes' ? 'Yes' : 'No',
      isActive: true,
      isComplete: true
    };
    
    setEmployees(prev => [...prev, newEmployee]);
    setShowCreateModal(false);
  };

  const handleDisable = () => {
    if (selectedEmployees.length === 0) return;

    setEmployees((prev) =>
      prev.map((employee) =>
        selectedEmployees.includes(employee.id)
          ? { ...employee, isActive: false }
          : employee
      )
    );
    setSelectedEmployees([]);
  };

  const handleDelete = () => {
    if (selectedEmployees.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedEmployees.length} selected employee(s)?`)) {
      setEmployees((prev) => prev.filter((employee) => !selectedEmployees.includes(employee.id)));
      setSelectedEmployees([]);
    }
  };

  const handleActivate = () => {
    if (selectedEmployees.length === 0) return;

    setEmployees((prev) =>
      prev.map((employee) =>
        selectedEmployees.includes(employee.id)
          ? { ...employee, isActive: true }
          : employee
      )
    );
    setSelectedEmployees([]);
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.employmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.socialSecurityNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = employee.isActive && employee.isComplete;
    if (statusFilter === 'inactive') matchesStatus = !employee.isActive;
    if (statusFilter === 'notComplete') matchesStatus = !employee.isComplete;
    
    return matchesSearch && matchesStatus;
  });

  const hasActiveSelected = selectedEmployees.some((id) => {
    const employee = employees.find((emp) => emp.id === id);
    return employee?.isActive;
  });

  const hasInactiveSelected = selectedEmployees.some((id) => {
    const employee = employees.find((emp) => emp.id === id);
    return !employee?.isActive;
  });

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-2 py-1 text-sm ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Render different content based on active tab */}
      {activeTab === 'categories' ? (
        <div className="px-6 py-6">
          <StaffCategories />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">PERSONNEL REGISTER - LIST</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Employment ID, first name, last name, personal"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                  aria-label="Search employees"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Salary year</span>
                <select
                  value={salaryYear}
                  onChange={(e) => setSalaryYear(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Reports</span>
                <span className="text-gray-400">▼</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Register</span>
                <span className="text-gray-400">▼</span>
              </div>
              <Button
                onClick={handleCreateEmployee}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-4 py-2 rounded-lg flex items-center space-x-2"
                aria-label="Create employee"
              >
                <Plus className="w-4 h-4" />
                <span>Create employee</span>
              </Button>
            </div>
          </div>
          
          {/* Action Bar */}
          <div className="flex items-center space-x-4 mt-4">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <Book className="w-4 h-4" />
              <span>History</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <Plus className="w-4 h-4" />
              <span>Create new from template</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <Users className="w-4 h-4" />
              <Download className="w-3 h-3" />
              <span>Import staff</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <Users className="w-4 h-4" />
              <Upload className="w-3 h-3" />
              <span>Export staff</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <Printer className="w-4 h-4" />
              <span>Printing</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <Upload className="w-4 h-4" />
              <span>Create FOS request</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <Download className="w-4 h-4" />
              <span>Load FOS response</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <FileText className="w-4 h-4" />
              <span>Mass update salaries</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <RefreshCw className="w-4 h-4" />
              <span>Retroactive salary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      {employees.length === 0 && (
        <div className="px-6 py-8">
          <div className="bg-purple-100 border border-purple-200 rounded-lg p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-purple-900 mb-4">
                  Welcome to start registering employees in the payroll system.
                </h2>
                <p className="text-purple-800 mb-6 leading-relaxed">
                  Now you are in the personnel register in the payroll system but it is quite empty at the moment. 
                  At the top right you can click on Create employee to start registering your first employee. 
                  A faster way to get the employees in is by importing them via file. You can also create new 
                  personnel from templates that you upload yourself with the settings that will apply.
                </p>
                <div className="flex space-x-3">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium">
                    Add employees
                  </button>
                  <button className="border border-purple-600 text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg font-medium">
                    Read more
                  </button>
                </div>
              </div>
              <div className="ml-8">
                <div className="flex space-x-2">
                  <div className="w-12 h-16 bg-blue-200 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                  </div>
                  <div className="w-12 h-16 bg-green-200 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                statusFilter === 'all'
                  ? 'bg-gray-200 text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                statusFilter === 'active'
                  ? 'bg-gray-200 text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('notComplete')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                statusFilter === 'notComplete'
                  ? 'bg-gray-200 text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Not complete
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                statusFilter === 'inactive'
                  ? 'bg-gray-200 text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white">
        {/* Table Controls */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {statusFilter === 'all' && `Showing all ${employees.length} employees`}
              {statusFilter === 'active' && `Showing ${filteredEmployees.length} active employees`}
              {statusFilter === 'inactive' && `Showing ${filteredEmployees.length} inactive employees`}
              {statusFilter === 'notComplete' && `Showing ${filteredEmployees.length} incomplete employees`}
            </div>
            <div className="flex items-center space-x-2">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                aria-label="Items per page"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">of {totalItems}</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  aria-label="Go to first page"
                >
                  {'<<'}
                </button>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  aria-label="Go to previous page"
                >
                  {'<'}
                </button>
                {renderPaginationButtons()}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  aria-label="Go to next page"
                >
                  {'>'}
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  aria-label="Go to last page"
                >
                  {'>>'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    aria-label="Select all employees"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                  EMPLOYMENT ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EMPLOYEE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SOCIAL SECURITY NUMBER
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STAFF TYPE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AGREEMENT FOR SALARIES
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AGREEMENT TEMPLATE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SALARY FORM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TYPE OF PAY SLIP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CALENDAR PERMISSIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className={!employee.isActive ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => handleSelectEmployee(employee.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        aria-label={`Select employee ${employee.employmentId}`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {employee.employmentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.socialSecurityNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.staffType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.agreementForSalaries}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.agreementTemplate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.salaryForm}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.typeOfPaySlip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.calendarPermissions}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                    {statusFilter === 'active' && 'No active employees found'}
                    {statusFilter === 'inactive' && 'No inactive employees found'}
                    {statusFilter === 'notComplete' && 'No incomplete employees found'}
                    {statusFilter === 'all' && 'No employees found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDisable}
                disabled={selectedEmployees.length === 0}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  selectedEmployees.length > 0
                    ? 'bg-gray-500 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                aria-label="Disable selected employees"
              >
                <EyeOff className="w-4 h-4" />
                <span>Disable</span>
              </button>
              <button
                onClick={handleDelete}
                disabled={selectedEmployees.length === 0}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  selectedEmployees.length > 0
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                aria-label="Delete selected employees"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
              <span className="text-sm text-gray-600">
                ({selectedEmployees.length} selected)
              </span>
              <button
                disabled={selectedEmployees.length === 0}
                className={`px-4 py-2 rounded-lg ${
                  selectedEmployees.length > 0
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                aria-label="Change selected employees"
              >
                Change selected
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleActivate}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  hasInactiveSelected
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!hasInactiveSelected}
                aria-label="Activate selected employees"
              >
                <Eye className="w-4 h-4" />
                <span>Activate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

          {/* Create Employee Modal */}
          <CreateEmployeeModal
            isOpen={showCreateModal}
            onClose={handleCreateModalClose}
            onSave={handleCreateModalSave}
          />
        </>
      )}
    </div>
  );
};

export default PersonnelRegisterPage;
