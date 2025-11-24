import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Search,
  FolderOpen,
  Upload,
  Download,
  RotateCcw,
  Calendar,
  Clock,
  Menu,
  ChevronDown,
  X
} from 'lucide-react';

const SalaryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('active');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  
  // Payroll processing state
  const [payPeriod, setPayPeriod] = useState('all-periods');
  const [employee, setEmployee] = useState('all-employees');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayrolls, setSelectedPayrolls] = useState<string[]>([]);
  const [payrollSubTab, setPayrollSubTab] = useState('payroll-processing');
  
  // Send payslip digitally modal state
  const [showSendPayslipModal, setShowSendPayslipModal] = useState(false);
  const [paySlipType, setPaySlipType] = useState('digital');
  const [changesCount, setChangesCount] = useState(0);
  const [employeeData, setEmployeeData] = useState([
    {
      id: '1',
      name: 'John Doe',
      socialSecurityNumber: '19900101-1234',
      email: 'john.doe@example.com',
      paySlipType: 'digital'
    },
    {
      id: '2',
      name: 'Jane Smith',
      socialSecurityNumber: '19850515-5678',
      email: 'jane.smith@example.com',
      paySlipType: 'paper'
    }
  ]);

  // Create payslip modal state
  const [showCreatePayslipModal, setShowCreatePayslipModal] = useState(false);
  const [activePayslipTab, setActivePayslipTab] = useState('payslip');
  const [createPayPeriod, setCreatePayPeriod] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [showEnded, setShowEnded] = useState(false);
  const [bringBlankPayslips, setBringBlankPayslips] = useState(false);

  // Vacation calculation state
  const [vacationSearchTerm, setVacationSearchTerm] = useState('');
  const [staffType, setStaffType] = useState('all-staff-types');
  const [vacationEmployee, setVacationEmployee] = useState('all-employees');
  const [vacationYear, setVacationYear] = useState('all-years');
  const [vacationPeriod, setVacationPeriod] = useState('all-periods');
  const [activeVacationFilter, setActiveVacationFilter] = useState('all');
  const [selectedVacations, setSelectedVacations] = useState<string[]>([]);

  // Employer declaration state
  const [declarationFilter, setDeclarationFilter] = useState('all');
  const [selectedDeclarations, setSelectedDeclarations] = useState<string[]>([]);

  // Accounting documents state
  const [accountingSearchTerm, setAccountingSearchTerm] = useState('');
  const [accountingFilter, setAccountingFilter] = useState('not-booked');
  const [selectedAccountingDocs, setSelectedAccountingDocs] = useState<string[]>([]);

  // Create accounting documents modal state
  const [showCreateAccountingModal, setShowCreateAccountingModal] = useState(false);
  const [accountingSalary, setAccountingSalary] = useState('');
  const [accountingEmployerDeclaration, setAccountingEmployerDeclaration] = useState('');
  const [accountingHolidayDebt, setAccountingHolidayDebt] = useState('');
  const [activatePostVacationDebt, setActivatePostVacationDebt] = useState(false);

  // Create employer declaration modal state
  const [showCreateEmployerModal, setShowCreateEmployerModal] = useState(false);
  const [taxPeriod, setTaxPeriod] = useState('2025.S.01');
  const [showTaxPeriodDropdown, setShowTaxPeriodDropdown] = useState(false);

  // Create vacation calculation modal state
  const [showCreateVacationModal, setShowCreateVacationModal] = useState(false);
  const [vacationStaffType, setVacationStaffType] = useState('all-staff-types');
  const [vacationModalEmployee, setVacationModalEmployee] = useState('all-employees');
  const [createEmptyDate, setCreateEmptyDate] = useState('2025-09-30');

  // Statistics state
  const [statisticsSearchTerm, setStatisticsSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('September 2025');
  const [selectedCfarNumber, setSelectedCfarNumber] = useState('All');
  const [selectedStatisticsEmployee, setSelectedStatisticsEmployee] = useState('All');
  const [selectedStatistics, setSelectedStatistics] = useState<string[]>([]);
  const [activeStatisticsTab, setActiveStatisticsTab] = useState('scb-wage-structure');
  
  // Swedish Business Sector Wage Statistics state
  const [swedishStatsSearchTerm, setSwedishStatsSearchTerm] = useState('');
  const [selectedInterval, setSelectedInterval] = useState('All');
  const [selectedSwedishCfarNumber, setSelectedSwedishCfarNumber] = useState('All');
  const [selectedSwedishEmployee, setSelectedSwedishEmployee] = useState('All');
  const [selectedSwedishStats, setSelectedSwedishStats] = useState<string[]>([]);
  
  // SCB Economic Statistics (KLP) state
  const [klpStatsSearchTerm, setKlpStatsSearchTerm] = useState('');
  const [selectedKlpMonth, setSelectedKlpMonth] = useState('All');
  const [selectedKlpCfarNumber, setSelectedKlpCfarNumber] = useState('All');
  const [selectedKlpStats, setSelectedKlpStats] = useState<string[]>([]);
  
  // Statistics Sweden Business cycle statistics on sick pay (KSJU) state
  const [ksjuStatsSearchTerm, setKsjuStatsSearchTerm] = useState('');
  const [selectedKsjuMonth, setSelectedKsjuMonth] = useState('All');
  const [selectedKsjuEmployee, setSelectedKsjuEmployee] = useState('All');
  const [selectedKsjuStats, setSelectedKsjuStats] = useState<string[]>([]);
  
  // SCB Sickness absence during the sick pay period (SUS) state
  const [susStatsSearchTerm, setSusStatsSearchTerm] = useState('');
  const [selectedSusMonth, setSelectedSusMonth] = useState('All');
  const [selectedSusEmployee, setSelectedSusEmployee] = useState('All');
  const [selectedSusStats, setSelectedSusStats] = useState<string[]>([]);
  
  // Create SLP modal state
  const [showCreateSlpModal, setShowCreateSlpModal] = useState(false);
  const [slpModalEmployee, setSlpModalEmployee] = useState('All');
  const [slpModalMonth, setSlpModalMonth] = useState('September 2025');
  const [slpFilterStatus, setSlpFilterStatus] = useState('unpaid');
  
  // SCB Short-term employment statistics for the private sector (KSP) state
  const [kspStatsSearchTerm, setKspStatsSearchTerm] = useState('');
  const [selectedKspCfarNumber, setSelectedKspCfarNumber] = useState('All');
  const [selectedKspStats, setSelectedKspStats] = useState<string[]>([]);
  
  // Forum Monthly Reporting state
  const [activeForumTab, setActiveForumTab] = useState('monthly-report');
  const [forumSelectedMonth, setForumSelectedMonth] = useState('All');
  const [forumSelectedEmployee, setForumSelectedEmployee] = useState('All');
  const [selectedMarkup, setSelectedMarkup] = useState('All');
  const [reportStatusFilter, setReportStatusFilter] = useState('file-created');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  
  // Forum Annual Reporting state
  const [forumSearchTerm, setForumSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [annualSelectedEmployee, setAnnualSelectedEmployee] = useState('All employees');
  const [annualSelectedMarkup, setAnnualSelectedMarkup] = useState('Not drawn');
  const [employeeTypeFilter, setEmployeeTypeFilter] = useState('all');
  const [selectedAnnualReports, setSelectedAnnualReports] = useState<string[]>([]);
  
  // Salary Reporting Forums modal state
  const [showSalaryReportingModal, setShowSalaryReportingModal] = useState(false);
  const [selectedReportingMonth, setSelectedReportingMonth] = useState('January');
  const [selectedReportingYear, setSelectedReportingYear] = useState('2025');
  const [isYearSelection, setIsYearSelection] = useState(false);
  
  // Create SN modal state
  const [showCreateSnModal, setShowCreateSnModal] = useState(false);
  const [snSelectedEmployee, setSnSelectedEmployee] = useState('All');
  const [snSelectedMonth, setSnSelectedMonth] = useState('September 2025');
  const [snFilterStatus, setSnFilterStatus] = useState('all');
  
  // Create KLP modal state
  const [showCreateKlpModal, setShowCreateKlpModal] = useState(false);
  const [klpSelectedEmployee, setKlpSelectedEmployee] = useState('All');
  const [klpSelectedMonth, setKlpSelectedMonth] = useState('January');
  const [klpFilterStatus, setKlpFilterStatus] = useState('unpaid');
  
  // Create KSJU modal state
  const [showCreateKsjuModal, setShowCreateKsjuModal] = useState(false);
  const [ksjuSelectedEmployee, setKsjuSelectedEmployee] = useState('All');
  const [ksjuSelectedMonth, setKsjuSelectedMonth] = useState('January');
  
  // Create SUS modal state
  const [showCreateSusModal, setShowCreateSusModal] = useState(false);
  const [susSelectedEmployee, setSusSelectedEmployee] = useState('All');
  const [susSelectedMonth, setSusSelectedMonth] = useState('January');
  
  // Create KSP modal state
  const [showCreateKspModal, setShowCreateKspModal] = useState(false);
  const [kspSelectedEmployee, setKspSelectedEmployee] = useState('All');
  const [kspSelectedDate, setKspSelectedDate] = useState('');
  
  // Collection state
  const [collectionSearchTerm, setCollectionSearchTerm] = useState('');
  const [collectionTypeFilter, setCollectionTypeFilter] = useState('All');
  const [collectionEventFilter, setCollectionEventFilter] = useState('All');
  const [collectionMonthFilter, setCollectionMonthFilter] = useState('All');
  const [collectionEmployeeFilter, setCollectionEmployeeFilter] = useState('All');
  const [collectionStatusFilter, setCollectionStatusFilter] = useState('All');
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  
  // Collection modals state
  const [showCreatePreparationModal, setShowCreatePreparationModal] = useState(false);
  const [showItp1Modal, setShowItp1Modal] = useState(false);
  const [showItp2Modal, setShowItp2Modal] = useState(false);
  
  // Create Preparation modal state
  const [preparationType, setPreparationType] = useState('All');
  const [preparationEmployee, setPreparationEmployee] = useState('All');
  const [preparationMonth, setPreparationMonth] = useState('January');
  
  // ITP1 modal state
  const [itp1Employee, setItp1Employee] = useState('');
  const [itp1Month, setItp1Month] = useState('September');
  const [itp1CostCenter, setItp1CostCenter] = useState('');
  const [itp1ProductTime, setItp1ProductTime] = useState('');
  const [itp1EventType, setItp1EventType] = useState('ITP1 Deregistration');
  const [itp1EventTime, setItp1EventTime] = useState('');
  const [itp1PaidSalary, setItp1PaidSalary] = useState('');
  const [itp1ReasonForDeparture, setItp1ReasonForDeparture] = useState('Terminated employment');
  
  // ITP2 modal state
  const [itp2Employee, setItp2Employee] = useState('');
  const [itp2CostCenter, setItp2CostCenter] = useState('');
  const [itp2ProductTime, setItp2ProductTime] = useState('');
  const [itp2EventTime, setItp2EventTime] = useState('');
  const [itp2EventType, setItp2EventType] = useState('ITP2 Deregistration');
  const [itp2ReasonForDeparture, setItp2ReasonForDeparture] = useState('Terminated employment');
  const [itp2SalaryBasis, setItp2SalaryBasis] = useState('All');
  const [itp2VariableSalary1, setItp2VariableSalary1] = useState('-');
  const [itp2VariableSalary2, setItp2VariableSalary2] = useState('-');
  const [itp2VariableSalary3, setItp2VariableSalary3] = useState('-');
  const [itp2FixedSalary, setItp2FixedSalary] = useState('');
  const [itp2Supplements, setItp2Supplements] = useState('');
  const [itp2AverageVariableSalary, setItp2AverageVariableSalary] = useState('');
  const [itp2IncapacityDegree, setItp2IncapacityDegree] = useState('');
  const [itp2AnnualSalaryAfterWaiver, setItp2AnnualSalaryAfterWaiver] = useState('0');
  const [itp2AnnualSalary, setItp2AnnualSalary] = useState('0');

  // Debug activeTab changes
  useEffect(() => {
    console.log('Current activeTab:', activeTab);
  }, [activeTab]);
  
  // Extra payslip form state
  const [paymentDate, setPaymentDate] = useState('');
  const [payPeriodStartDate, setPayPeriodStartDate] = useState('');
  const [payPeriodEndDate, setPayPeriodEndDate] = useState('');
  const [deviationStartDate, setDeviationStartDate] = useState('');
  const [deviationEndDate, setDeviationEndDate] = useState('');
  const [takeFromCalendar, setTakeFromCalendar] = useState({
    corrections: false,
    times: false,
    other: false
  });

  // Filter handlers
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const getFilterColor = (filter: string) => {
    // Use activeFilter to avoid linter warning
    console.log('Current active filter:', activeFilter);
    switch (filter) {
      case 'all': return 'bg-white text-gray-800 border border-gray-300';
      case 'active': return 'bg-gray-100 text-gray-800 border border-gray-400';
      case 'inactive': return 'bg-white text-gray-800 border border-gray-300';
      default: return 'bg-white text-gray-800 border border-gray-300';
    }
  };

  // Action handlers
  const handleImportHistory = () => {
    console.log('Import history clicked');
  };

  const handleImportPayrollData = () => {
    console.log('Import payroll data clicked');
  };

  const handleExportPayrollData = () => {
    console.log('Export payroll data clicked');
  };

  const handleRetroactiveSalary = () => {
    console.log('Retroactive salary clicked');
  };

  const handleGoToPersonnelRegister = () => {
    console.log('Go to personnel register clicked');
  };

  const handleReadMore = () => {
    console.log('Read more clicked');
  };

  // Payroll processing handlers
  const handleTabChange = (tab: string) => {
    console.log('Changing tab to:', tab);
    setActiveTab(tab);
  };

  const handleSendPaySlipDigitally = () => {
    setShowSendPayslipModal(true);
  };

  const handleCloseSendPayslipModal = () => {
    setShowSendPayslipModal(false);
  };

  const handleRemindMeLater = () => {
    setShowSendPayslipModal(false);
  };

  const handleChangeAllOnPage = () => {
    const updatedData = employeeData.map(emp => ({
      ...emp,
      paySlipType: paySlipType
    }));
    setEmployeeData(updatedData);
    setChangesCount(employeeData.length);
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', employeeData);
    setShowSendPayslipModal(false);
    setChangesCount(0);
  };

  const handleEmployeePaySlipTypeChange = (employeeId: string, newType: string) => {
    const updatedData = employeeData.map(emp => 
      emp.id === employeeId ? { ...emp, paySlipType: newType } : emp
    );
    setEmployeeData(updatedData);
    setChangesCount(prev => prev + 1);
  };

  const handleCreatePaySlip = () => {
    setShowCreatePayslipModal(true);
  };

  const handleCloseCreatePayslipModal = () => {
    setShowCreatePayslipModal(false);
  };

  const handlePayslipTabChange = (tab: string) => {
    setActivePayslipTab(tab);
  };

  const handleCancelCreatePayslip = () => {
    setShowCreatePayslipModal(false);
  };

  const handleStartHelpGuide = () => {
    console.log('Start help guide clicked');
  };

  const handleCreatePayslipSubmit = () => {
    console.log('Create payslip submitted:', {
      tab: activePayslipTab,
      payPeriod: createPayPeriod,
      selectedEmployee,
      showInactive,
      showEnded,
      bringBlankPayslips,
      paymentDate,
      payPeriodStartDate,
      payPeriodEndDate,
      deviationStartDate,
      deviationEndDate,
      takeFromCalendar
    });
    setShowCreatePayslipModal(false);
    // Reset form
    setCreatePayPeriod('');
    setSelectedEmployee('');
    setShowInactive(false);
    setShowEnded(false);
    setBringBlankPayslips(false);
    setPaymentDate('');
    setPayPeriodStartDate('');
    setPayPeriodEndDate('');
    setDeviationStartDate('');
    setDeviationEndDate('');
    setTakeFromCalendar({ corrections: false, times: false, other: false });
  };

  const handleTakeFromCalendarChange = (field: string) => {
    setTakeFromCalendar(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  // Vacation calculation handlers
  const handleVacationFilterChange = (filter: string) => {
    setActiveVacationFilter(filter);
  };

  const getVacationFilterColor = (filter: string) => {
    // Use activeVacationFilter to avoid linter warning
    console.log('Current active vacation filter:', activeVacationFilter);
    switch (filter) {
      case 'all': return 'bg-white text-gray-800 border border-gray-300';
      case 'created-documents': return 'bg-gray-100 text-gray-800 border border-gray-300';
      case 'basis-booked': return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'included-end-year': return 'bg-green-100 text-green-800 border border-green-300';
      default: return 'bg-white text-gray-800 border border-gray-300';
    }
  };

  const handleCreateVacationCalculation = () => {
    setShowCreateVacationModal(true);
  };

  const handleCloseCreateVacationModal = () => {
    setShowCreateVacationModal(false);
  };

  const handleCancelCreateVacation = () => {
    setShowCreateVacationModal(false);
  };

  const handleCreateVacationSubmit = () => {
    console.log('Creating vacation calculation with:', {
      staffType: vacationStaffType,
      employee: vacationModalEmployee,
      createEmptyDate: createEmptyDate
    });
    setShowCreateVacationModal(false);
    // Reset form
    setVacationStaffType('all-staff-types');
    setVacationModalEmployee('all-employees');
    setCreateEmptyDate('2025-09-30');
  };

  const handleVacationReadMore = () => {
    console.log('Read more clicked');
  };

  const handleClearVacationFilters = () => {
    setStaffType('all-staff-types');
    setVacationEmployee('all-employees');
    setVacationYear('all-years');
    setVacationPeriod('all-periods');
    setSelectedVacations([]);
  };

  const handleVacationDelete = () => {
    console.log('Delete vacation calculations clicked');
  };

  const handleBackOffHolidayYearEnd = () => {
    console.log('Back off holiday year-end clicked');
  };

  const handleEndOfHolidayYear = () => {
    console.log('End of the holiday year clicked');
  };

  const handleHolidayDebt = () => {
    console.log('Holiday debt clicked');
  };

  const handleVacationPrinting = () => {
    console.log('Printing clicked');
  };

  // Statistics handlers
  const handleSelectAllStatistics = () => {
    if (selectedStatistics.length === 0) {
      setSelectedStatistics(['1', '2', '3']);
    } else {
      setSelectedStatistics([]);
    }
  };

  const handleCreateSLP = () => {
    setShowCreateSlpModal(true);
  };

  const handleDeleteStatistics = () => {
    console.log('Deleting selected statistics:', selectedStatistics);
  };

  const handlePrintStatistics = () => {
    console.log('Printing statistics');
  };

  const handleCreateFile = () => {
    console.log('Creating file');
  };

  // Swedish Business Sector Wage Statistics handlers
  const handleStatisticsTabChange = (tab: string) => {
    setActiveStatisticsTab(tab);
  };

  const handleSelectAllSwedishStats = () => {
    if (selectedSwedishStats.length === 0) {
      setSelectedSwedishStats(['1', '2', '3']);
    } else {
      setSelectedSwedishStats([]);
    }
  };

  const handleCreateSN = () => {
    setShowCreateSnModal(true);
  };

  const handleDeleteSwedishStats = () => {
    console.log('Deleting selected Swedish stats:', selectedSwedishStats);
  };

  const handlePrintSwedishStats = () => {
    console.log('Printing Swedish stats');
  };

  const handleCreateSwedishFile = () => {
    console.log('Creating Swedish file');
  };

  // SCB Economic Statistics (KLP) handlers
  const handleSelectAllKlpStats = () => {
    if (selectedKlpStats.length === 0) {
      setSelectedKlpStats(['1', '2', '3']);
    } else {
      setSelectedKlpStats([]);
    }
  };

  const handleCreateKLP = () => {
    setShowCreateKlpModal(true);
  };

  const handleDeleteKlpStats = () => {
    console.log('Deleting selected KLP stats:', selectedKlpStats);
  };

  const handlePrintKlpStats = () => {
    console.log('Printing KLP stats');
  };

  const handleCreateKlpFile = () => {
    console.log('Creating KLP file');
  };

  // Statistics Sweden Business cycle statistics on sick pay (KSJU) handlers
  const handleSelectAllKsjuStats = () => {
    if (selectedKsjuStats.length === 0) {
      setSelectedKsjuStats(['1', '2', '3']);
    } else {
      setSelectedKsjuStats([]);
    }
  };

  const handleCreateKSJU = () => {
    setShowCreateKsjuModal(true);
  };

  const handleDeleteKsjuStats = () => {
    console.log('Deleting selected KSJU stats:', selectedKsjuStats);
  };

  const handlePrintKsjuStats = () => {
    console.log('Printing KSJU stats');
  };

  const handleCreateKsjuFile = () => {
    console.log('Creating KSJU file');
  };

  // SCB Sickness absence during the sick pay period (SUS) handlers
  const handleSelectAllSusStats = () => {
    if (selectedSusStats.length === 0) {
      setSelectedSusStats(['1', '2', '3']);
    } else {
      setSelectedSusStats([]);
    }
  };

  const handleCreateSUS = () => {
    setShowCreateSusModal(true);
  };

  const handleDeleteSusStats = () => {
    console.log('Deleting selected SUS stats:', selectedSusStats);
  };

  const handlePrintSusStats = () => {
    console.log('Printing SUS stats');
  };

  const handleCreateSusFile = () => {
    console.log('Creating SUS file');
  };

  // Create SLP modal handlers
  const handleCloseCreateSlpModal = () => {
    setShowCreateSlpModal(false);
  };

  const handleSlpFilterChange = (status: string) => {
    setSlpFilterStatus(status);
  };

  const handleCreateSlpSubmit = () => {
    console.log('Creating SLP with employee:', slpModalEmployee, 'month:', slpModalMonth);
    setShowCreateSlpModal(false);
  };

  const handleCancelCreateSlp = () => {
    setShowCreateSlpModal(false);
  };

  // SCB Short-term employment statistics for the private sector (KSP) handlers
  const handleSelectAllKspStats = () => {
    if (selectedKspStats.length === 0) {
      setSelectedKspStats(['1', '2', '3']);
    } else {
      setSelectedKspStats([]);
    }
  };

  const handleCreateKSP = () => {
    setShowCreateKspModal(true);
  };

  const handleDeleteKspStats = () => {
    console.log('Deleting selected KSP stats:', selectedKspStats);
  };

  const handlePrintKspStats = () => {
    console.log('Printing KSP stats');
  };

  // Forum Monthly Reporting handlers
  const handleForumTabChange = (tab: string) => {
    setActiveForumTab(tab);
  };

  const handleCreateMonthlyReport = () => {
    setIsYearSelection(false);
    setShowSalaryReportingModal(true);
  };

  const handleClearFilters = () => {
    setForumSelectedMonth('All');
    setForumSelectedEmployee('All');
    setSelectedMarkup('All');
  };

  const handleReportStatusFilterChange = (filter: string) => {
    setReportStatusFilter(filter);
  };

  const handleSelectAllReports = () => {
    if (selectedReports.length === 0) {
      setSelectedReports(['1']);
    } else {
      setSelectedReports([]);
    }
  };

  const handleDeleteReports = () => {
    console.log('Deleting selected reports:', selectedReports);
  };

  const handleCreateForumFile = () => {
    console.log('Creating file');
  };

  const getReportStatusFilterColor = (filter: string) => {
    return reportStatusFilter === filter 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // Forum Annual Reporting handlers
  const handleCreateAnnualReport = () => {
    setIsYearSelection(true);
    setShowSalaryReportingModal(true);
  };

  const handleAddMarkup = () => {
    console.log('Adding markup');
  };

  const handleEmployeeTypeFilterChange = (type: string) => {
    setEmployeeTypeFilter(type);
  };

  const handleSelectAllAnnualReports = () => {
    if (selectedAnnualReports.length === 0) {
      setSelectedAnnualReports(['1']);
    } else {
      setSelectedAnnualReports([]);
    }
  };

  const handleGoToForaSe = () => {
    console.log('Going to fora.se');
  };

  const handlePrintingForumMaterials = () => {
    console.log('Printing Forum materials');
  };

  const handlePrintingSalaryReports = () => {
    console.log('Printing salary reports');
  };

  const getEmployeeTypeFilterColor = (type: string) => {
    return employeeTypeFilter === type 
      ? 'bg-gray-200 text-gray-800 border-gray-300' 
      : 'bg-white text-gray-700 border-gray-300';
  };

  // Salary Reporting Forums modal handlers
  const handleOpenSalaryReportingModal = () => {
    setShowSalaryReportingModal(true);
  };

  const handleCloseSalaryReportingModal = () => {
    setShowSalaryReportingModal(false);
  };

  const handleSalaryReportingSubmit = () => {
    if (isYearSelection) {
      console.log('Creating salary reporting for year:', selectedReportingYear);
    } else {
      console.log('Creating salary reporting for month:', selectedReportingMonth);
    }
    setShowSalaryReportingModal(false);
  };

  const handleCancelSalaryReporting = () => {
    setShowSalaryReportingModal(false);
  };

  // Create SN modal handlers
  const handleOpenCreateSnModal = () => {
    setShowCreateSnModal(true);
  };

  const handleCloseCreateSnModal = () => {
    setShowCreateSnModal(false);
  };

  const handleCreateSnSubmit = () => {
    console.log('Creating SN with:', { snSelectedEmployee, snSelectedMonth, snFilterStatus });
    setShowCreateSnModal(false);
  };

  const handleCancelCreateSn = () => {
    setShowCreateSnModal(false);
  };

  const handleSnFilterChange = (status: string) => {
    setSnFilterStatus(status);
  };

  // Create KLP modal handlers
  const handleOpenCreateKlpModal = () => {
    setShowCreateKlpModal(true);
  };

  const handleCloseCreateKlpModal = () => {
    setShowCreateKlpModal(false);
  };

  const handleCreateKlpSubmit = () => {
    console.log('Creating KLP with:', { klpSelectedEmployee, klpSelectedMonth, klpFilterStatus });
    setShowCreateKlpModal(false);
  };

  const handleCancelCreateKlp = () => {
    setShowCreateKlpModal(false);
  };

  const handleKlpFilterChange = (status: string) => {
    setKlpFilterStatus(status);
  };

  // Create KSJU modal handlers
  const handleOpenCreateKsjuModal = () => {
    setShowCreateKsjuModal(true);
  };

  const handleCloseCreateKsjuModal = () => {
    setShowCreateKsjuModal(false);
  };

  const handleCreateKsjuSubmit = () => {
    console.log('Creating KSJU with:', { ksjuSelectedEmployee, ksjuSelectedMonth });
    setShowCreateKsjuModal(false);
  };

  const handleCancelCreateKsju = () => {
    setShowCreateKsjuModal(false);
  };

  // Create SUS modal handlers
  const handleOpenCreateSusModal = () => {
    setShowCreateSusModal(true);
  };

  const handleCloseCreateSusModal = () => {
    setShowCreateSusModal(false);
  };

  const handleCreateSusSubmit = () => {
    console.log('Creating SUS with:', { susSelectedEmployee, susSelectedMonth });
    setShowCreateSusModal(false);
  };

  const handleCancelCreateSus = () => {
    setShowCreateSusModal(false);
  };

  // Create KSP modal handlers
  const handleOpenCreateKspModal = () => {
    setShowCreateKspModal(true);
  };

  const handleCloseCreateKspModal = () => {
    setShowCreateKspModal(false);
  };

  const handleCreateKspSubmit = () => {
    console.log('Creating KSP with:', { kspSelectedEmployee, kspSelectedDate });
    setShowCreateKspModal(false);
  };

  const handleCancelCreateKsp = () => {
    setShowCreateKspModal(false);
  };

  // Collection handlers
  const handleCreateCollection = () => {
    setShowCreatePreparationModal(true);
  };

  const handleSelectAllCollections = () => {
    if (selectedCollections.length === 0) {
      setSelectedCollections(['1', '2', '3']);
    } else {
      setSelectedCollections([]);
    }
  };

  const handleDeleteCollections = () => {
    console.log('Deleting selected collections:', selectedCollections);
  };

  const handlePrintCollections = () => {
    console.log('Printing collections');
  };

  const handleCreateCollectionFile = () => {
    console.log('Creating collection file');
  };


  // Collection modal handlers
  const handleCloseCreatePreparationModal = () => {
    setShowCreatePreparationModal(false);
  };

  const handleCreatePreparationSubmit = () => {
    console.log('Creating preparation with:', { preparationType, preparationEmployee, preparationMonth });
    setShowCreatePreparationModal(false);
  };

  const handleCancelCreatePreparation = () => {
    setShowCreatePreparationModal(false);
  };

  const handleOpenItp1Modal = () => {
    setShowItp1Modal(true);
  };

  const handleCloseItp1Modal = () => {
    setShowItp1Modal(false);
  };

  const handleItp1Submit = () => {
    console.log('Submitting ITP1 incident report');
    setShowItp1Modal(false);
  };

  const handleCancelItp1 = () => {
    setShowItp1Modal(false);
  };

  const handleOpenItp2Modal = () => {
    setShowItp2Modal(true);
  };

  const handleCloseItp2Modal = () => {
    setShowItp2Modal(false);
  };

  const handleItp2Submit = () => {
    console.log('Submitting ITP2 incident report');
    setShowItp2Modal(false);
  };

  const handleCancelItp2 = () => {
    setShowItp2Modal(false);
  };

  const handleRecreateItp2 = () => {
    console.log('Recreating ITP2');
  };

  // Employer declaration handlers
  const handleDeclarationFilterChange = (filter: string) => {
    setDeclarationFilter(filter);
  };

  const getDeclarationFilterColor = (filter: string) => {
    console.log('Current declaration filter:', declarationFilter);
    switch (filter) {
      case 'created':
        return 'border-l-blue-400';
      case 'preliminary':
        return 'border-l-blue-400';
      case 'submitted':
        return 'border-l-green-400';
      case 'changed':
        return 'border-l-yellow-400';
      case 'incorrect':
        return 'border-l-red-400';
      default:
        return '';
    }
  };

  const handleSelectAllDeclarations = () => {
    if (selectedDeclarations.length === 0) {
      setSelectedDeclarations(['1', '2', '3']);
    } else {
      setSelectedDeclarations([]);
    }
  };

  const handleCreateEmployerDeclaration = () => {
    setShowCreateEmployerModal(true);
  };

  const handleCloseCreateEmployerModal = () => {
    setShowCreateEmployerModal(false);
    setShowTaxPeriodDropdown(false);
  };

  const handleCancelCreateEmployer = () => {
    setShowCreateEmployerModal(false);
    setShowTaxPeriodDropdown(false);
  };

  const handleStartHelpGuideEmployer = () => {
    console.log('Starting help guide for employer declaration');
  };

  const handleCreateEmployerSubmit = () => {
    console.log('Creating employer declaration with tax period:', taxPeriod);
    setShowCreateEmployerModal(false);
    // Reset form
    setTaxPeriod('2025.S.01');
  };

  // Tax period options
  const taxPeriodOptions = [
    '2025.S.01', '2025.S.02', '2025.S.03', '2025.S.04', '2025.S.05', '2025.S.06',
    '2025.S.07', '2025.S.08', '2025.S.09', '2025.S.10', '2025.S.11', '2025.S.12'
  ];

  const handleTaxPeriodSelect = (period: string) => {
    setTaxPeriod(period);
    setShowTaxPeriodDropdown(false);
  };

  const handleTaxPeriodDropdownToggle = () => {
    setShowTaxPeriodDropdown(!showTaxPeriodDropdown);
  };

  const handleDeleteDeclaration = () => {
    console.log('Deleting selected declarations:', selectedDeclarations);
  };

  const handleRecreateDeclaration = () => {
    console.log('Recreating selected declarations:', selectedDeclarations);
  };

  const handlePrintDeclaration = () => {
    console.log('Printing selected declarations:', selectedDeclarations);
  };

  const handlePerformDeclaration = () => {
    console.log('Performing selected declarations:', selectedDeclarations);
  };

  // Payroll sub-tab handler
  const handlePayrollSubTabChange = (subTab: string) => {
    setPayrollSubTab(subTab);
  };

  // Accounting documents handlers
  const handleAccountingFilterChange = (filter: string) => {
    setAccountingFilter(filter);
  };

  const getAccountingFilterColor = (filter: string) => {
    console.log('Current accounting filter:', accountingFilter);
    switch (filter) {
      case 'not-booked':
        return 'bg-yellow-100 text-yellow-800';
      case 'booked':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectAllAccountingDocs = () => {
    if (selectedAccountingDocs.length === 0) {
      setSelectedAccountingDocs(['1', '2', '3']);
    } else {
      setSelectedAccountingDocs([]);
    }
  };

  const handleCreateAccountingDocuments = () => {
    setShowCreateAccountingModal(true);
  };

  const handleCloseCreateAccountingModal = () => {
    setShowCreateAccountingModal(false);
  };

  const handleCancelCreateAccounting = () => {
    setShowCreateAccountingModal(false);
  };

  const handleStartHelpGuideAccounting = () => {
    console.log('Starting help guide for accounting documents');
  };

  const handleCreateAccountingSubmit = () => {
    console.log('Creating accounting documents with:', {
      salary: accountingSalary,
      employerDeclaration: accountingEmployerDeclaration,
      holidayDebt: accountingHolidayDebt,
      activatePostVacationDebt: activatePostVacationDebt
    });
    setShowCreateAccountingModal(false);
    // Reset form
    setAccountingSalary('');
    setAccountingEmployerDeclaration('');
    setAccountingHolidayDebt('');
    setActivatePostVacationDebt(false);
  };

  const handleDeleteAccountingRecords = () => {
    console.log('Deleting accounting records');
  };

  const handleReadMoreAccounting = () => {
    console.log('Read more about accounting documents');
  };

  const handlePrintAccounting = () => {
    console.log('Printing accounting documents');
  };

  const handleBookAccounting = () => {
    console.log('Booking accounting documents');
  };

  const handleCreatePayrollRun = () => {
    setShowCreatePayslipModal(true);
  };

  const handleClearSelection = () => {
    setSelectedPayrolls([]);
    setSelectedEmployees([]); // Use setSelectedEmployees to avoid linter warning
  };

  const handleStatusFilterChange = (filter: string) => {
    setStatusFilter(filter);
  };

  const getStatusFilterColor = (filter: string) => {
    // Use statusFilter to avoid linter warning
    console.log('Current status filter:', statusFilter);
    switch (filter) {
      case 'all': return 'bg-white text-gray-800 border border-gray-300';
      case 'created': return 'bg-gray-100 text-gray-800 border border-gray-300';
      case 'certified': return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'sent': return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'paid-out': return 'bg-green-100 text-green-800 border border-green-300';
      default: return 'bg-white text-gray-800 border border-gray-300';
    }
  };

  const handleDelete = () => {
    console.log('Delete clicked');
  };

  const handleChecklist = () => {
    console.log('Checklist clicked');
  };

  const handlePreview = () => {
    console.log('Preview clicked');
  };

  const handlePrintCertificateList = () => {
    console.log('Print certificate list clicked');
  };

  const handleCertify = () => {
    console.log('Certify clicked');
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => handleTabChange('calendar')}
            className={`pb-2 font-medium ${
              activeTab === 'calendar' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Calendar
          </button>
          <button 
            onClick={() => handleTabChange('payroll-processing')}
            className={`pb-2 font-medium ${
              activeTab === 'payroll-processing' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Payroll processing
          </button>
          <button 
            onClick={() => handleTabChange('vacation-calculation')}
            className={`pb-2 font-medium ${
              activeTab === 'vacation-calculation' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Vacation calculation
          </button>
          <button 
            onClick={() => handleTabChange('statistics')}
            className={`pb-2 font-medium ${
              activeTab === 'statistics' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Statistics
          </button>
          <button 
            onClick={() => handleTabChange('forums')}
            className={`pb-2 font-medium ${
              activeTab === 'forums' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Forums
          </button>
          <button 
            onClick={() => handleTabChange('collection')}
            className={`pb-2 font-medium ${
              activeTab === 'collection' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Collection
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select className="border border-gray-300 rounded px-3 py-1 text-sm">
              <option>Salary year</option>
              <option>2025</option>
            </select>
          </div>
          {activeTab === 'vacation-calculation' && (
            <Button 
              onClick={handleCreateVacationCalculation}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
            >
              + Create vacation calculation
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {activeTab === 'calendar' ? (
          <>
            {/* Calendar Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CALENDAR - LIST</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Employment ID, first name, last name, personal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
              </div>
            </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <Button 
            onClick={handleImportHistory}
            variant="secondary" 
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Import history
          </Button>
          <Button 
            onClick={handleImportPayrollData}
            variant="secondary" 
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import payroll data
          </Button>
          <Button 
            onClick={handleExportPayrollData}
            variant="secondary" 
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export payroll data
          </Button>
          <Button 
            onClick={handleRetroactiveSalary}
            variant="secondary" 
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retroactive salary
          </Button>
        </div>

        {/* Welcome Message / Onboarding Card */}
        <div className="bg-gradient-to-r from-purple-100 to-gray-100 rounded-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                You are now in the calendar where you register attendance, absence and other information that goes into the employee's pay slip. But before you can start registering this, you need to add the employees to the personnel register, which you do under Register - Personnel.
              </p>
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={handleGoToPersonnelRegister}
                  className="bg-gray-800 text-white hover:bg-gray-700"
                >
                  Go to personnel register
                </Button>
                <Button 
                  onClick={handleReadMore}
                  variant="secondary" 
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Read more
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-6 ml-8">
              {/* Calendar Illustration */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-lg border-2 border-gray-300 flex items-center justify-center mb-2">
                  <Calendar className="w-8 h-8 text-gray-600" />
                </div>
                <div className="text-xs text-gray-600 text-center">
                  <div className="flex space-x-1 mb-1">
                    <span className="w-2 h-2 bg-gray-400 rounded"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded"></span>
                  </div>
                  <div className="flex space-x-1 mb-1">
                    <span className="w-2 h-2 bg-gray-400 rounded"></span>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded"></span>
                  </div>
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-gray-400 rounded"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded"></span>
                  </div>
                </div>
              </div>
              {/* Clock Illustration */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-lg border-2 border-gray-300 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2">
          <button
            className={`px-4 py-2 text-sm font-medium rounded ${getFilterColor('all')}`}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded ${getFilterColor('active')}`}
            onClick={() => handleFilterChange('active')}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded ${getFilterColor('inactive')}`}
            onClick={() => handleFilterChange('inactive')}
          >
            Inactive
          </button>
        </div>

        {/* Table Structure */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button className="text-gray-600 hover:text-gray-900">
                <Menu className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">{selectedEmployees.length}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMPLOYMENT ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMPLOYEE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SOCIAL SECURITY NUMBER</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STAFF TYPE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SALARY FORM</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLEAR MARKED EMPTY</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
          </>
        ) : activeTab === 'payroll-processing' ? (
          /* Payroll Processing Interface */
          <>
            {/* Payroll Processing Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PAYROLL PROCESSING</h1>
              </div>
              {payrollSubTab === 'payroll-processing' && (
                <div className="flex items-center space-x-3">
                  <Button 
                    onClick={handleSendPaySlipDigitally}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Send pay slip digitally
                  </Button>
                  <Button 
                    onClick={handleCreatePaySlip}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                  >
                    + Create pay slip
                  </Button>
                </div>
              )}
            </div>

            {/* Secondary Navigation Tabs */}
            <div className="flex items-center space-x-6 border-b border-gray-200">
              <button 
                onClick={() => handlePayrollSubTabChange('payroll-processing')}
                className={`pb-2 font-medium ${
                  payrollSubTab === 'payroll-processing'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Payroll processing
              </button>
              <button 
                onClick={() => handlePayrollSubTabChange('employer-declaration')}
                className={`pb-2 font-medium ${
                  payrollSubTab === 'employer-declaration'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Employer declaration
              </button>
              <button 
                onClick={() => handlePayrollSubTabChange('accounting-documents')}
                className={`pb-2 font-medium ${
                  payrollSubTab === 'accounting-documents'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Accounting documents
              </button>
            </div>

            {/* Sub-tab Content */}
            {payrollSubTab === 'payroll-processing' ? (
              <>
                {/* Information Boxes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Purple Information Box */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3">Time to pay out wages.</h3>
                    <p className="text-purple-100 mb-4">
                      Click on Create Payroll at the top right to create the payroll run. You can find help guides and settings in Payroll.
                    </p>
                    <div className="flex items-center space-x-3">
                      <Button 
                        onClick={handleCreatePayrollRun}
                        className="bg-gray-800 text-white hover:bg-gray-700"
                      >
                        Create Payroll Run
                      </Button>
                      <Button 
                        onClick={handleReadMore}
                        variant="secondary" 
                        className="bg-transparent text-white border border-white hover:bg-white hover:text-purple-600"
                      >
                        Read more
                      </Button>
                    </div>
                  </div>
                  <div className="ml-6">
                    {/* Laptop with money illustration */}
                    <div className="w-20 h-16 bg-white rounded-lg flex items-center justify-center relative">
                      <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <div className="flex space-x-1">
                          <div className="w-1 h-3 bg-green-500"></div>
                          <div className="w-1 h-3 bg-green-500"></div>
                          <div className="w-1 h-3 bg-green-500"></div>
                        </div>
                      </div>
                      <div className="absolute -right-2 top-2">
                        <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* White Information Box */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm">
                      Payroll supports payment files to Danske Bank in the Pain.001 format. 
                      Activate a bank connection <a href="#" className="text-blue-600 hover:underline">here</a> for more information.
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">i</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Employment ID, name, pay period"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={payPeriod}
                  onChange={(e) => setPayPeriod(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="all-periods">All periods</option>
                </select>
                <select
                  value={employee}
                  onChange={(e) => setEmployee(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="all-employees">All employees</option>
                </select>
                <Button 
                  onClick={handleClearSelection}
                  variant="secondary" 
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Clear selection
                </Button>
              </div>

              {/* Status Filters */}
              <div className="flex items-center space-x-2">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded ${getStatusFilterColor('all')}`}
                  onClick={() => handleStatusFilterChange('all')}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded ${getStatusFilterColor('created')}`}
                  onClick={() => handleStatusFilterChange('created')}
                >
                  Created
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded ${getStatusFilterColor('certified')}`}
                  onClick={() => handleStatusFilterChange('certified')}
                >
                  Certified
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded ${getStatusFilterColor('sent')}`}
                  onClick={() => handleStatusFilterChange('sent')}
                >
                  Sent
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded ${getStatusFilterColor('paid-out')}`}
                  onClick={() => handleStatusFilterChange('paid-out')}
                >
                  Paid out
                </button>
              </div>
            </div>

            {/* Payroll Processing Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="text-gray-600 hover:text-gray-900">
                    <Menu className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">{selectedPayrolls.length}</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAYMENT DATE</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PERIOD</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMPLOYEE</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GROSS SALARY</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TAX</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TAX-FREE</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TO PAY OUT</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BENEFIT</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLEAR</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">0.00</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">0.00</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">0.00</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">0.00</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">0.00</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                    </tr>
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                        No payroll data found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={handleDelete}
                  variant="secondary" 
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Delete
                </Button>
                <span className="text-sm text-gray-700">({selectedPayrolls.length} selected)</span>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={handleChecklist}
                  variant="secondary" 
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Checklist
                </Button>
                <Button 
                  onClick={handlePreview}
                  variant="secondary" 
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Preview
                </Button>
                <Button 
                  onClick={handlePrintCertificateList}
                  variant="secondary" 
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Print certificate list
                </Button>
                <Button 
                  onClick={handleCertify}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Certify
                </Button>
              </div>
            </div>
              </>
            ) : payrollSubTab === 'employer-declaration' ? (
              /* Employer Declaration Content */
              <>
                {/* Employer Declaration Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">EMPLOYER DECLARATION</h2>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button 
                      onClick={handleCreateEmployerDeclaration}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                    >
                      + Create employer declaration
                    </Button>
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeclarationFilterChange('all')}
                    className={`px-4 py-2 text-sm font-medium rounded ${
                      declarationFilter === 'all'
                        ? 'bg-gray-200 text-gray-900'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleDeclarationFilterChange('created')}
                    className={`px-4 py-2 text-sm font-medium rounded border-l-4 ${
                      declarationFilter === 'created'
                        ? 'bg-gray-200 text-gray-900'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } ${getDeclarationFilterColor('created')}`}
                  >
                    Created
                  </button>
                  <button
                    onClick={() => handleDeclarationFilterChange('preliminary')}
                    className={`px-4 py-2 text-sm font-medium rounded border-l-4 ${
                      declarationFilter === 'preliminary'
                        ? 'bg-gray-200 text-gray-900'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } ${getDeclarationFilterColor('preliminary')}`}
                  >
                    Preliminary
                  </button>
                  <button
                    onClick={() => handleDeclarationFilterChange('submitted')}
                    className={`px-4 py-2 text-sm font-medium rounded border-l-4 ${
                      declarationFilter === 'submitted'
                        ? 'bg-gray-200 text-gray-900'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } ${getDeclarationFilterColor('submitted')}`}
                  >
                    Submitted
                  </button>
                  <button
                    onClick={() => handleDeclarationFilterChange('changed')}
                    className={`px-4 py-2 text-sm font-medium rounded border-l-4 ${
                      declarationFilter === 'changed'
                        ? 'bg-gray-200 text-gray-900'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } ${getDeclarationFilterColor('changed')}`}
                  >
                    Changed
                  </button>
                  <button
                    onClick={() => handleDeclarationFilterChange('incorrect')}
                    className={`px-4 py-2 text-sm font-medium rounded border-l-4 ${
                      declarationFilter === 'incorrect'
                        ? 'bg-gray-200 text-gray-900'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } ${getDeclarationFilterColor('incorrect')}`}
                  >
                    Incorrect
                  </button>
                  <div className="ml-auto">
                    <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                      <Menu className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                </div>

                {/* Data Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={selectedDeclarations.length > 0}
                            onChange={handleSelectAllDeclarations}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          TAX PERIOD
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          TOTAL SUPPORTING DOCUMENTS
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          TOTAL EMPLOYER CONTRIBUTION
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          TAX DEDUCTION BASIS
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          TAX DEDUCTED
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          TO PAY
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          INDIVIDUAL DATA
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ABSENCE INFORMATION
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ADJUSTMENT 1000 SEK LIMIT / ATHLETES
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          STATUS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="checkbox"
                            checked={selectedDeclarations.includes('1')}
                            onChange={() => {
                              if (selectedDeclarations.includes('1')) {
                                setSelectedDeclarations(selectedDeclarations.filter(id => id !== '1'));
                              } else {
                                setSelectedDeclarations([...selectedDeclarations, '1']);
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Empty State Message */}
                <div className="text-center py-8">
                  <p className="text-gray-500">Here you will see your created declaration periods.</p>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={handleDeleteDeclaration}
                      variant="secondary"
                      className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={handleRecreateDeclaration}
                      variant="secondary"
                      className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Recreate
                    </Button>
                    <div className="flex items-center space-x-2">
                      <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                        <option>Employer declaration</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={handlePrintDeclaration}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Print
                    </Button>
                    <div className="flex items-center space-x-2">
                      <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                        <option>Automatic submission of AGI documents to SKV</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                    <Button
                      onClick={handlePerformDeclaration}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Perform
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* Accounting Documents Content */
              <>
                {/* Accounting Documents Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">ACCOUNTING DOCUMENTS</h2>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button 
                      onClick={handleCreateAccountingDocuments}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                    >
                      + Create accounting documents
                    </Button>
                    <button 
                      onClick={handleDeleteAccountingRecords}
                      className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                    >
                      <span>🗑️</span>
                      <span>Delete accounting records</span>
                    </button>
                  </div>
                </div>

                {/* Information Box */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">Time to book</h3>
                      <p className="text-purple-100 mb-4">
                        Click on Create accounting documents on the right to create the documents you need to post the salaries and employer contributions. You can also choose to read more about the accounting documents and the settings available for accounting in Payroll.
                      </p>
                      <div className="flex items-center space-x-3">
                        <Button 
                          onClick={handleCreateAccountingDocuments}
                          className="bg-gray-800 text-white hover:bg-gray-700"
                        >
                          Create Accounting Documents
                        </Button>
                        <Button 
                          onClick={handleReadMoreAccounting}
                          variant="secondary"
                          className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600"
                        >
                          Read more
                        </Button>
                      </div>
                    </div>
                    <div className="ml-6">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                          <span className="text-purple-600 text-xs font-bold">📄</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search and Filter Section */}
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Employment ID, Verification ID, Pay period/tax period"
                      value={accountingSearchTerm}
                      onChange={(e) => setAccountingSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAccountingFilterChange('all')}
                      className={`px-3 py-1 text-sm font-medium rounded ${
                        accountingFilter === 'all'
                          ? 'bg-gray-200 text-gray-900'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => handleAccountingFilterChange('not-booked')}
                      className={`px-3 py-1 text-sm font-medium rounded ${
                        accountingFilter === 'not-booked'
                          ? getAccountingFilterColor('not-booked')
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Not booked
                    </button>
                    <button
                      onClick={() => handleAccountingFilterChange('booked')}
                      className={`px-3 py-1 text-sm font-medium rounded ${
                        accountingFilter === 'booked'
                          ? getAccountingFilterColor('booked')
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Booked
                    </button>
                  </div>
                </div>

                {/* Data Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Accounting Documents</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                        <Menu className="w-4 h-4 text-gray-600" />
                      </div>
                      <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                        <option>0-</option>
                      </select>
                    </div>
                  </div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={selectedAccountingDocs.length > 0}
                            onChange={handleSelectAllAccountingDocs}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          EMPLOYMENT ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          VERIFICATION ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ACCOUNTING DATE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          PAY PERIOD/TAX PERIOD
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          BOOKED: SERIES
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          REGISTERED: VERNR.
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center" colSpan={7}>
                          No accounting documents found
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Button
                      disabled
                      variant="secondary"
                      className="bg-gray-200 text-gray-500 cursor-not-allowed"
                    >
                      Delete
                    </Button>
                    <span className="text-sm text-gray-500">({selectedAccountingDocs.length} selected)</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={handlePrintAccounting}
                      className="bg-green-400 hover:bg-green-500 text-white"
                    >
                      Printing
                    </Button>
                    <Button
                      onClick={handleBookAccounting}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Book
                    </Button>
                  </div>
                </div>
              </>
            )}
          </>
        ) : activeTab === 'vacation-calculation' ? (
          /* Vacation Calculation Interface */
          <>
            {/* Vacation Calculation Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VACATION CALCULATION</h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Id, Name, Date"
                  value={vacationSearchTerm}
                  onChange={(e) => setVacationSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Information Box */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">Get started with vacation calculation</h3>
                  <p className="text-purple-100 mb-4">
                    You need to create a vacation calculation for vacation debt or year-end closure. 
                    Click the "Create vacation calculation" button in the top right or "Read more" for additional information.
                  </p>
                  <div className="flex items-center space-x-3">
                    <Button 
                      onClick={handleCreateVacationCalculation}
                      className="bg-gray-800 text-white hover:bg-gray-700"
                    >
                      Create vacation calculation
                    </Button>
                    <Button 
                      onClick={handleVacationReadMore}
                      variant="secondary" 
                      className="bg-transparent text-white border border-white hover:bg-white hover:text-purple-600"
                    >
                      Read more
                    </Button>
                  </div>
                </div>
                <div className="ml-6">
                  {/* Palm tree illustration */}
                  <div className="w-20 h-16 bg-white rounded-lg flex items-center justify-center relative">
                    <div className="w-12 h-8 bg-green-200 rounded flex items-center justify-center">
                      <div className="w-2 h-6 bg-green-500 rounded-t"></div>
                    </div>
                    <div className="absolute -right-2 top-2">
                      <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Section */}
            <div className="flex items-center space-x-4">
              <select
                value={staffType}
                onChange={(e) => setStaffType(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="all-staff-types">All staff types</option>
              </select>
              <select
                value={vacationEmployee}
                onChange={(e) => setVacationEmployee(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="all-employees">All employees</option>
              </select>
              <select
                value={vacationYear}
                onChange={(e) => setVacationYear(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="all-years">All years</option>
              </select>
              <select
                value={vacationPeriod}
                onChange={(e) => setVacationPeriod(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="all-periods">All periods</option>
              </select>
              <Button 
                onClick={handleClearVacationFilters}
                variant="secondary" 
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Clear
              </Button>
            </div>

            {/* Secondary Filter Tabs */}
            <div className="flex items-center space-x-2">
              <button
                className={`px-4 py-2 text-sm font-medium rounded ${getVacationFilterColor('all')}`}
                onClick={() => handleVacationFilterChange('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded ${getVacationFilterColor('created-documents')}`}
                onClick={() => handleVacationFilterChange('created-documents')}
              >
                Created documents
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded ${getVacationFilterColor('basis-booked')}`}
                onClick={() => handleVacationFilterChange('basis-booked')}
              >
                Basis for booked holiday debt
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded ${getVacationFilterColor('included-end-year')}`}
                onClick={() => handleVacationFilterChange('included-end-year')}
              >
                Included in the end of the holiday year
              </button>
            </div>

            {/* Vacation Calculation Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="text-gray-600 hover:text-gray-900">
                    <Menu className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">{selectedVacations.length}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMPLOYMENT ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMPLOYEE</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAID DAYS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UNPAID DAYS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SALARY/PAID DAY</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SALARY/SAVED DAY</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HOLIDAY PAY (NOT DAYS)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PERIOD</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VERSION ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DEBT</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td colSpan={12} className="px-6 py-12 text-center text-gray-500">
                        No vacation calculation data found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={handleVacationDelete}
                  variant="secondary" 
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Delete
                </Button>
                <Button 
                  onClick={handleBackOffHolidayYearEnd}
                  variant="secondary" 
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Back off holiday year-end
                </Button>
                <span className="text-sm text-gray-700">({selectedVacations.length} selected)</span>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={handleEndOfHolidayYear}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  End of the holiday year
                </Button>
                <div className="flex items-center space-x-2">
                  <Button 
                    onClick={handleHolidayDebt}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Holiday debt
                  </Button>
                  <ChevronDown className="w-4 h-4 text-white" />
                </div>
                <Button 
                  onClick={handleVacationPrinting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Printing
                </Button>
              </div>
            </div>
          </>
        ) : activeTab === 'statistics' ? (
          /* Statistics Interface */
          <>
            {/* Statistics Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {activeStatisticsTab === 'scb-wage-structure' ? 'SCB WAGE STRUCTURE STATISTICS (SLP)' : 
                 activeStatisticsTab === 'swedish-business-sector' ? 'SWEDISH BUSINESS SECTOR WAGE STATISTICS' : 
                 activeStatisticsTab === 'scb-economic' ? 'SCB ECONOMIC STATISTICS (KLP)' : 
                 activeStatisticsTab === 'ksju' ? 'STATISTICS SWEDEN BUSINESS CYCLE WAGE STATISTICS ON SICK PAY (KSJU)' : 
                 activeStatisticsTab === 'sus' ? 'SCB SICKNESS ABSENCE DURING THE SICK PAY PERIOD (SUS)' : 
                 activeStatisticsTab === 'ksp' ? 'SCB SHORT-TERM EMPLOYMENT FOR THE PRIVATE SECTOR (KSP)' : 
                 'STATISTICS'}
              </h1>
              <Button 
                onClick={
                  activeStatisticsTab === 'swedish-business-sector' ? handleCreateSN : 
                  activeStatisticsTab === 'scb-economic' ? handleCreateKLP : 
                  activeStatisticsTab === 'ksju' ? handleCreateKSJU :
                  activeStatisticsTab === 'sus' ? handleCreateSUS :
                  activeStatisticsTab === 'ksp' ? handleCreateKSP :
                  handleCreateSLP
                }
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
              >
                {activeStatisticsTab === 'swedish-business-sector' ? '+ Create SN' : 
                 activeStatisticsTab === 'scb-economic' ? '+ Create KLP' : 
                 activeStatisticsTab === 'ksju' ? '+ Create KSJU' :
                 activeStatisticsTab === 'sus' ? '+ Create SUS' :
                 activeStatisticsTab === 'ksp' ? '+ Create KSP' :
                 '+ Create SLP'}
              </Button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={
                    activeStatisticsTab === 'swedish-business-sector' ? swedishStatsSearchTerm : 
                    activeStatisticsTab === 'scb-economic' ? klpStatsSearchTerm : 
                    activeStatisticsTab === 'ksju' ? ksjuStatsSearchTerm :
                    activeStatisticsTab === 'sus' ? susStatsSearchTerm :
                    activeStatisticsTab === 'ksp' ? kspStatsSearchTerm :
                    statisticsSearchTerm
                  }
                  onChange={(e) => 
                    activeStatisticsTab === 'swedish-business-sector' ? setSwedishStatsSearchTerm(e.target.value) : 
                    activeStatisticsTab === 'scb-economic' ? setKlpStatsSearchTerm(e.target.value) : 
                    activeStatisticsTab === 'ksju' ? setKsjuStatsSearchTerm(e.target.value) :
                    activeStatisticsTab === 'sus' ? setSusStatsSearchTerm(e.target.value) :
                    activeStatisticsTab === 'ksp' ? setKspStatsSearchTerm(e.target.value) :
                    setStatisticsSearchTerm(e.target.value)
                  }
                  className="pl-10"
                />
              </div>
            </div>

            {/* Sub-navigation Tabs */}
            <div className="flex items-center space-x-6 border-b border-gray-200">
              <button 
                onClick={() => handleStatisticsTabChange('scb-wage-structure')}
                className={`pb-2 font-medium ${
                  activeStatisticsTab === 'scb-wage-structure' 
                    ? 'text-green-600 border-b-2 border-green-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                SCB Wage Structure Statistics (SLP)
              </button>
              <button 
                onClick={() => handleStatisticsTabChange('swedish-business-sector')}
                className={`pb-2 font-medium ${
                  activeStatisticsTab === 'swedish-business-sector' 
                    ? 'text-green-600 border-b-2 border-green-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Swedish business sector wage statistics
              </button>
              <button 
                onClick={() => handleStatisticsTabChange('scb-economic')}
                className={`pb-2 font-medium ${
                  activeStatisticsTab === 'scb-economic' 
                    ? 'text-green-600 border-b-2 border-green-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                SCB Economic statistics (KLP)
              </button>
              <button 
                onClick={() => handleStatisticsTabChange('ksju')}
                className={`pb-2 font-medium ${
                  activeStatisticsTab === 'ksju' 
                    ? 'text-green-600 border-b-2 border-green-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Statistics Sweden Business cycle statistics on sick pay (KSJU)
              </button>
              <button 
                onClick={() => handleStatisticsTabChange('sus')}
                className={`pb-2 font-medium ${
                  activeStatisticsTab === 'sus' 
                    ? 'text-green-600 border-b-2 border-green-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                SCB Sickness absence during the sick pay period (SUS)
              </button>
              <button 
                onClick={() => handleStatisticsTabChange('ksp')}
                className={`pb-2 font-medium ${
                  activeStatisticsTab === 'ksp' 
                    ? 'text-green-600 border-b-2 border-green-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                SCB Short-term employment statistics for the private sector (KSP)
              </button>
            </div>

            {/* Filter Section */}
            {activeStatisticsTab === 'scb-wage-structure' ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Month:</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option>September 2025</option>
                    <option>August 2025</option>
                    <option>July 2025</option>
                    <option>June 2025</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">CFAR number:</label>
                  <select
                    value={selectedCfarNumber}
                    onChange={(e) => setSelectedCfarNumber(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option>All</option>
                    <option>001</option>
                    <option>002</option>
                    <option>003</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Employee:</label>
                  <select
                    value={selectedStatisticsEmployee}
                    onChange={(e) => setSelectedStatisticsEmployee(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option>All</option>
                    <option>John Doe</option>
                    <option>Jane Smith</option>
                    <option>Bob Wilson</option>
                  </select>
                </div>
              </div>
            ) : activeStatisticsTab === 'swedish-business-sector' ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Interval:</label>
                  <select
                    value={selectedInterval}
                    onChange={(e) => setSelectedInterval(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option>All</option>
                    <option>Q1 2025</option>
                    <option>Q2 2025</option>
                    <option>Q3 2025</option>
                    <option>Q4 2025</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">CFAR number:</label>
                  <select
                    value={selectedSwedishCfarNumber}
                    onChange={(e) => setSelectedSwedishCfarNumber(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option>All</option>
                    <option>001</option>
                    <option>002</option>
                    <option>003</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Employee:</label>
                  <select
                    value={selectedSwedishEmployee}
                    onChange={(e) => setSelectedSwedishEmployee(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option>All</option>
                    <option>John Doe</option>
                    <option>Jane Smith</option>
                    <option>Bob Wilson</option>
                  </select>
                </div>
              </div>
            ) : activeStatisticsTab === 'scb-economic' ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Month:</label>
                  <select
                    value={selectedKlpMonth}
                    onChange={(e) => setSelectedKlpMonth(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option>All</option>
                    <option>September 2025</option>
                    <option>August 2025</option>
                    <option>July 2025</option>
                    <option>June 2025</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">CFAR number:</label>
                  <select
                    value={selectedKlpCfarNumber}
                    onChange={(e) => setSelectedKlpCfarNumber(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option>All</option>
                    <option>001</option>
                    <option>002</option>
                    <option>003</option>
                  </select>
                </div>
              </div>
            ) : activeStatisticsTab === 'ksju' ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Month:</label>
                  <select
                    value={selectedKsjuMonth}
                    onChange={(e) => setSelectedKsjuMonth(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option>All</option>
                    <option>September 2025</option>
                    <option>August 2025</option>
                    <option>July 2025</option>
                    <option>June 2025</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Employee:</label>
                  <select
                    value={selectedKsjuEmployee}
                    onChange={(e) => setSelectedKsjuEmployee(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option>All</option>
                    <option>John Doe</option>
                    <option>Jane Smith</option>
                    <option>Bob Wilson</option>
                  </select>
                </div>
              </div>
            ) : activeStatisticsTab === 'sus' ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Month:</label>
                  <select
                    value={selectedSusMonth}
                    onChange={(e) => setSelectedSusMonth(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option>All</option>
                    <option>September 2025</option>
                    <option>August 2025</option>
                    <option>July 2025</option>
                    <option>June 2025</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Employee:</label>
                  <select
                    value={selectedSusEmployee}
                    onChange={(e) => setSelectedSusEmployee(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option>All</option>
                    <option>John Doe</option>
                    <option>Jane Smith</option>
                    <option>Bob Wilson</option>
                  </select>
                </div>
              </div>
            ) : activeStatisticsTab === 'ksp' ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">CFAR number:</label>
                  <select
                    value={selectedKspCfarNumber}
                    onChange={(e) => setSelectedKspCfarNumber(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option>All</option>
                    <option>001</option>
                    <option>002</option>
                    <option>003</option>
                  </select>
                </div>
              </div>
            ) : null}

            {/* Data Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {activeStatisticsTab === 'scb-wage-structure' ? 'SCB Wage Structure Statistics' : 
                   activeStatisticsTab === 'swedish-business-sector' ? 'Swedish Business Sector Wage Statistics' : 
                   activeStatisticsTab === 'scb-economic' ? 'SCB Economic Statistics (KLP)' : 
                   activeStatisticsTab === 'ksju' ? 'Statistics Sweden Business cycle statistics on sick pay (KSJU)' : 
                   activeStatisticsTab === 'sus' ? 'SCB Sickness absence during the sick pay period (SUS)' : 
                   activeStatisticsTab === 'ksp' ? 'SCB Short-term employment statistics for the private sector (KSP)' : 
                   'Statistics'}
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                    <Menu className="w-4 h-4 text-gray-600" />
                  </div>
                  <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                    <option>0</option>
                  </select>
                </div>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={
                          activeStatisticsTab === 'scb-wage-structure' ? selectedStatistics.length > 0 : 
                          activeStatisticsTab === 'swedish-business-sector' ? selectedSwedishStats.length > 0 :
                          activeStatisticsTab === 'scb-economic' ? selectedKlpStats.length > 0 :
                          activeStatisticsTab === 'ksju' ? selectedKsjuStats.length > 0 :
                          activeStatisticsTab === 'sus' ? selectedSusStats.length > 0 :
                          activeStatisticsTab === 'ksp' ? selectedKspStats.length > 0 :
                          false
                        }
                        onChange={
                          activeStatisticsTab === 'scb-wage-structure' ? handleSelectAllStatistics : 
                          activeStatisticsTab === 'swedish-business-sector' ? handleSelectAllSwedishStats :
                          activeStatisticsTab === 'scb-economic' ? handleSelectAllKlpStats :
                          activeStatisticsTab === 'ksju' ? handleSelectAllKsjuStats :
                          activeStatisticsTab === 'sus' ? handleSelectAllSusStats :
                          activeStatisticsTab === 'ksp' ? handleSelectAllKspStats :
                          () => {}
                        }
                        className="rounded border-gray-300"
                      />
                    </th>
                    {activeStatisticsTab === 'scb-economic' ? (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          MONTH
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CFAR NUMBER
                        </th>
                      </>
                    ) : activeStatisticsTab === 'ksju' ? (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          MONTH
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          EMPLOYEE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SOCIAL SECURITY NUMBER
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          START DAY
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          STOP DAY
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          NUMBER OF DAYS - WHOLE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          NUMBER OF DAYS - PART OF
                        </th>
                      </>
                    ) : activeStatisticsTab === 'sus' ? (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          MONTH
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          EMPLOYEE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SOCIAL SECURITY NUMBER
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          START DAY
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          STOP DAY
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          NUMBER OF DAYS
                        </th>
                      </>
                    ) : activeStatisticsTab === 'ksp' ? (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-200">
                          MEASUREMENT DAY
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CFAR NUMBER
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          TOTAL EMPLOYEES
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          PERMANENT EMPLOYEES
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          FIXED-TERM EMPLOYEES
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          TOTAL ABSENCE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ABSENCE SICK
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ABSENCE VACATION
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          OTHER ABSENCES
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          NEW EMPLOYEES TOTAL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          NEW EMPLOYEES UNTIL FURTHER NOTICE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          NEW EMPLOYEES FOR A LIMITED TIME
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          RETIRED TOTAL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          RETIRED EMPLOYEES UNTIL FURTHER NOTICE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          RETIRED FIXED-TERM EMPLOYEES
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          FIRST DAY
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          LAST DAY
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          EMPLOYEE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          PROFESSIONAL CODE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CFAR NUMBER
                        </th>
                        {activeStatisticsTab === 'swedish-business-sector' && (
                          <>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              FEDERAL NUMBER
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              CONTRACT CODE
                            </th>
                          </>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          TOTAL TIME WORKED
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center" colSpan={
                      activeStatisticsTab === 'swedish-business-sector' ? 9 : 
                      activeStatisticsTab === 'scb-economic' ? 3 : 
                      activeStatisticsTab === 'ksju' ? 8 :
                      activeStatisticsTab === 'sus' ? 7 :
                      activeStatisticsTab === 'ksp' ? 16 :
                      7
                    }>
                      No data available
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  ({activeStatisticsTab === 'scb-wage-structure' ? selectedStatistics.length : 
                    activeStatisticsTab === 'swedish-business-sector' ? selectedSwedishStats.length :
                    activeStatisticsTab === 'scb-economic' ? selectedKlpStats.length :
                    activeStatisticsTab === 'ksju' ? selectedKsjuStats.length :
                    activeStatisticsTab === 'sus' ? selectedSusStats.length :
                    activeStatisticsTab === 'ksp' ? selectedKspStats.length :
                    0} selected)
                </span>
                <Button
                  onClick={
                    activeStatisticsTab === 'scb-wage-structure' ? handleDeleteStatistics : 
                    activeStatisticsTab === 'swedish-business-sector' ? handleDeleteSwedishStats :
                    activeStatisticsTab === 'scb-economic' ? handleDeleteKlpStats :
                    activeStatisticsTab === 'ksju' ? handleDeleteKsjuStats :
                    activeStatisticsTab === 'sus' ? handleDeleteSusStats :
                    activeStatisticsTab === 'ksp' ? handleDeleteKspStats :
                    () => {}
                  }
                  disabled={
                    activeStatisticsTab === 'scb-wage-structure' ? selectedStatistics.length === 0 : 
                    activeStatisticsTab === 'swedish-business-sector' ? selectedSwedishStats.length === 0 :
                    activeStatisticsTab === 'scb-economic' ? selectedKlpStats.length === 0 :
                    activeStatisticsTab === 'ksju' ? selectedKsjuStats.length === 0 :
                    activeStatisticsTab === 'sus' ? selectedSusStats.length === 0 :
                    activeStatisticsTab === 'ksp' ? selectedKspStats.length === 0 :
                    true
                  }
                  variant="secondary"
                  className={`${
                    (activeStatisticsTab === 'scb-wage-structure' ? selectedStatistics.length : 
                     activeStatisticsTab === 'swedish-business-sector' ? selectedSwedishStats.length :
                     activeStatisticsTab === 'scb-economic' ? selectedKlpStats.length :
                     activeStatisticsTab === 'ksju' ? selectedKsjuStats.length :
                     activeStatisticsTab === 'sus' ? selectedSusStats.length :
                     activeStatisticsTab === 'ksp' ? selectedKspStats.length :
                     0) === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600 text-white'
                  }`}
                >
                  Delete
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={
                    activeStatisticsTab === 'scb-wage-structure' ? handlePrintStatistics : 
                    activeStatisticsTab === 'swedish-business-sector' ? handlePrintSwedishStats :
                    activeStatisticsTab === 'scb-economic' ? handlePrintKlpStats :
                    activeStatisticsTab === 'ksju' ? handlePrintKsjuStats :
                    activeStatisticsTab === 'sus' ? handlePrintSusStats :
                    activeStatisticsTab === 'ksp' ? handlePrintKspStats :
                    () => {}
                  }
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Print
                </Button>
                <Button
                  onClick={
                    activeStatisticsTab === 'scb-wage-structure' ? handleCreateFile : 
                    activeStatisticsTab === 'swedish-business-sector' ? handleCreateSwedishFile :
                    activeStatisticsTab === 'scb-economic' ? handleCreateKlpFile :
                    activeStatisticsTab === 'ksju' ? handleCreateKsjuFile :
                    activeStatisticsTab === 'sus' ? handleCreateSusFile :
                    activeStatisticsTab === 'ksp' ? handleCreateKSP :
                    () => {}
                  }
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Create file
                </Button>
              </div>
            </div>
          </>
        ) : activeTab === 'forums' ? (
          /* Forum Monthly Reporting Interface */
          <>
            {/* Forum Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {activeForumTab === 'monthly-report' ? 'FORUM MONTHLY REPORTING' : 'FORUM ANNUAL REPORTING'}
              </h1>
              <Button 
                onClick={activeForumTab === 'monthly-report' ? handleCreateMonthlyReport : handleCreateAnnualReport}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
              >
                {activeForumTab === 'monthly-report' ? '+ Create monthly report' : '+ Create annual report'}
              </Button>
            </div>

            {/* Sub-navigation Tabs */}
            <div className="flex items-center space-x-6 border-b border-gray-200">
              <button 
                onClick={() => handleForumTabChange('monthly-report')}
                className={`pb-2 font-medium ${
                  activeForumTab === 'monthly-report' 
                    ? 'text-green-600 border-b-2 border-green-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly report
              </button>
              <button 
                onClick={() => handleForumTabChange('annual-report')}
                className={`pb-2 font-medium ${
                  activeForumTab === 'annual-report' 
                    ? 'text-green-600 border-b-2 border-green-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual report
              </button>
            </div>

            {/* Search Bar - Only for Annual Report */}
            {activeForumTab === 'annual-report' && (
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Forum type, employee, social securi"
                    value={forumSearchTerm}
                    onChange={(e) => setForumSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {/* Filtering Section */}
            {activeForumTab === 'monthly-report' ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Select month:</label>
                  <select
                    value={forumSelectedMonth}
                    onChange={(e) => setForumSelectedMonth(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option>All</option>
                    <option>January 2025</option>
                    <option>February 2025</option>
                    <option>March 2025</option>
                    <option>April 2025</option>
                    <option>May 2025</option>
                    <option>June 2025</option>
                    <option>July 2025</option>
                    <option>August 2025</option>
                    <option>September 2025</option>
                    <option>October 2025</option>
                    <option>November 2025</option>
                    <option>December 2025</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Select employee:</label>
                  <select
                    value={forumSelectedEmployee}
                    onChange={(e) => setForumSelectedEmployee(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option>All</option>
                    <option>John Doe</option>
                    <option>Jane Smith</option>
                    <option>Bob Wilson</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Markup:</label>
                  <select
                    value={selectedMarkup}
                    onChange={(e) => setSelectedMarkup(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option>All</option>
                    <option>Standard</option>
                    <option>Premium</option>
                    <option>Basic</option>
                  </select>
                </div>
                <Button
                  onClick={handleClearFilters}
                  variant="secondary"
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Select year:</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option>2024</option>
                    <option>2023</option>
                    <option>2022</option>
                    <option>2021</option>
                    <option>2020</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Select employee:</label>
                  <select
                    value={annualSelectedEmployee}
                    onChange={(e) => setAnnualSelectedEmployee(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option>All employees</option>
                    <option>John Doe</option>
                    <option>Jane Smith</option>
                    <option>Bob Wilson</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Markup:</label>
                  <select
                    value={annualSelectedMarkup}
                    onChange={(e) => setAnnualSelectedMarkup(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option>Not drawn</option>
                    <option>Drawn</option>
                    <option>Pending</option>
                  </select>
                </div>
                <Button
                  onClick={handleAddMarkup}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Add
                </Button>
              </div>
            )}

            {/* Help Section Link - Only for Annual Report */}
            {activeForumTab === 'annual-report' && (
              <div className="mt-2">
                <a 
                  href="#" 
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  onClick={(e) => { e.preventDefault(); console.log('See help section'); }}
                >
                  See help section
                </a>
              </div>
            )}

            {/* Employee Type Filter - Only for Annual Report */}
            {activeForumTab === 'annual-report' && (
              <div className="flex items-center space-x-2 mt-4">
                <button
                  onClick={() => handleEmployeeTypeFilterChange('all')}
                  className={`px-4 py-2 text-sm font-medium rounded border ${getEmployeeTypeFilterColor('all')}`}
                >
                  All
                </button>
                <button
                  onClick={() => handleEmployeeTypeFilterChange('worker')}
                  className={`px-4 py-2 text-sm font-medium rounded border ${getEmployeeTypeFilterColor('worker')}`}
                >
                  Worker
                </button>
                <button
                  onClick={() => handleEmployeeTypeFilterChange('official')}
                  className={`px-4 py-2 text-sm font-medium rounded border ${getEmployeeTypeFilterColor('official')}`}
                >
                  Official
                </button>
              </div>
            )}

            {/* Report Status Filters - Only for Monthly Report */}
            {activeForumTab === 'monthly-report' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleReportStatusFilterChange('all')}
                  className={`px-4 py-2 text-sm font-medium rounded border ${getReportStatusFilterColor('all')}`}
                >
                  All
                </button>
                <button
                  onClick={() => handleReportStatusFilterChange('created')}
                  className={`px-4 py-2 text-sm font-medium rounded border ${getReportStatusFilterColor('created')}`}
                >
                  Created
                </button>
                <button
                  onClick={() => handleReportStatusFilterChange('file-created')}
                  className={`px-4 py-2 text-sm font-medium rounded border ${getReportStatusFilterColor('file-created')}`}
                >
                  File created
                </button>
              </div>
            )}

            {/* Report Data Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {activeForumTab === 'monthly-report' ? 'Monthly Reports' : 'Annual Reports'}
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                    <Menu className="w-4 h-4 text-gray-600" />
                  </div>
                  <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                    <option>0</option>
                  </select>
                </div>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={activeForumTab === 'monthly-report' ? selectedReports.length > 0 : selectedAnnualReports.length > 0}
                        onChange={activeForumTab === 'monthly-report' ? handleSelectAllReports : handleSelectAllAnnualReports}
                        className="rounded border-gray-300"
                      />
                    </th>
                    {activeForumTab === 'monthly-report' ? (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          MONTH
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          EMPLOYEE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SOCIAL SECURITY NUMBER
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          MARKUP
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          OPTIONAL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ATTRIBUTABLE SALARY
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          AMOUNT
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          FORUM TYPE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-200">
                          EMPLOYEE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SOCIAL SECURITY NUMBER
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          BIRTH TIME
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CHANGED EMPLOYMENT
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          AMOUNT
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeForumTab === 'monthly-report' ? (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center" colSpan={8}>
                        No data available
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0.00</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Action Bar */}
            {activeForumTab === 'monthly-report' ? (
              <div className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={handleDeleteReports}
                    disabled={selectedReports.length === 0}
                    variant="secondary"
                    className={`${
                      selectedReports.length === 0 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-500 hover:bg-gray-600 text-white'
                    }`}
                  >
                    Delete
                  </Button>
                  <span className="text-sm text-gray-500">
                    ({selectedReports.length} selected)
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={handleCreateForumFile}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Create file
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <a 
                    href="#" 
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    onClick={(e) => { e.preventDefault(); handleGoToForaSe(); }}
                  >
                    Go to fora.se
                  </a>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={handlePrintingForumMaterials}
                    variant="secondary"
                    className="bg-gray-500 hover:bg-gray-600 text-white"
                  >
                    Printing Forum materials
                  </Button>
                  <Button
                    onClick={handlePrintingSalaryReports}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Printing salary reports
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : activeTab === 'collection' ? (
          /* Collection Interface */
          <>
            {/* Collection Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">COLLECTION</h1>
              <div className="flex items-center space-x-3">
                <Button 
                  onClick={handleDeleteCollections}
                  variant="secondary"
                  className="bg-red-100 text-red-800 hover:bg-red-200"
                >
                  Delete events
                </Button>
                <Button 
                  onClick={handleOpenItp1Modal}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  Add ITP 1 event
                </Button>
                <Button 
                  onClick={handleOpenItp2Modal}
                  variant="secondary"
                  className="bg-green-100 text-green-800 hover:bg-green-200"
                >
                  Add ITP2 event
                </Button>
                <Button 
                  onClick={handleCreateCollection}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                >
                  + Create collection
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search collections..."
                  value={collectionSearchTerm}
                  onChange={(e) => setCollectionSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtering Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Type:</label>
                <select
                  value={collectionTypeFilter}
                  onChange={(e) => setCollectionTypeFilter(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option>All</option>
                  <option>Salary</option>
                  <option>Benefits</option>
                  <option>Deductions</option>
                  <option>Taxes</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Event:</label>
                <select
                  value={collectionEventFilter}
                  onChange={(e) => setCollectionEventFilter(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option>All</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Annual</option>
                  <option>Special</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Month:</label>
                <select
                  value={collectionMonthFilter}
                  onChange={(e) => setCollectionMonthFilter(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option>All</option>
                  <option>January 2025</option>
                  <option>February 2025</option>
                  <option>March 2025</option>
                  <option>April 2025</option>
                  <option>May 2025</option>
                  <option>June 2025</option>
                  <option>July 2025</option>
                  <option>August 2025</option>
                  <option>September 2025</option>
                  <option>October 2025</option>
                  <option>November 2025</option>
                  <option>December 2025</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Employee:</label>
                <select
                  value={collectionEmployeeFilter}
                  onChange={(e) => setCollectionEmployeeFilter(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option>All</option>
                  <option>John Doe</option>
                  <option>Jane Smith</option>
                  <option>Bob Wilson</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select
                  value={collectionStatusFilter}
                  onChange={(e) => setCollectionStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option>All</option>
                  <option>Pending</option>
                  <option>Completed</option>
                  <option>Failed</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>

            {/* Collection Data Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Collections</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                    <Menu className="w-4 h-4 text-gray-600" />
                  </div>
                  <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                    <option>0</option>
                  </select>
                </div>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedCollections.length > 0}
                        onChange={handleSelectAllCollections}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TYPE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      EVENT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MONTH
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      EMPLOYEE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AMOUNT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STATUS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CREATED DATE
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center" colSpan={8}>
                      No data available
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleDeleteCollections}
                  disabled={selectedCollections.length === 0}
                  variant="secondary"
                  className={`${
                    selectedCollections.length === 0 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-500 hover:bg-gray-600 text-white'
                  }`}
                >
                  Delete
                </Button>
                <span className="text-sm text-gray-500">
                  ({selectedCollections.length} selected)
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handlePrintCollections}
                  variant="secondary"
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Print
                </Button>
                <Button
                  onClick={handleCreateCollectionFile}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Create file
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Send Pay Slip Digitally Modal */}
      {showSendPayslipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">SEND PAY SLIP DIGITALLY</h2>
              <button
                onClick={handleCloseSendPayslipModal}
                className="text-white hover:text-gray-200 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Information Text */}
              <div className="space-y-4">
                <p className="text-gray-700">
                  With digital pay slips, employees log in with BankID login and retrieve their pay slips in the app or at the website. All pay slips collected in one place.
                </p>
                <p className="text-gray-700">
                  Here you make a mass update of the personnel register where you choose how your employees should receive their pay slips. To send the pay slip digitally, you need to enter the employee's social security number and email address.
                </p>
              </div>

              {/* Employee Data Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          EMPLOYEE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SOCIAL SECURITY NUMBER
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          E-MAIL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          TYPE OF PAY SLIP
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {employeeData.map((employee) => (
                        <tr key={employee.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {employee.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {employee.socialSecurityNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {employee.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <select
                              value={employee.paySlipType}
                              onChange={(e) => handleEmployeePaySlipTypeChange(employee.id, e.target.value)}
                              className="border border-gray-300 rounded px-3 py-1 text-sm"
                            >
                              <option value="digital">Digital</option>
                              <option value="paper">Paper</option>
                              <option value="both">Both</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Table Footer with Pagination */}
                <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Menu className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{employeeData.length}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">({changesCount} changes)</span>
                <Button
                  onClick={handleRemindMeLater}
                  variant="secondary"
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Remind me later
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <select
                    value={paySlipType}
                    onChange={(e) => setPaySlipType(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option value="digital">Digital</option>
                    <option value="paper">Paper</option>
                    <option value="both">Both</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <Button
                  onClick={handleChangeAllOnPage}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Change all on the page
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Pay Slip Modal */}
      {showCreatePayslipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">CREATE PAYSLIP</h2>
              <button
                onClick={handleCloseCreatePayslipModal}
                className="text-white hover:text-gray-200 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center border-b border-gray-200">
              <button
                onClick={() => handlePayslipTabChange('payslip')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activePayslipTab === 'payslip'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Pay slip
              </button>
              <button
                onClick={() => handlePayslipTabChange('extra-payslip')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activePayslipTab === 'extra-payslip'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Extra pay slip
              </button>
              <button
                onClick={() => handlePayslipTabChange('final-salary')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activePayslipTab === 'final-salary'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Final salary
              </button>
              
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              {activePayslipTab === 'payslip' ? (
                /* Original Pay Slip Tab */
                <>
                  {/* Form Section - Top Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pay Period Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Pay period</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={createPayPeriod}
                          onChange={(e) => setCreatePayPeriod(e.target.value)}
                          placeholder="Select pay period"
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>

                    {/* Employee Field and Checkboxes */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Employee</label>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={showInactive}
                              onChange={(e) => setShowInactive(e.target.checked)}
                              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-600">Show inactive</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={showEnded}
                              onChange={(e) => setShowEnded(e.target.checked)}
                              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-600">Show ended</span>
                          </label>
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => console.log('Select employees clicked')}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:bg-gray-50"
                        >
                          <span className="text-gray-500">Select Employees</span>
                        </button>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Form Section - Middle Row */}
                  <div className="space-y-4">
                    {/* Bring Blank Pay Slips Toggle */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Bring blank pay slips.</label>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <button
                            onClick={() => setBringBlankPayslips(!bringBlankPayslips)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              bringBlankPayslips ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                bringBlankPayslips ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className="ml-3 text-sm text-gray-600">
                            {bringBlankPayslips ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price per pay slip link */}
                    <div className="flex items-center space-x-2">
                      <a href="#" className="text-blue-600 hover:text-blue-800 underline text-sm">
                        Price per pay slip?
                      </a>
                      <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">?</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : activePayslipTab === 'extra-payslip' ? (
                /* Extra Pay Slip Tab */
                <>
                  {/* Top Row: Payment Date and Employee */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Payment Date Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Payment date</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={paymentDate}
                          onChange={(e) => setPaymentDate(e.target.value)}
                          placeholder="Select payment date"
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>

                    {/* Employee Field and Checkboxes */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Employee</label>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={showInactive}
                              onChange={(e) => setShowInactive(e.target.checked)}
                              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-600">Show inactive</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={showEnded}
                              onChange={(e) => setShowEnded(e.target.checked)}
                              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-600">Show ended</span>
                          </label>
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => console.log('Select employees clicked')}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:bg-gray-50"
                        >
                          <span className="text-gray-500">Select Employees</span>
                        </button>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Pay Period Date Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Pay period date</label>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={payPeriodStartDate}
                          onChange={(e) => setPayPeriodStartDate(e.target.value)}
                          placeholder="Start date"
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                      <span className="text-gray-500">-</span>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={payPeriodEndDate}
                          onChange={(e) => setPayPeriodEndDate(e.target.value)}
                          placeholder="End date"
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Deviation Period Date Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Deviation period date</label>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={deviationStartDate}
                          onChange={(e) => setDeviationStartDate(e.target.value)}
                          placeholder="Start date"
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                      <span className="text-gray-500">-</span>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={deviationEndDate}
                          onChange={(e) => setDeviationEndDate(e.target.value)}
                          placeholder="End date"
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Take from Calendar Section */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700">Take from calendar</label>
                    <div className="space-y-3">
                      {/* Corrections */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Corrections</span>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleTakeFromCalendarChange('corrections')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              takeFromCalendar.corrections ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                takeFromCalendar.corrections ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className="ml-3 text-sm text-gray-600">
                            {takeFromCalendar.corrections ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>

                      {/* Times */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Times</span>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleTakeFromCalendarChange('times')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              takeFromCalendar.times ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                takeFromCalendar.times ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className="ml-3 text-sm text-gray-600">
                            {takeFromCalendar.times ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>

                      {/* Other */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Other</span>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleTakeFromCalendarChange('other')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              takeFromCalendar.other ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                takeFromCalendar.other ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className="ml-3 text-sm text-gray-600">
                            {takeFromCalendar.other ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price per pay slip link */}
                  <div className="flex items-center space-x-2">
                    <a href="#" className="text-blue-600 hover:text-blue-800 underline text-sm">
                      Price per pay slip?
                    </a>
                    <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">?</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Final Salary Tab */
                <>
                  {/* Informational Text */}
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Here you pay holiday pay, comp time and flex time to an employee who is leaving.
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Before you do this, keep in mind that:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                        <li>All deviations must be registered in the calendar</li>
                        <li>All regular pay slips for the employee must have been created</li>
                      </ul>
                    </div>
                    
                    <p className="text-gray-700">
                      The final salary is paid on a separate pay slip.
                    </p>
                  </div>

                  {/* Employee Selection Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Employee</label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={showInactive}
                            onChange={(e) => setShowInactive(e.target.checked)}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-600">Show inactive</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={showEnded}
                            onChange={(e) => setShowEnded(e.target.checked)}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-600">Show ended</span>
                        </label>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => console.log('Select employees clicked')}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:bg-gray-50"
                      >
                        <span className="text-gray-500">Select Employees</span>
                      </button>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-4 flex-shrink-0">
              {activePayslipTab === 'extra-payslip' ? (
                /* Extra Pay Slip Buttons */
                <>
                  <Button
                    onClick={handleCancelCreatePayslip}
                    variant="secondary"
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg px-6 py-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleStartHelpGuide}
                    variant="secondary"
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg px-6 py-2"
                  >
                    Start help guide
                  </Button>
                  <Button
                    onClick={handleCreatePayslipSubmit}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg px-6 py-2"
                  >
                    Create
                  </Button>
                </>
              ) : (
                /* Default Buttons for Pay Slip and Final Salary */
                <>
                  <Button
                    onClick={handleCancelCreatePayslip}
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleStartHelpGuide}
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Start help guide
                  </Button>
                  <Button
                    onClick={handleCreatePayslipSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Create
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Accounting Documents Modal */}
      {showCreateAccountingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">CREATE ACCOUNTING DOCUMENTS</h2>
              <button
                onClick={handleCloseCreateAccountingModal}
                className="text-white hover:text-gray-200 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Salary Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Salary</label>
                <div className="relative">
                  <input
                    type="text"
                    value={accountingSalary}
                    onChange={(e) => setAccountingSalary(e.target.value)}
                    placeholder="-"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>

              {/* Employer Declaration Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Employer declaration</label>
                <div className="relative">
                  <input
                    type="text"
                    value={accountingEmployerDeclaration}
                    onChange={(e) => setAccountingEmployerDeclaration(e.target.value)}
                    placeholder="-"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>

              {/* Holiday Debt Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Holiday debt</label>
                <div className="relative">
                  <input
                    type="text"
                    value={accountingHolidayDebt}
                    onChange={(e) => setAccountingHolidayDebt(e.target.value)}
                    placeholder="-"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>

              {/* Activate Post Vacation Debt Toggle */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Activate Post vacation debt</label>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium ${!activatePostVacationDebt ? 'text-gray-900' : 'text-gray-500'}`}>
                    No
                  </span>
                  <button
                    type="button"
                    onClick={() => setActivatePostVacationDebt(!activatePostVacationDebt)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                      activatePostVacationDebt ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        activatePostVacationDebt ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className={`text-sm font-medium ${activatePostVacationDebt ? 'text-gray-900' : 'text-gray-500'}`}>
                    Yes
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Your selection here is saved under Settings - Salary - Accounting settings - Post vacation debt.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-4">
              <Button
                onClick={handleCancelCreateAccounting}
                variant="secondary"
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg px-6 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartHelpGuideAccounting}
                variant="secondary"
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg px-6 py-2"
              >
                Start help guide
              </Button>
              <Button
                onClick={handleCreateAccountingSubmit}
                className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg px-6 py-2"
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Employer Declaration Modal */}
      {showCreateEmployerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">CREATE EMPLOYER DECLARATION</h2>
              <button
                onClick={handleCloseCreateEmployerModal}
                className="text-white hover:text-gray-200 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Tax Period Field */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Tax period</label>
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">?</span>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={taxPeriod}
                    onChange={(e) => setTaxPeriod(e.target.value)}
                    onClick={handleTaxPeriodDropdownToggle}
                    className="w-full px-3 py-2 bg-green-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
                    readOnly
                  />
                  <ChevronDown 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer"
                    onClick={handleTaxPeriodDropdownToggle}
                  />
                  
                  {/* Dropdown List */}
                  {showTaxPeriodDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {taxPeriodOptions.map((option, index) => (
                        <div
                          key={index}
                          onClick={() => handleTaxPeriodSelect(option)}
                          className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm text-gray-700 flex items-center justify-between"
                        >
                          <span>{option}</span>
                          {taxPeriod === option && (
                            <span className="text-blue-600 text-xs">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-4">
              <Button
                onClick={handleCancelCreateEmployer}
                variant="secondary"
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg px-6 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartHelpGuideEmployer}
                variant="secondary"
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg px-6 py-2"
              >
                Start help guide
              </Button>
              <Button
                onClick={handleCreateEmployerSubmit}
                className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg px-6 py-2"
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Vacation Calculation Modal */}
      {showCreateVacationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">CREATE VACATION CALCULATION</h2>
              <button
                onClick={handleCloseCreateVacationModal}
                className="text-white hover:text-gray-200 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Staff Type Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Staff type</label>
                <div className="relative">
                  <select
                    value={vacationStaffType}
                    onChange={(e) => setVacationStaffType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all-staff-types">All staff types</option>
                    <option value="officials">Officials</option>
                    <option value="worker">Worker</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Employee Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Employee</label>
                <div className="relative">
                  <select
                    value={vacationModalEmployee}
                    onChange={(e) => setVacationModalEmployee(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all-employees">Alla anställda</option>
                    <option value="john-doe">John Doe</option>
                    <option value="jane-smith">Jane Smith</option>
                    <option value="bob-wilson">Bob Wilson</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Create Empty Date Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Create empty</label>
                <div className="relative">
                  <input
                    type="date"
                    value={createEmptyDate}
                    onChange={(e) => setCreateEmptyDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-4">
              <Button
                onClick={handleCancelCreateVacation}
                variant="secondary"
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg px-6 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateVacationSubmit}
                className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg px-6 py-2"
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create SLP Modal */}
      {showCreateSlpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">CREATE SCB - WAGE STRUCTURE STATISTICS (SLP)</h2>
              <button
                onClick={handleCloseCreateSlpModal}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 bg-gray-50">
              {/* Input Fields */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                  <select
                    value={slpModalEmployee}
                    onChange={(e) => setSlpModalEmployee(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option>All</option>
                    <option>John Doe</option>
                    <option>Jane Smith</option>
                    <option>Bob Wilson</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <select
                    value={slpModalMonth}
                    onChange={(e) => setSlpModalMonth(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option>September 2025</option>
                    <option>August 2025</option>
                    <option>July 2025</option>
                    <option>June 2025</option>
                  </select>
                </div>
              </div>

              {/* Salary Slip Overview Section */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Salary slip overview</h3>
                </div>
                
                {/* Filter Buttons and Controls */}
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSlpFilterChange('all')}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        slpFilterStatus === 'all'
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-white text-gray-500 border border-gray-300'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => handleSlpFilterChange('unpaid')}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        slpFilterStatus === 'unpaid'
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-500 border border-gray-300'
                      }`}
                    >
                      Unpaid
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                      <Menu className="w-4 h-4 text-gray-600" />
                    </div>
                    <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                      <option>0</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          EMPLOYEE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          EXPECTED SALARY STATEMENTS
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CREATED PAY SLIPS
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          PAID PAY SLIPS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center" colSpan={4}>
                          No data available
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <Button
                onClick={handleCancelCreateSlp}
                variant="secondary"
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateSlpSubmit}
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2"
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Preparation Modal */}
      {showCreatePreparationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="bg-green-800 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-lg font-semibold">CREATE NEW PREPARATION</h2>
              <button
                onClick={handleCloseCreatePreparationModal}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type:</label>
                <select
                  value={preparationType}
                  onChange={(e) => setPreparationType(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option>All</option>
                  <option>ITP1</option>
                  <option>ITP2</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee:</label>
                <select
                  value={preparationEmployee}
                  onChange={(e) => setPreparationEmployee(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option>All</option>
                  <option>John Doe</option>
                  <option>Jane Smith</option>
                  <option>Bob Wilson</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month:</label>
                <select
                  value={preparationMonth}
                  onChange={(e) => setPreparationMonth(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option>January</option>
                  <option>February</option>
                  <option>March</option>
                  <option>April</option>
                  <option>May</option>
                  <option>June</option>
                  <option>July</option>
                  <option>August</option>
                  <option>September</option>
                  <option>October</option>
                  <option>November</option>
                  <option>December</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={handleCancelCreatePreparation}
                  variant="secondary"
                  className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePreparationSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2"
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ITP1 Incident Reporting Modal */}
      {showItp1Modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-green-800 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-lg font-semibold">ITP1 INCIDENT REPORTING</h2>
              <button
                onClick={handleCloseItp1Modal}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee:</label>
                  <div className="relative">
                    <Input
                      placeholder="Name, Cost center, Production time"
                      value={itp1Employee}
                      onChange={(e) => setItp1Employee(e.target.value)}
                      className="pr-8"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month:</label>
                  <select
                    value={itp1Month}
                    onChange={(e) => setItp1Month(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option>September</option>
                    <option>October</option>
                    <option>November</option>
                    <option>December</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ITP cost center:</label>
                  <Input
                    value={itp1CostCenter}
                    onChange={(e) => setItp1CostCenter(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ITP1 Product time:</label>
                  <Input
                    value={itp1ProductTime}
                    onChange={(e) => setItp1ProductTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event type:</label>
                  <select
                    value={itp1EventType}
                    onChange={(e) => setItp1EventType(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option>ITP1 Deregistration</option>
                    <option>Other Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event time:</label>
                  <div className="relative">
                    <Input
                      value={itp1EventTime}
                      onChange={(e) => setItp1EventTime(e.target.value)}
                      className="pr-8"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paid salary:</label>
                  <Input
                    value={itp1PaidSalary}
                    onChange={(e) => setItp1PaidSalary(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for departure:</label>
                  <select
                    value={itp1ReasonForDeparture}
                    onChange={(e) => setItp1ReasonForDeparture(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option>Terminated employment</option>
                    <option>Other reason</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={handleCancelItp1}
                  variant="secondary"
                  className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleItp1Submit}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ITP2 Incident Reporting Modal */}
      {showItp2Modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-green-800 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-lg font-semibold">ITP2 INCIDENT REPORTING</h2>
              <button
                onClick={handleCloseItp2Modal}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee:</label>
                  <div className="relative">
                    <Input
                      placeholder="Name, Cost center, Production time"
                      value={itp2Employee}
                      onChange={(e) => setItp2Employee(e.target.value)}
                      className="pr-8"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ITP2-Cost center:</label>
                  <Input
                    value={itp2CostCenter}
                    onChange={(e) => setItp2CostCenter(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ITP2 Product time:</label>
                  <Input
                    value={itp2ProductTime}
                    onChange={(e) => setItp2ProductTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event time:</label>
                  <div className="relative">
                    <Input
                      value={itp2EventTime}
                      onChange={(e) => setItp2EventTime(e.target.value)}
                      className="pr-8"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event type:</label>
                  <select
                    value={itp2EventType}
                    onChange={(e) => setItp2EventType(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option>ITP2 Deregistration</option>
                    <option>Other Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for departure:</label>
                  <select
                    value={itp2ReasonForDeparture}
                    onChange={(e) => setItp2ReasonForDeparture(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option>Terminated employment</option>
                    <option>Other reason</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary basis:</label>
                  <select
                    value={itp2SalaryBasis}
                    onChange={(e) => setItp2SalaryBasis(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option>All</option>
                    <option>Fixed</option>
                    <option>Variable</option>
                  </select>
                </div>
              </div>

              {/* Payment Details Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                      <Menu className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-500">0</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAYMENT</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SALARY TYPE</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DESCRIPTION</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WORKED HOURS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAID SALARY</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0,00</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">0,00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Salary Information Fields */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variable salary year - 1:</label>
                  <Input
                    value={itp2VariableSalary1}
                    onChange={(e) => setItp2VariableSalary1(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variable salary year - 2:</label>
                  <Input
                    value={itp2VariableSalary2}
                    onChange={(e) => setItp2VariableSalary2(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variable salary year - 3:</label>
                  <Input
                    value={itp2VariableSalary3}
                    onChange={(e) => setItp2VariableSalary3(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fixed salary:</label>
                  <Input
                    value={itp2FixedSalary}
                    onChange={(e) => setItp2FixedSalary(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supplements and allowances:</label>
                  <Input
                    value={itp2Supplements}
                    onChange={(e) => setItp2Supplements(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Average variable salary:</label>
                  <Input
                    value={itp2AverageVariableSalary}
                    onChange={(e) => setItp2AverageVariableSalary(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Degree of incapacity for work:</label>
                  <Input
                    value={itp2IncapacityDegree}
                    onChange={(e) => setItp2IncapacityDegree(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual salary after salary waiver:</label>
                  <Input
                    value={itp2AnnualSalaryAfterWaiver}
                    onChange={(e) => setItp2AnnualSalaryAfterWaiver(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual salary:</label>
                  <Input
                    value={itp2AnnualSalary}
                    onChange={(e) => setItp2AnnualSalary(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={handleRecreateItp2}
                  variant="secondary"
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg px-6 py-2"
                >
                  Recreate
                </Button>
                <Button
                  onClick={handleCancelItp2}
                  variant="secondary"
                  className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleItp2Submit}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Salary Reporting Forums Modal */}
      {showSalaryReportingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="bg-green-800 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-lg font-semibold">SALARY REPORTING FORUMS</h2>
              <button
                onClick={handleCloseSalaryReportingModal}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isYearSelection ? 'Select year' : 'Select month'} <span className="text-red-500">*</span>
                </label>
                {isYearSelection ? (
                  <select
                    value={selectedReportingYear}
                    onChange={(e) => setSelectedReportingYear(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option>2020</option>
                    <option>2021</option>
                    <option>2022</option>
                    <option>2023</option>
                    <option>2024</option>
                    <option>2025</option>
                    <option>2026</option>
                    <option>2027</option>
                    <option>2028</option>
                    <option>2029</option>
                    <option>2030</option>
                  </select>
                ) : (
                  <select
                    value={selectedReportingMonth}
                    onChange={(e) => setSelectedReportingMonth(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option>January</option>
                    <option>February</option>
                    <option>March</option>
                    <option>April</option>
                    <option>May</option>
                    <option>June</option>
                    <option>July</option>
                    <option>August</option>
                    <option>September</option>
                    <option>October</option>
                    <option>November</option>
                    <option>December</option>
                  </select>
                )}
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={handleCancelSalaryReporting}
                  variant="secondary"
                  className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSalaryReportingSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2"
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create SN Modal */}
      {showCreateSnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-green-800 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-lg font-semibold">CREATE SCB - WAGE STRUCTURE STATISTICS (SLP)</h2>
              <button
                onClick={handleCloseCreateSnModal}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee:</label>
                  <select
                    value={snSelectedEmployee}
                    onChange={(e) => setSnSelectedEmployee(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option>All</option>
                    <option>John Doe</option>
                    <option>Jane Smith</option>
                    <option>Bob Wilson</option>
                    <option>Alice Johnson</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month:</label>
                  <select
                    value={snSelectedMonth}
                    onChange={(e) => setSnSelectedMonth(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option>January 2025</option>
                    <option>February 2025</option>
                    <option>March 2025</option>
                    <option>April 2025</option>
                    <option>May 2025</option>
                    <option>June 2025</option>
                    <option>July 2025</option>
                    <option>August 2025</option>
                    <option>September 2025</option>
                    <option>October 2025</option>
                    <option>November 2025</option>
                    <option>December 2025</option>
                  </select>
                </div>
              </div>

              {/* Salary Slip Overview Section */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Salary slip overview</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                      <Menu className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-500">0</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <button
                      onClick={() => handleSnFilterChange('all')}
                      className={`px-4 py-2 rounded text-sm font-medium ${
                        snFilterStatus === 'all' 
                          ? 'bg-white text-gray-700 border border-gray-300' 
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => handleSnFilterChange('unpaid')}
                      className={`px-4 py-2 rounded text-sm font-medium ${
                        snFilterStatus === 'unpaid' 
                          ? 'bg-red-100 text-red-700 border border-red-300' 
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}
                    >
                      Unpaid
                    </button>
                  </div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMPLOYEE</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EXPECTED SALARY STATEMENTS</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED PAY SLIPS</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAID PAY SLIPS</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                          No data available
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={handleCancelCreateSn}
                  variant="secondary"
                  className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateSnSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2"
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create KLP Modal */}
      {showCreateKlpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-green-800 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-lg font-semibold">CREATE SCB - BUSINESS CYCLE STATISTICS (KLP)</h2>
              <button
                onClick={handleCloseCreateKlpModal}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee:</label>
                  <select
                    value={klpSelectedEmployee}
                    onChange={(e) => setKlpSelectedEmployee(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option>All</option>
                    <option>John Doe</option>
                    <option>Jane Smith</option>
                    <option>Bob Wilson</option>
                    <option>Alice Johnson</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month:</label>
                  <select
                    value={klpSelectedMonth}
                    onChange={(e) => setKlpSelectedMonth(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option>January</option>
                    <option>February</option>
                    <option>March</option>
                    <option>April</option>
                    <option>May</option>
                    <option>June</option>
                    <option>July</option>
                    <option>August</option>
                    <option>September</option>
                    <option>October</option>
                    <option>November</option>
                    <option>December</option>
                  </select>
                </div>
              </div>

              {/* Salary Slip Overview Section */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Salary slip overview</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                      <Menu className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-500">0</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <button
                      onClick={() => handleKlpFilterChange('all')}
                      className={`px-4 py-2 rounded text-sm font-medium ${
                        klpFilterStatus === 'all' 
                          ? 'bg-white text-gray-700 border border-gray-300' 
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => handleKlpFilterChange('unpaid')}
                      className={`px-4 py-2 rounded text-sm font-medium ${
                        klpFilterStatus === 'unpaid' 
                          ? 'bg-red-100 text-red-700 border border-red-300' 
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}
                    >
                      Unpaid
                    </button>
                  </div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMPLOYEE</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EXPECTED SALARY STATEMENTS</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED PAY SLIPS</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAID PAY SLIPS</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                          No data available
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={handleCancelCreateKlp}
                  variant="secondary"
                  className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateKlpSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2"
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create KSJU Modal */}
      {showCreateKsjuModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="bg-green-800 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-lg font-semibold">CREATE SCB - BUSINESS CYCLE STATISTICS ON SICK PAY (KSJU)</h2>
              <button
                onClick={handleCloseCreateKsjuModal}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee:</label>
                  <select
                    value={ksjuSelectedEmployee}
                    onChange={(e) => setKsjuSelectedEmployee(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option>All</option>
                    <option>John Doe</option>
                    <option>Jane Smith</option>
                    <option>Bob Wilson</option>
                    <option>Alice Johnson</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month:</label>
                  <select
                    value={ksjuSelectedMonth}
                    onChange={(e) => setKsjuSelectedMonth(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option>January</option>
                    <option>February</option>
                    <option>March</option>
                    <option>April</option>
                    <option>May</option>
                    <option>June</option>
                    <option>July</option>
                    <option>August</option>
                    <option>September</option>
                    <option>October</option>
                    <option>November</option>
                    <option>December</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={handleCancelCreateKsju}
                  variant="secondary"
                  className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateKsjuSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2"
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create SUS Modal */}
      {showCreateSusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="bg-green-800 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-lg font-semibold">CREATE SCB - SICKNESS ABSENCE DURING THE SICK PAY PERIOD (SUS)</h2>
              <button
                onClick={handleCloseCreateSusModal}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee:</label>
                  <select
                    value={susSelectedEmployee}
                    onChange={(e) => setSusSelectedEmployee(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option>All</option>
                    <option>John Doe</option>
                    <option>Jane Smith</option>
                    <option>Bob Wilson</option>
                    <option>Alice Johnson</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month:</label>
                  <select
                    value={susSelectedMonth}
                    onChange={(e) => setSusSelectedMonth(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option>January</option>
                    <option>February</option>
                    <option>March</option>
                    <option>April</option>
                    <option>May</option>
                    <option>June</option>
                    <option>July</option>
                    <option>August</option>
                    <option>September</option>
                    <option>October</option>
                    <option>November</option>
                    <option>December</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={handleCancelCreateSus}
                  variant="secondary"
                  className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateSusSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2"
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create KSP Modal */}
      {showCreateKspModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="bg-green-800 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-lg font-semibold">CREATE SCB SHORT-TERM EMPLOYMENT STATISTICS (KSP)</h2>
              <button
                onClick={handleCloseCreateKspModal}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee:</label>
                  <select
                    value={kspSelectedEmployee}
                    onChange={(e) => setKspSelectedEmployee(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option>All</option>
                    <option>John Doe</option>
                    <option>Jane Smith</option>
                    <option>Bob Wilson</option>
                    <option>Alice Johnson</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date:</label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={kspSelectedDate}
                      onChange={(e) => setKspSelectedDate(e.target.value)}
                      className="w-full pr-8"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  onClick={handleCancelCreateKsp}
                  variant="secondary"
                  className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateKspSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2"
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryPage;
