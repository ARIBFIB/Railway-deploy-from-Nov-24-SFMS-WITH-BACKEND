import React, { useEffect, useState } from 'react';
import { Search, MoreHorizontal, Printer, RotateCcw, Trash2, Eye, EyeOff, Upload, Download, List } from 'lucide-react';
import { Button } from '../components/ui/button';
import { wageTypesService } from '../services/wageTypesService';

interface WageType {
  id: string;
  salaryType: string;
  name: string;
  category: string;
  unit: string;
  formula: string;
  preliminaryTax: string;
  employerContribution: string;
  preselectedAccount: string;
  isActive: boolean;
}

interface RegistrationCode {
  id: string;
  code: string;
  name: string;
  used: boolean;
  employee: boolean;
  isActive: boolean;
}

interface WageTypeControl {
  id: string;
  registrationCode: string;
  dayCode: string;
  salaryType: string;
  isActive: boolean;
}

const WageTypesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [staffType, setStaffType] = useState<'worker' | 'officials'>('worker');
  const [agreementTemplate, setAgreementTemplate] = useState<'trade' | 'worker' | 'metal'>('worker');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'nameChanged' | 'changed'>('all');
  const [selectedWageTypes, setSelectedWageTypes] = useState<string[]>([]);
  const [selectedRegistrationCodes, setSelectedRegistrationCodes] = useState<string[]>([]);
  const [selectedWageTypeControls, setSelectedWageTypeControls] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState<'salaryTypes' | 'registrationCodes' | 'wageTypeControl'>('salaryTypes');
  const [salaryForm, setSalaryForm] = useState('monthly');

  const [wageTypes, setWageTypes] = useState<WageType[]>([]);
  const [registrationCodes, setRegistrationCodes] = useState<RegistrationCode[]>([]);
  const [wageTypeControls, setWageTypeControls] = useState<WageTypeControl[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [wt, rc, wc] = await Promise.all([
          wageTypesService.listWageTypes({ status: statusFilter === 'active' ? 'active' : 'all' }),
          wageTypesService.listRegistrationCodes({ status: statusFilter === 'nameChanged' || statusFilter === 'changed' ? 'all' : statusFilter }),
          wageTypesService.listWageTypeControls({ status: statusFilter === 'nameChanged' || statusFilter === 'changed' ? 'all' : statusFilter })
        ]);
        if (!mounted) return;
        setWageTypes(
          wt.map(x => ({
            id: x.id,
            salaryType: x.salary_type,
            name: x.name,
            category: x.category || '',
            unit: x.unit || '',
            formula: x.formula || '',
            preliminaryTax: x.preliminary_tax || '',
            employerContribution: x.employer_contribution || '',
            preselectedAccount: x.preselected_account || '',
            isActive: x.is_active
          }))
        );
        setRegistrationCodes(rc.map(x => ({ id: x.id, code: x.code, name: x.name, used: x.used, employee: x.employee, isActive: x.is_active })));
        setWageTypeControls(wc.map(x => ({ id: x.id, registrationCode: x.registration_code, dayCode: x.day_code, salaryType: x.salary_type, isActive: x.is_active })));
      } catch (e) {
        console.error('Failed to load wage types data', e);
        setWageTypes([]);
        setRegistrationCodes([]);
        setWageTypeControls([]);
      }
    })();
    return () => { mounted = false; };
  }, [statusFilter]);

  const totalItems = activeTab === 'registrationCodes'
    ? registrationCodes.length
    : activeTab === 'wageTypeControl'
      ? wageTypeControls.length
      : wageTypes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSelectWageType = (wageTypeId: string) => {
    setSelectedWageTypes((prev) =>
      prev.includes(wageTypeId)
        ? prev.filter((id) => id !== wageTypeId)
        : [...prev, wageTypeId]
    );
  };

  const handleSelectAll = () => {
    if (activeTab === 'registrationCodes') {
      if (selectedRegistrationCodes.length === filteredRegistrationCodes.length) {
        setSelectedRegistrationCodes([]);
      } else {
        setSelectedRegistrationCodes(filteredRegistrationCodes.map((code) => code.id));
      }
    } else if (activeTab === 'wageTypeControl') {
      if (selectedWageTypeControls.length === filteredWageTypeControls.length) {
        setSelectedWageTypeControls([]);
      } else {
        setSelectedWageTypeControls(filteredWageTypeControls.map((control) => control.id));
      }
    } else {
      if (selectedWageTypes.length === filteredWageTypes.length) {
        setSelectedWageTypes([]);
      } else {
        setSelectedWageTypes(filteredWageTypes.map((wageType) => wageType.id));
      }
    }
  };

  const handleSelectRegistrationCode = (codeId: string) => {
    setSelectedRegistrationCodes((prev) =>
      prev.includes(codeId)
        ? prev.filter((id) => id !== codeId)
        : [...prev, codeId]
    );
  };

  const handleSelectWageTypeControl = (controlId: string) => {
    setSelectedWageTypeControls((prev) =>
      prev.includes(controlId)
        ? prev.filter((id) => id !== controlId)
        : [...prev, controlId]
    );
  };

  const handleReset = () => {
    setSearchTerm('');
    setStaffType('worker');
    setAgreementTemplate('worker');
    setStatusFilter('all');
    setSelectedWageTypes([]);
    setSelectedRegistrationCodes([]);
    setSelectedWageTypeControls([]);
  };

  const handleDisable = () => {
    if (activeTab === 'registrationCodes') {
      if (selectedRegistrationCodes.length === 0) return;
      setRegistrationCodes((prev) =>
        prev.map((code) =>
          selectedRegistrationCodes.includes(code.id)
            ? { ...code, isActive: false }
            : code
        )
      );
      setSelectedRegistrationCodes([]);
    } else if (activeTab === 'wageTypeControl') {
      if (selectedWageTypeControls.length === 0) return;
      setWageTypeControls((prev) =>
        prev.map((control) =>
          selectedWageTypeControls.includes(control.id)
            ? { ...control, isActive: false }
            : control
        )
      );
      setSelectedWageTypeControls([]);
    } else {
      if (selectedWageTypes.length === 0) return;
      setWageTypes((prev) =>
        prev.map((wageType) =>
          selectedWageTypes.includes(wageType.id)
            ? { ...wageType, isActive: false }
            : wageType
        )
      );
      setSelectedWageTypes([]);
    }
  };

  const handleActivate = () => {
    if (activeTab === 'registrationCodes') {
      if (selectedRegistrationCodes.length === 0) return;
      setRegistrationCodes((prev) =>
        prev.map((code) =>
          selectedRegistrationCodes.includes(code.id)
            ? { ...code, isActive: true }
            : code
        )
      );
      setSelectedRegistrationCodes([]);
    } else if (activeTab === 'wageTypeControl') {
      if (selectedWageTypeControls.length === 0) return;
      setWageTypeControls((prev) =>
        prev.map((control) =>
          selectedWageTypeControls.includes(control.id)
            ? { ...control, isActive: true }
            : control
        )
      );
      setSelectedWageTypeControls([]);
    } else {
      if (selectedWageTypes.length === 0) return;
      setWageTypes((prev) =>
        prev.map((wageType) =>
          selectedWageTypes.includes(wageType.id)
            ? { ...wageType, isActive: true }
            : wageType
        )
      );
      setSelectedWageTypes([]);
    }
  };

  const filteredWageTypes = wageTypes.filter((wageType) => {
    const matchesSearch = wageType.salaryType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wageType.name.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = wageType.isActive;
    if (statusFilter === 'inactive') matchesStatus = !wageType.isActive;
    // For 'nameChanged' and 'changed', we'll assume all items match for now

    return matchesSearch && matchesStatus;
  });

  const filteredRegistrationCodes = registrationCodes.filter((code) => {
    const matchesSearch = code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.name.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = code.isActive;
    if (statusFilter === 'inactive') matchesStatus = !code.isActive;

    return matchesSearch && matchesStatus;
  });

  const filteredWageTypeControls = wageTypeControls.filter((control) => {
    const matchesSearch = control.registrationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.dayCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.salaryType.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = control.isActive;
    if (statusFilter === 'inactive') matchesStatus = !control.isActive;

    return matchesSearch && matchesStatus;
  });

  const hasActiveSelected = activeTab === 'registrationCodes'
    ? selectedRegistrationCodes.some((id) => {
      const code = registrationCodes.find((c) => c.id === id);
      return code?.isActive;
    })
    : activeTab === 'wageTypeControl'
      ? selectedWageTypeControls.some((id) => {
        const control = wageTypeControls.find((c) => c.id === id);
        return control?.isActive;
      })
      : selectedWageTypes.some((id) => {
        const wageType = wageTypes.find((wt) => wt.id === id);
        return wageType?.isActive;
      });

  const hasInactiveSelected = activeTab === 'registrationCodes'
    ? selectedRegistrationCodes.some((id) => {
      const code = registrationCodes.find((c) => c.id === id);
      return !code?.isActive;
    })
    : activeTab === 'wageTypeControl'
      ? selectedWageTypeControls.some((id) => {
        const control = wageTypeControls.find((c) => c.id === id);
        return !control?.isActive;
      })
      : selectedWageTypes.some((id) => {
        const wageType = wageTypes.find((wt) => wt.id === id);
        return !wageType?.isActive;
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
          className={`px-2 py-1 text-sm ${currentPage === i
              ? 'bg-green-500 text-white'
              : 'text-gray-600 hover:text-gray-800'
            }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  const getStaffTypeLabel = () => {
    if (staffType === 'worker' && agreementTemplate === 'worker') return 'Workers - Workers';
    if (staffType === 'worker' && agreementTemplate === 'trade') return 'Workers - Trade';
    if (staffType === 'worker' && agreementTemplate === 'metal') return 'Workers - Metal';
    if (staffType === 'officials' && agreementTemplate === 'worker') return 'Officials - Workers';
    if (staffType === 'officials' && agreementTemplate === 'trade') return 'Officials - Trade';
    if (staffType === 'officials' && agreementTemplate === 'metal') return 'Officials - Metal';
    return 'Workers - Workers';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">REGISTER - WAGE TYPES AND CODES</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Salary type, Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  aria-label="Search wage types"
                />
              </div>
              <button
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                aria-label="Advanced search"
              >
                Advanced search
              </button>
            </div>
          </div>

          {/* Global Actions */}
          <div className="flex items-center space-x-4 mt-2">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <Upload className="w-4 h-4" />
              <span>Import salary type table</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <Download className="w-4 h-4" />
              <span>Export salary type table</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <List className="w-4 h-4" />
              <span>Salary type tables</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
              <Printer className="w-4 h-4" />
              <span>Printing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('salaryTypes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'salaryTypes'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Salary types
            </button>
            <button
              onClick={() => setActiveTab('registrationCodes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'registrationCodes'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Registration codes
            </button>
            <button
              onClick={() => setActiveTab('wageTypeControl')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'wageTypeControl'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Wage type control
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Staff type:</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setStaffType('worker')}
                  className={`px-3 py-1 text-sm rounded ${staffType === 'worker'
                      ? 'bg-gray-500 text-white'
                      : 'bg-white text-gray-600 border border-gray-300'
                    }`}
                >
                  Worker
                </button>
                <button
                  onClick={() => setStaffType('officials')}
                  className={`px-3 py-1 text-sm rounded ${staffType === 'officials'
                      ? 'bg-gray-500 text-white'
                      : 'bg-white text-gray-600 border border-gray-300'
                    }`}
                >
                  Officials
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Agreement template:</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setAgreementTemplate('trade')}
                  className={`px-3 py-1 text-sm rounded ${agreementTemplate === 'trade'
                      ? 'bg-gray-500 text-white'
                      : 'bg-white text-gray-600 border border-gray-300'
                    }`}
                >
                  Trade
                </button>
                <button
                  onClick={() => setAgreementTemplate('worker')}
                  className={`px-3 py-1 text-sm rounded ${agreementTemplate === 'worker'
                      ? 'bg-gray-500 text-white'
                      : 'bg-white text-gray-600 border border-gray-300'
                    }`}
                >
                  Worker
                </button>
                <button
                  onClick={() => setAgreementTemplate('metal')}
                  className={`px-3 py-1 text-sm rounded ${agreementTemplate === 'metal'
                      ? 'bg-gray-500 text-white'
                      : 'bg-white text-gray-600 border border-gray-300'
                    }`}
                >
                  Metal
                </button>
              </div>
            </div>

            {activeTab === 'wageTypeControl' && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Salary form:</span>
                <select
                  value={salaryForm}
                  onChange={(e) => setSalaryForm(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monthly">Monthly salary</option>
                  <option value="hourly">Hourly salary</option>
                  <option value="daily">Daily salary</option>
                </select>
              </div>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Wage types for {getStaffTypeLabel()}
            </h3>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'active'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'inactive'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Inactive
            </button>
            {activeTab === 'salaryTypes' && (
              <>
                <button
                  onClick={() => setStatusFilter('nameChanged')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'nameChanged'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  Name changed
                </button>
                <button
                  onClick={() => setStatusFilter('changed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'changed'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  Changed
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white">
        {/* Pagination Controls */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {activeTab === 'registrationCodes' ? (
                <>
                  {statusFilter === 'all' && `Showing all ${registrationCodes.length} registration codes`}
                  {statusFilter === 'active' && `Showing ${filteredRegistrationCodes.length} active registration codes`}
                  {statusFilter === 'inactive' && `Showing ${filteredRegistrationCodes.length} inactive registration codes`}
                </>
              ) : activeTab === 'wageTypeControl' ? (
                <>
                  {statusFilter === 'all' && `Showing all ${wageTypeControls.length} wage type controls`}
                  {statusFilter === 'active' && `Showing ${filteredWageTypeControls.length} active wage type controls`}
                  {statusFilter === 'inactive' && `Showing ${filteredWageTypeControls.length} inactive wage type controls`}
                </>
              ) : (
                <>
                  {statusFilter === 'all' && `Showing all ${wageTypes.length} wage types`}
                  {statusFilter === 'active' && `Showing ${filteredWageTypes.length} active wage types`}
                  {statusFilter === 'inactive' && `Showing ${filteredWageTypes.length} inactive wage types`}
                  {statusFilter === 'nameChanged' && `Showing ${filteredWageTypes.length} name changed wage types`}
                  {statusFilter === 'changed' && `Showing ${filteredWageTypes.length} changed wage types`}
                </>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                aria-label="Items per page"
              >
                <option value={10}>10</option>
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
          {activeTab === 'wageTypeControl' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedWageTypeControls.length === filteredWageTypeControls.length && filteredWageTypeControls.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      aria-label="Select all wage type controls"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                    REGISTRATION CODE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DAY CODE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SALARY TYPE
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWageTypeControls.length > 0 ? (
                  filteredWageTypeControls.map((control) => (
                    <tr key={control.id} className={!control.isActive ? 'bg-gray-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedWageTypeControls.includes(control.id)}
                          onChange={() => handleSelectWageTypeControl(control.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          aria-label={`Select wage type control ${control.registrationCode}`}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {control.registrationCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {control.dayCode}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {control.salaryType}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      {statusFilter === 'active' && 'No active wage type controls found'}
                      {statusFilter === 'inactive' && 'No inactive wage type controls found'}
                      {statusFilter === 'all' && 'No wage type controls found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : activeTab === 'registrationCodes' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRegistrationCodes.length === filteredRegistrationCodes.length && filteredRegistrationCodes.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      aria-label="Select all registration codes"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                    CODE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    USED
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EMPLOYEE
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRegistrationCodes.length > 0 ? (
                  filteredRegistrationCodes.map((code) => (
                    <tr key={code.id} className={!code.isActive ? 'bg-gray-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedRegistrationCodes.includes(code.id)}
                          onChange={() => handleSelectRegistrationCode(code.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          aria-label={`Select registration code ${code.code}`}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {code.code}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {code.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {code.used ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setRegistrationCodes(prev =>
                              prev.map(c =>
                                c.id === code.id ? { ...c, employee: !c.employee } : c
                              )
                            );
                          }}
                          className={`px-3 py-1 text-sm rounded ${code.employee
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                            }`}
                        >
                          {code.employee ? 'YES' : 'NO'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      {statusFilter === 'active' && 'No active registration codes found'}
                      {statusFilter === 'inactive' && 'No inactive registration codes found'}
                      {statusFilter === 'all' && 'No registration codes found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedWageTypes.length === filteredWageTypes.length && filteredWageTypes.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      aria-label="Select all wage types"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                    SALARY TYPE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SALARY TYPE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UNIT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    FORMULA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PRELIMINARY TAX
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EMPLOYER'S CONTRIBUTION
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PRE-SELECTED ACCOUNT
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWageTypes.length > 0 ? (
                  filteredWageTypes.map((wageType) => (
                    <tr key={wageType.id} className={!wageType.isActive ? 'bg-gray-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedWageTypes.includes(wageType.id)}
                          onChange={() => handleSelectWageType(wageType.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          aria-label={`Select wage type ${wageType.salaryType}`}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {wageType.salaryType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {wageType.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {wageType.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {wageType.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {wageType.formula}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {wageType.preliminaryTax}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {wageType.employerContribution}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {wageType.preselectedAccount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                      {statusFilter === 'active' && 'No active wage types found'}
                      {statusFilter === 'inactive' && 'No inactive wage types found'}
                      {statusFilter === 'nameChanged' && 'No name changed wage types found'}
                      {statusFilter === 'changed' && 'No changed wage types found'}
                      {statusFilter === 'all' && 'No wage types found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center space-x-2"
                aria-label="Reset filters"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleDisable}
                disabled={
                  activeTab === 'registrationCodes'
                    ? selectedRegistrationCodes.length === 0
                    : activeTab === 'wageTypeControl'
                      ? selectedWageTypeControls.length === 0
                      : selectedWageTypes.length === 0
                }
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${(activeTab === 'registrationCodes'
                    ? selectedRegistrationCodes.length > 0
                    : activeTab === 'wageTypeControl'
                      ? selectedWageTypeControls.length > 0
                      : selectedWageTypes.length > 0)
                    ? 'bg-gray-500 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                aria-label={`Disable selected ${activeTab === 'registrationCodes'
                    ? 'registration codes'
                    : activeTab === 'wageTypeControl'
                      ? 'wage type controls'
                      : 'wage types'
                  }`}
              >
                <EyeOff className="w-4 h-4" />
                <span>Disable ({
                  activeTab === 'registrationCodes'
                    ? selectedRegistrationCodes.length
                    : activeTab === 'wageTypeControl'
                      ? selectedWageTypeControls.length
                      : selectedWageTypes.length
                })</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleActivate}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${hasInactiveSelected
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                disabled={!hasInactiveSelected}
                aria-label="Activate selected wage types"
              >
                <Eye className="w-4 h-4" />
                <span>Activate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WageTypesPage;
