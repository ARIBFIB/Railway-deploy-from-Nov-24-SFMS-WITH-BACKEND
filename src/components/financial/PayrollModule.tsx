import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, Calculator, Download, Eye, Edit, CheckCircle, Clock, Loader2, RefreshCw } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { Modal } from '../Modal';
import { personnelService, type Employee as PersonnelEmployee } from '../../services/personnelService';
import { PayrollService, type PayrollRun, type PayrollEntry } from '../../services/payrollService';

// Extended Employee interface for UI
interface Employee {
  id: string;
  employee_number?: string;
  first_name: string;
  last_name: string;
  email: string; // May not be in personnel service default?
  position?: string;
  department?: string;
  hire_date?: string;
  employment_type?: string;
  salary_type: 'monthly' | 'hourly';
  base_salary: number;
  currency: string;
  is_active: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'approved':
      return 'bg-blue-100 text-blue-800';
    case 'calculated':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const PayrollModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'payroll'>('employees');

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRun | null>(null);
  const [selectedPayrollEntries, setSelectedPayrollEntries] = useState<PayrollEntry[]>([]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load Employees
      const personnelData = await personnelService.list({ status: 'active' }); // Or 'all'
      const mappedEmployees: Employee[] = personnelData.map(p => ({
        id: p.id,
        first_name: p.first_name,
        last_name: p.last_name,
        email: 'unknown@example.com', // Not in personnelService list default?
        position: p.staff_type || 'Unknown',
        salary_type: 'monthly',
        base_salary: parseFloat(p.agreement_for_salaries || '0'),
        currency: 'SEK',
        is_active: p.is_active,
        // Add other fields if available in customized personnel service
      }));
      setEmployees(mappedEmployees);

      // Load Payroll Runs
      const runs = await PayrollService.getPayrollRuns();
      setPayrollRuns(runs);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunPayroll = async (data: any) => {
    try {
      const run = await PayrollService.createPayrollRun(data);
      await PayrollService.calculatePayrollRun(run.id); // Auto calculate for demo
      loadData(); // Refresh lists
      setShowPayrollModal(false);
    } catch (err) {
      // Handle error
      console.error(err);
      alert('Failed to run payroll');
    }
  };

  const handleApprovePayroll = async (id: string) => {
    try {
      await PayrollService.approvePayrollRun(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to approve payroll');
    }
  };

  const handleViewPayrollDetails = async (run: PayrollRun) => {
    try {
      // Fetch details with entries
      const { run: detailedRun, entries } = await PayrollService.getPayrollRunById(run.id);
      setSelectedPayroll(detailedRun);
      setSelectedPayrollEntries(entries);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEmployees = employees.filter(employee =>
    `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.position || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEmploymentTypeLabel = (type: string) => {
    return (type || 'Unknown').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const totalActiveEmployees = employees.length; // since we filter active already roughly
  const totalMonthlySalaries = employees
    .reduce((sum, emp) => sum + emp.base_salary, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payroll Management</h2>
          <p className="text-gray-600 mt-1">Manage employees and process payroll runs.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={loadData} icon={RefreshCw}>
            Refresh
          </Button>
          <Button
            icon={Calculator}
            variant="secondary"
            onClick={() => setShowPayrollModal(true)}
          >
            Run Payroll
          </Button>
          <Button
            icon={Plus}
            onClick={() => setShowEmployeeModal(true)}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Employees</p>
              <p className="text-2xl font-bold text-gray-900">{totalActiveEmployees}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Salaries</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalMonthlySalaries.toLocaleString('sv-SE')} SEK
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Payroll</p>
              <p className="text-2xl font-bold text-gray-900">
                {payrollRuns.filter(pr => pr.status === 'calculated' || pr.status === 'draft').length}
              </p>
            </div>
          </div>
        </Card>


        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Last Payroll</p>
              <p className="text-2xl font-bold text-gray-900">
                {payrollRuns[0]?.total_net_pay.toLocaleString('sv-SE') || 0} SEK
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('employees')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'employees'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            Employees
          </button>
          <button
            onClick={() => setActiveTab('payroll')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'payroll'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            Payroll Runs
          </button>
        </nav>
      </div>

      {/* Search */}
      <Card>
        <Input
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
        />
      </Card>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {/* Employees Tab */}
          {activeTab === 'employees' && (
            <Card title="Employees" subtitle="Manage employee information and salaries">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Salary
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {employee.first_name} {employee.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.employee_number}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.position}</div>
                          {employee.department && (
                            <div className="text-sm text-gray-500">{employee.department}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {getEmploymentTypeLabel(employee.employment_type || 'Unknown')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.base_salary.toLocaleString('sv-SE')} {employee.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${employee.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {employee.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" icon={Eye}>
                              View
                            </Button>
                            {/* 
                        <Button variant="ghost" size="sm" icon={Edit}>
                          Edit
                        </Button>
                        */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Payroll Runs Tab */}
          {activeTab === 'payroll' && (
            <div className="space-y-6">
              {payrollRuns.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
                  No payroll runs found. Click "Run Payroll" to create one.
                </div>
              ) : payrollRuns.map((payroll) => (
                <Card key={payroll.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {getStatusIcon(payroll.status)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Payroll {new Date(payroll.payroll_period_start).toLocaleDateString()} - {new Date(payroll.payroll_period_end).toLocaleDateString()}
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Pay Date:</span>
                            <br />
                            <span className="text-gray-900">{new Date(payroll.pay_date).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Employees:</span>
                            <br />
                            <span className="text-gray-900">{payroll.employee_count}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Gross Pay:</span>
                            <br />
                            <span className="text-gray-900">{payroll.total_gross_pay.toLocaleString('sv-SE')} {payroll.currency}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Net Pay:</span>
                            <br />
                            <span className="text-lg font-semibold text-gray-900">
                              {payroll.total_net_pay.toLocaleString('sv-SE')} {payroll.currency}
                            </span>
                          </div>
                        </div>

                        <div className="text-sm text-gray-500">
                          Total Deductions: {payroll.total_deductions.toLocaleString('sv-SE')} {payroll.currency}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payroll.status)}`}>
                        {payroll.status.replace('_', ' ')}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Eye}
                          onClick={() => handleViewPayrollDetails(payroll)}
                        >
                          View Details
                        </Button>
                        {/*
                    <Button variant="ghost" size="sm" icon={Download}>
                      Export
                    </Button>
                    */}
                        {payroll.status === 'calculated' && (
                          <Button size="sm" onClick={() => handleApprovePayroll(payroll.id)}>
                            Approve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Employee Modal */}
      <Modal
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        title="Add Employee"
        size="lg"
      >
        <EmployeeForm onClose={() => setShowEmployeeModal(false)} />
      </Modal>

      {/* Run Payroll Modal */}
      <Modal
        isOpen={showPayrollModal}
        onClose={() => setShowPayrollModal(false)}
        title="Run Payroll"
        size="md"
      >
        <PayrollRunForm onSubmit={handleRunPayroll} onClose={() => setShowPayrollModal(false)} />
      </Modal>

      {/* Payroll Details Modal */}
      <Modal
        isOpen={!!selectedPayroll}
        onClose={() => setSelectedPayroll(null)}
        title="Payroll Details"
        size="lg"
      >
        {selectedPayroll && <PayrollDetails payroll={selectedPayroll} entries={selectedPayrollEntries} />}
      </Modal>
    </div>
  );
};

const EmployeeForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // IMPORTANT: This form should ideally check out personnelService.create but 
  // currently we are just mocking the "submission" to close data or doing nothing as implementing create employee 
  // is a separate larger task (Personel management). The user's prompt focused on Financial/Payroll *Runs*.
  // We'll keep it as a placeholder or hint it's not implemented fully.
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    // ...
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Create Employee function would go here (integrating with Personnel module)");
    onClose();
  };

  return (
    <div className="p-4">
      <p>Please use the Personnel Module to add employees properly.</p>
      <Button onClick={onClose}>Close</Button>
    </div>
  );
};

const PayrollRunForm: React.FC<{ onSubmit: (data: any) => void; onClose: () => void }> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    payroll_period_start: new Date().toISOString().split('T')[0],
    payroll_period_end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0], // End of current month
    pay_date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <Calculator className="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Run Payroll</h3>
        <p className="text-sm text-gray-600">Calculate payroll for all active employees</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Payroll Period Start"
          type="date"
          value={formData.payroll_period_start}
          onChange={(e) => setFormData(prev => ({ ...prev, payroll_period_start: e.target.value }))}
          required
        />
        <Input
          label="Payroll Period End"
          type="date"
          value={formData.payroll_period_end}
          onChange={(e) => setFormData(prev => ({ ...prev, payroll_period_end: e.target.value }))}
          required
        />
      </div>

      <Input
        label="Pay Date"
        type="date"
        value={formData.pay_date}
        onChange={(e) => setFormData(prev => ({ ...prev, pay_date: e.target.value }))}
        required
      />

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Payroll Calculation Includes:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Base salary calculations (from Personnel)</li>
          <li>• Tax deductions (30% est)</li>
          <li>• Social security contributions (31% est)</li>
        </ul>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" icon={Calculator}>
          Calculate Payroll
        </Button>
      </div>
    </form>
  );
};

const PayrollDetails: React.FC<{ payroll: PayrollRun; entries: PayrollEntry[] }> = ({ payroll, entries }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Payroll Period: {new Date(payroll.payroll_period_start).toLocaleDateString()} - {new Date(payroll.payroll_period_end).toLocaleDateString()}
          </h3>
          <p className="text-sm text-gray-600">Pay Date: {new Date(payroll.pay_date).toLocaleDateString()}</p>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(payroll.status)}`}>
          {payroll.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Gross Pay</h4>
          <p className="text-2xl font-bold text-gray-900">
            {payroll.total_gross_pay.toLocaleString('sv-SE')} {payroll.currency}
          </p>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Total Tax Deductions</h4>
          <p className="text-2xl font-bold text-red-600">
            -{payroll.total_deductions.toLocaleString('sv-SE')} {payroll.currency}
          </p>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Net Pay</h4>
          <p className="text-2xl font-bold text-green-600">
            {payroll.total_net_pay.toLocaleString('sv-SE')} {payroll.currency}
          </p>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">Employee Breakdown</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Employee
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Gross Pay
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Tax
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Social Security
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Net Pay
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">
                    {entry.employee_name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {entry.gross_pay.toLocaleString('sv-SE')}
                  </td>
                  <td className="px-4 py-2 text-sm text-red-600 text-right">
                    -{entry.tax_deduction.toLocaleString('sv-SE')}
                  </td>
                  <td className="px-4 py-2 text-sm text-red-600 text-right">
                    -{entry.social_security_deduction.toLocaleString('sv-SE')}
                  </td>
                  <td className="px-4 py-2 text-sm font-semibold text-green-600 text-right">
                    {entry.net_pay.toLocaleString('sv-SE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};