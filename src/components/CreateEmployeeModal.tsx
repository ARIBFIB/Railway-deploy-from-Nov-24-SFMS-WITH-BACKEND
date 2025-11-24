import React, { useState, useEffect } from 'react';
import { X, Save, Plus, RefreshCw, ArrowRightLeft, Check, Search, ChevronDown, ChevronUp, HelpCircle, FileText, Copy, Printer, Wrench, Calendar, Trash2 } from 'lucide-react';

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeData: any) => void;
}

const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'personnel' | 'tax' | 'employment' | 'salary' | 'holiday' | 'atf' | 'reporting' | 'opening'>('personnel');
  const [formData, setFormData] = useState({
    employmentId: '1',
    socialSecurityNumber: '',
    socialSecurityNumberMissing: false,
    firstName: '',
    lastName: '',
    clearingNumber: '',
    bankAccountNumber: '',
    typeOfPaySlip: 'digital',
    languageOnPaySlip: 'swedish',
    connectedUsers: 'The person is not connected to any user.',
    postalAddress: '',
    postalAddress2: '',
    postalCode: '',
    city: '',
    country: '',
    email: '',
    phone: '',
    phone2: '',
    relative1Name: '',
    relative1Phone: '',
    relative2Name: '',
    relative2Phone: '',
    infoText: '',
    calendar: 'no',
    markReadyInCalendar: 'no',
    allowEmployeesToChangeTasks: true,
    // Tax section
    taxDeduction: 'Main employer (Tax according to tax table)',
    taxTable: '',
    taxColumn: '1',
    workExpensesDeduction: '',
    automaticOneTimeTax: 'no',
    estimatedAnnualSalary: '0,00',
    oneTimeTax: '30,00',
    employerContribution: 'no',
    athlete: 'no',
    // Employment section
    employeeDate: '',
    employmentType: 'Permanent employment',
    salaryForm: 'Monthly salary',
    position: '',
    staffType: 'Official',
    agreementForSalaries: 'Agreement for civil servants',
    employmentEnds: '',
    probationaryEmployeeUntil: '',
    active: 'yes',
    workingHoursSchedule: 'Heltid',
    employmentRate: '100,00',
    weeklyWorkingHours: '40,00',
    daytimeWorkingHours: '8,00',
    workingDays: '5,00',
    grossSalaryAccount: '7210',
    employerContributionAccount: '7510',
    costCenter: '',
    project: '',
    distributionTemplate: '',
    // Salary information section
    monthlySalary: '0.00',
    salarySupplement: '0.00',
    haveCompanyCar: 'yes',
    karensIllness: 'yes',
    averageHourlyWage: '0.00',
    averageWorkingHoursPerWeek: '0.00',
    maximumQualifyingDeduction: '0.00',
    obAdditionSimple: '0.00',
    obSupplementQualified: '0.00',
    obSupplementWeekend: '0.00',
    obSupplement4: '0.00',
    obSupplement5: '0.00',
    unionFee: '0.00',
    travelTimeCompensation: '0.00',
    salaryTypeTable: 'According to agreement',
    standardSalaryType: '12',
    standardSalaryName: 'Månadslön',
    standardSalaryNumber: '',
    standardSalaryUnit: 'mån',
    standardSalaryAmount: '0.00',
    standardSalaryOutlay: '',
    standardSalaryVat: '',
    standardSalaryTextLine: '',
    selectSalaryType: '',
    // Holiday section
    holidayRule: 'percentage',
    startDay: '',
    estimatedEmpty: '',
    holidayEntitlement: '25',
    paidDaysSalaryPerDay: '0,00',
    paidDaysNumberOfDays: '0,00',
    paidDaysRegisteredDays: '0,00',
    paidDaysPaidDays: '0,00',
    paidDaysRemainingDays: '0,00',
    paidDaysEmploymentRate: '100,00',
    daysSavedSalaryPerDay: '0,00',
    daysSavedNumberOfDays: '0,00',
    daysSavedRegisteredDays: '0,00',
    daysSavedPaidDays: '0,00',
    daysSavedRemainingDays: '0,00',
    daysSavedEmploymentRate: '100,00',
    unpaidDaysSalaryPerDay: '0,00',
    unpaidDaysNumberOfDays: '0,00',
    unpaidDaysRegisteredDays: '0,00',
    unpaidDaysPaidDays: '0,00',
    unpaidDaysRemainingDays: '0,00',
    advanceDaysSalaryPerDay: '0,00',
    advanceDaysNumberOfDays: '0,00',
    advanceDaysRegisteredDays: '0,00',
    advanceDaysPaidDays: '0,00',
    advanceDaysRemainingDays: '0,00',
    // Vacation days saved per earning year
    savedDays1Year: '0,00',
    savedDays1YearRegistered: '0,00',
    savedDays1YearPaid: '0,00',
    savedDays1YearEmploymentRate: '0,00',
    savedDays2Year: '0,00',
    savedDays2YearRegistered: '0,00',
    savedDays2YearPaid: '0,00',
    savedDays2YearEmploymentRate: '0,00',
    savedDays3Year: '0,00',
    savedDays3YearRegistered: '0,00',
    savedDays3YearPaid: '0,00',
    savedDays3YearEmploymentRate: '0,00',
    savedDays4Year: '0,00',
    savedDays4YearRegistered: '0,00',
    savedDays4YearPaid: '0,00',
    savedDays4YearEmploymentRate: '0,00',
    savedDays5Year: '0,00',
    savedDays5YearRegistered: '0,00',
    savedDays5YearPaid: '0,00',
    savedDays5YearEmploymentRate: '0,00',
    savedDays6Year: '0,00',
    savedDays6YearRegistered: '0,00',
    savedDays6YearPaid: '0,00',
    savedDays6YearEmploymentRate: '0,00',
    // Children's register
    childrenCount: '10',
    grantedDays: '120',
    incomingDaysWithdrawn: '0',
    totalDaysWithdrawn: '0',
    // Total holiday pay
    totalHolidayPayAmount: '0,00',
    totalHolidayPayPaidOut: '0,00',
    totalHolidayPayLeft: '0,00',
    // Variable add-on
    variableAddOnAmount: '0,00',
    variableAddOnPaidOut: '0,00',
    variableAddOnLeft: '0,00',
    // Advance vacation in kronor
    advanceVacationOpeningDebt: '0,00',
    advanceVacationAmountPaidOut: '0,00',
    advanceVacationTotalDebt: '0,00',
    // Settings for vacation calculation
    shouldBeIncludedInVacationCalculation: 'no',
    soleCustody: 'no',
    calculateOnlySumNoDays: 'no',
    // ATF/ATK section
    workingHoursCalculation: 'no',
    // Reporting section
    // The Swedish Tax Agency
    specificationNumberForAGI: '1',
    workplaceStreetAddress: '',
    leaveBlank: false,
    workplaceNumberToAGI: '',
    workplaceLocation: '',
    // Collection
    collectumITP: 'yes',
    deviantType: 'yes',
    // Forums
    monthlyReportingStartDate: '',
    monthlyReportingMarkup: 'Not drawn',
    asl65: false,
    kp65: false,
    annualReportingForumType: 'Not drawn',
    // Statistics
    categorySalarySurvey: '',
    workplaceNumber: '',
    weekendPay: 'yes',
    workingTimeType: '',
    // SCB Wage Structure Statistics (SLP)
    scbWageStructureInclude: 'yes',
    professionalCodeSSYK2012: '',
    // SN Salary Statistics
    snSalaryStatisticsInclude: 'yes',
    professionalCodeNYK14: '',
    federalCivilServantNumber: '',
    workplaceNumberSN: '',
    contractCodeCivilServant: '',
    jobStatus: 'Other employees',
    hourlyWageToBeReportedInField13: 'no',
    // SCB Economic statistics (KLP)
    scbEconomicStatisticsInclude: 'yes',
    // Statistics Sweden Business cycle statistics on sick pay (KSJU)
    statisticsSwedenBusinessCycleInclude: 'yes',
    // SCB Sickness absence during the pay period (SUS)
    scbSicknessAbsenceInclude: 'yes',
    // Opening Balance section
    // Incoming flextime
    incomingFlextime: '',
    incomingFlextimeThisYearChange: '',
    incomingFlextimeCurrentBalance: '0,00',
    // Incoming comp time
    incomingCompTime: '',
    incomingCompTimeThisYearChange: '',
    incomingCompTimeCurrentBalance: '0,00',
    // Initial holiday values - Basis for calculation
    // Holiday Entitlement Salary
    totalSalary: '',
    salaryVariableAllowance: '',
    salaryForTimeWorked: '',
    // Average Wages Per Day
    estimatedAverageSalaryPerDay: '',
    estimatedVariablePerDay: '',
    // Holiday-based Attendance
    attendanceTimeInDays: '',
    attendanceTimeInHours: '',
    // Average Hourly Wage
    estimatedAverageHourlyWage: '',
    estimatedHourlyRate: '',
    // Absence Working Days
    holidayPayEstablishmentDays: '',
    notEligibleForHolidayPayDays: '',
    // Absence in Hours
    holidayPayEstablishmentHours: '',
    notEligibleForHolidayPayHours: '',
    // Non-Holiday Calendar Days
    wholeDaysAffectVacationDays: '',
    partOfDayAffectsEmploymentRate: '',
    // Holiday-Starting Calendar Days
    wholeDaysDoNotAffectVacationDays: '',
    // Starting salary
    deductedPreliminaryTax: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employmentId.trim()) {
      newErrors.employmentId = 'Employment ID is required';
    }
    if (!formData.socialSecurityNumber.trim() && !formData.socialSecurityNumberMissing) {
      newErrors.socialSecurityNumber = 'Social security number is required';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const handleCancel = () => {
    setFormData({
      employmentId: '1',
      socialSecurityNumber: '',
      socialSecurityNumberMissing: false,
      firstName: '',
      lastName: '',
      clearingNumber: '',
      bankAccountNumber: '',
      typeOfPaySlip: 'digital',
      languageOnPaySlip: 'swedish',
      connectedUsers: 'The person is not connected to any user.',
      postalAddress: '',
      postalAddress2: '',
      postalCode: '',
      city: '',
      country: '',
      email: '',
      phone: '',
      phone2: '',
      relative1Name: '',
      relative1Phone: '',
      relative2Name: '',
      relative2Phone: '',
      infoText: '',
      calendar: 'no',
      markReadyInCalendar: 'no',
      allowEmployeesToChangeTasks: true,
      // Tax section
      taxDeduction: 'Main employer (Tax according to tax table)',
      taxTable: '',
      taxColumn: '1',
      workExpensesDeduction: '',
      automaticOneTimeTax: 'no',
      estimatedAnnualSalary: '0,00',
      oneTimeTax: '30,00',
      employerContribution: 'no',
      athlete: 'no',
      // Employment section
      employeeDate: '',
      employmentType: 'Permanent employment',
      salaryForm: 'Monthly salary',
      position: '',
      staffType: 'Official',
      agreementForSalaries: 'Agreement for civil servants',
      employmentEnds: '',
      probationaryEmployeeUntil: '',
      active: 'yes',
      workingHoursSchedule: 'Heltid',
      employmentRate: '100,00',
      weeklyWorkingHours: '40,00',
      daytimeWorkingHours: '8,00',
      workingDays: '5,00',
      grossSalaryAccount: '7210',
      employerContributionAccount: '7510',
      costCenter: '',
      project: '',
      distributionTemplate: '',
      // Salary information section
      monthlySalary: '0.00',
      salarySupplement: '0.00',
      haveCompanyCar: 'yes',
      karensIllness: 'yes',
      averageHourlyWage: '0.00',
      averageWorkingHoursPerWeek: '0.00',
      maximumQualifyingDeduction: '0.00',
      obAdditionSimple: '0.00',
      obSupplementQualified: '0.00',
      obSupplementWeekend: '0.00',
      obSupplement4: '0.00',
      obSupplement5: '0.00',
      unionFee: '0.00',
      travelTimeCompensation: '0.00',
      salaryTypeTable: 'According to agreement',
      standardSalaryType: '12',
      standardSalaryName: 'Månadslön',
      standardSalaryNumber: '',
      standardSalaryUnit: 'mån',
      standardSalaryAmount: '0.00',
      standardSalaryOutlay: '',
      standardSalaryVat: '',
      standardSalaryTextLine: '',
      selectSalaryType: '',
      // Holiday section
      holidayRule: 'percentage',
      startDay: '',
      estimatedEmpty: '',
      holidayEntitlement: '25',
      paidDaysSalaryPerDay: '0,00',
      paidDaysNumberOfDays: '0,00',
      paidDaysRegisteredDays: '0,00',
      paidDaysPaidDays: '0,00',
      paidDaysRemainingDays: '0,00',
      paidDaysEmploymentRate: '100,00',
      daysSavedSalaryPerDay: '0,00',
      daysSavedNumberOfDays: '0,00',
      daysSavedRegisteredDays: '0,00',
      daysSavedPaidDays: '0,00',
      daysSavedRemainingDays: '0,00',
      daysSavedEmploymentRate: '100,00',
      unpaidDaysSalaryPerDay: '0,00',
      unpaidDaysNumberOfDays: '0,00',
      unpaidDaysRegisteredDays: '0,00',
      unpaidDaysPaidDays: '0,00',
      unpaidDaysRemainingDays: '0,00',
      advanceDaysSalaryPerDay: '0,00',
      advanceDaysNumberOfDays: '0,00',
      advanceDaysRegisteredDays: '0,00',
      advanceDaysPaidDays: '0,00',
      advanceDaysRemainingDays: '0,00',
      // Vacation days saved per earning year
      savedDays1Year: '0,00',
      savedDays1YearRegistered: '0,00',
      savedDays1YearPaid: '0,00',
      savedDays1YearEmploymentRate: '0,00',
      savedDays2Year: '0,00',
      savedDays2YearRegistered: '0,00',
      savedDays2YearPaid: '0,00',
      savedDays2YearEmploymentRate: '0,00',
      savedDays3Year: '0,00',
      savedDays3YearRegistered: '0,00',
      savedDays3YearPaid: '0,00',
      savedDays3YearEmploymentRate: '0,00',
      savedDays4Year: '0,00',
      savedDays4YearRegistered: '0,00',
      savedDays4YearPaid: '0,00',
      savedDays4YearEmploymentRate: '0,00',
      savedDays5Year: '0,00',
      savedDays5YearRegistered: '0,00',
      savedDays5YearPaid: '0,00',
      savedDays5YearEmploymentRate: '0,00',
      savedDays6Year: '0,00',
      savedDays6YearRegistered: '0,00',
      savedDays6YearPaid: '0,00',
      savedDays6YearEmploymentRate: '0,00',
      // Children's register
      childrenCount: '10',
      grantedDays: '120',
      incomingDaysWithdrawn: '0',
      totalDaysWithdrawn: '0',
      // Total holiday pay
      totalHolidayPayAmount: '0,00',
      totalHolidayPayPaidOut: '0,00',
      totalHolidayPayLeft: '0,00',
      // Variable add-on
      variableAddOnAmount: '0,00',
      variableAddOnPaidOut: '0,00',
      variableAddOnLeft: '0,00',
      // Advance vacation in kronor
      advanceVacationOpeningDebt: '0,00',
      advanceVacationAmountPaidOut: '0,00',
      advanceVacationTotalDebt: '0,00',
      // Settings for vacation calculation
      shouldBeIncludedInVacationCalculation: 'no',
      soleCustody: 'no',
      calculateOnlySumNoDays: 'no',
      // ATF/ATK section
      workingHoursCalculation: 'no',
      // Reporting section
      // The Swedish Tax Agency
      specificationNumberForAGI: '1',
      workplaceStreetAddress: '',
      leaveBlank: false,
      workplaceNumberToAGI: '',
      workplaceLocation: '',
      // Collection
      collectumITP: 'yes',
      deviantType: 'yes',
      // Forums
      monthlyReportingStartDate: '',
      monthlyReportingMarkup: 'Not drawn',
      asl65: false,
      kp65: false,
      annualReportingForumType: 'Not drawn',
      // Statistics
      categorySalarySurvey: '',
      workplaceNumber: '',
      weekendPay: 'yes',
      workingTimeType: '',
      // SCB Wage Structure Statistics (SLP)
      scbWageStructureInclude: 'yes',
      professionalCodeSSYK2012: '',
      // SN Salary Statistics
      snSalaryStatisticsInclude: 'yes',
      professionalCodeNYK14: '',
      federalCivilServantNumber: '',
      workplaceNumberSN: '',
      contractCodeCivilServant: '',
      jobStatus: 'Other employees',
      hourlyWageToBeReportedInField13: 'no',
      // SCB Economic statistics (KLP)
      scbEconomicStatisticsInclude: 'yes',
      // Statistics Sweden Business cycle statistics on sick pay (KSJU)
      statisticsSwedenBusinessCycleInclude: 'yes',
      // SCB Sickness absence during the pay period (SUS)
      scbSicknessAbsenceInclude: 'yes',
      // Opening Balance section
      // Incoming flextime
      incomingFlextime: '',
      incomingFlextimeThisYearChange: '',
      incomingFlextimeCurrentBalance: '0,00',
      // Incoming comp time
      incomingCompTime: '',
      incomingCompTimeThisYearChange: '',
      incomingCompTimeCurrentBalance: '0,00',
      // Initial holiday values - Basis for calculation
      // Holiday Entitlement Salary
      totalSalary: '',
      salaryVariableAllowance: '',
      salaryForTimeWorked: '',
      // Average Wages Per Day
      estimatedAverageSalaryPerDay: '',
      estimatedVariablePerDay: '',
      // Holiday-based Attendance
      attendanceTimeInDays: '',
      attendanceTimeInHours: '',
      // Average Hourly Wage
      estimatedAverageHourlyWage: '',
      estimatedHourlyRate: '',
      // Absence Working Days
      holidayPayEstablishmentDays: '',
      notEligibleForHolidayPayDays: '',
      // Absence in Hours
      holidayPayEstablishmentHours: '',
      notEligibleForHolidayPayHours: '',
      // Non-Holiday Calendar Days
      wholeDaysAffectVacationDays: '',
      partOfDayAffectsEmploymentRate: '',
      // Holiday-Starting Calendar Days
      wholeDaysDoNotAffectVacationDays: '',
      // Starting salary
      deductedPreliminaryTax: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">PERSONNEL CARD - CREATE NEW</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg text-sm">
                    Calendar
                  </button>
                  <button className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg text-sm">
                    Staff card
                  </button>
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm">
                    Payroll processing
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Employment ID, first name, last name, personal"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Create employee</span>
                  </button>
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg flex items-center space-x-2">
                    <span>☰</span>
                    <span>Show list</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6">
            <div className="flex items-center justify-between">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('personnel')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'personnel'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Personnel information
                </button>
                <button
                  onClick={() => setActiveTab('tax')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'tax'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Tax
                </button>
                <button
                  onClick={() => setActiveTab('employment')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'employment'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Employment
                </button>
                <button
                  onClick={() => setActiveTab('salary')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'salary'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Salary information
                </button>
                <button
                  onClick={() => setActiveTab('holiday')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'holiday'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Holiday
                </button>
                <button
                  onClick={() => setActiveTab('atf')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'atf'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  ATF/ATK
                </button>
                <button
                  onClick={() => setActiveTab('reporting')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reporting'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Reporting
                </button>
                <button
                  onClick={() => setActiveTab('opening')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'opening'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Opening Balance
                </button>
              </div>
              
              <div className="flex items-center space-x-0.5 ml-8">
                <button className="flex items-center space-x-0.5 text-gray-500 hover:text-gray-700 text-xs px-1 py-0.5 rounded hover:bg-gray-50">
                  <FileText className="w-2.5 h-2.5" />
                  <span className="text-xs">Employer certificate</span>
                </button>
                <button className="flex items-center space-x-0.5 text-gray-500 hover:text-gray-700 text-xs px-1 py-0.5 rounded hover:bg-gray-50">
                  <Copy className="w-2.5 h-2.5" />
                  <span className="text-xs">Copy</span>
                </button>
                <button className="flex items-center space-x-0.5 text-gray-500 hover:text-gray-700 text-xs px-1 py-0.5 rounded hover:bg-gray-50">
                  <Save className="w-2.5 h-2.5" />
                  <span className="text-xs">Save as template</span>
                </button>
                <button className="flex items-center space-x-0.5 text-gray-500 hover:text-gray-700 text-xs px-1 py-0.5 rounded hover:bg-gray-50">
                  <Printer className="w-2.5 h-2.5" />
                  <span className="text-xs">Printing</span>
                </button>
                <button className="flex items-center space-x-0.5 text-gray-500 hover:text-gray-700 text-xs px-1 py-0.5 rounded hover:bg-gray-50">
                  <Wrench className="w-2.5 h-2.5" />
                  <span className="text-xs">Reconstructing vacation</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'personnel' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Personal information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employment ID *
                    </label>
                    <input
                      type="text"
                      value={formData.employmentId}
                      onChange={(e) => handleInputChange('employmentId', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.employmentId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.employmentId && (
                      <p className="mt-1 text-sm text-red-600">{errors.employmentId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Social security number *
                    </label>
                    <input
                      type="text"
                      value={formData.socialSecurityNumber}
                      onChange={(e) => handleInputChange('socialSecurityNumber', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.socialSecurityNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.socialSecurityNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.socialSecurityNumber}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="socialSecurityNumberMissing"
                      checked={formData.socialSecurityNumberMissing}
                      onChange={(e) => handleInputChange('socialSecurityNumberMissing', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="socialSecurityNumberMissing" className="text-sm text-gray-700">
                      Social security number missing
                    </label>
                    <HelpCircle className="w-4 h-4 text-blue-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clearing number
                    </label>
                    <input
                      type="text"
                      value={formData.clearingNumber}
                      onChange={(e) => handleInputChange('clearingNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank account number
                    </label>
                    <input
                      type="text"
                      value={formData.bankAccountNumber}
                      onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Type of pay slip
                      <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                    </label>
                    <select
                      value={formData.typeOfPaySlip}
                      onChange={(e) => handleInputChange('typeOfPaySlip', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="digital">Digital</option>
                      <option value="paper">Paper</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language on pay slip
                    </label>
                    <select
                      value={formData.languageOnPaySlip}
                      onChange={(e) => handleInputChange('languageOnPaySlip', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="swedish">Swedish</option>
                      <option value="english">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Connected users
                    </label>
                    <p className="text-sm text-gray-600">{formData.connectedUsers}</p>
                  </div>
                </div>

                {/* Contact details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal address
                    </label>
                    <input
                      type="text"
                      value={formData.postalAddress}
                      onChange={(e) => handleInputChange('postalAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal address 2
                    </label>
                    <input
                      type="text"
                      value={formData.postalAddress2}
                      onChange={(e) => handleInputChange('postalAddress2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal code
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone 2
                    </label>
                    <input
                      type="tel"
                      value={formData.phone2}
                      onChange={(e) => handleInputChange('phone2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Information for relatives */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Information for relatives</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name of relative 1
                    </label>
                    <input
                      type="text"
                      value={formData.relative1Name}
                      onChange={(e) => handleInputChange('relative1Name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.relative1Phone}
                      onChange={(e) => handleInputChange('relative1Phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name of relative 2
                    </label>
                    <input
                      type="text"
                      value={formData.relative2Name}
                      onChange={(e) => handleInputChange('relative2Name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.relative2Phone}
                      onChange={(e) => handleInputChange('relative2Phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Info text
                    </label>
                    <textarea
                      value={formData.infoText}
                      onChange={(e) => handleInputChange('infoText', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Calendar
                      <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="calendar"
                          value="yes"
                          checked={formData.calendar === 'yes'}
                          onChange={(e) => handleInputChange('calendar', e.target.value)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="calendar"
                          value="no"
                          checked={formData.calendar === 'no'}
                          onChange={(e) => handleInputChange('calendar', e.target.value)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Mark ready in calendar
                      <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="markReadyInCalendar"
                          value="yes"
                          checked={formData.markReadyInCalendar === 'yes'}
                          onChange={(e) => handleInputChange('markReadyInCalendar', e.target.value)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="markReadyInCalendar"
                          value="no"
                          checked={formData.markReadyInCalendar === 'no'}
                          onChange={(e) => handleInputChange('markReadyInCalendar', e.target.value)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allow employees to change tasks
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="allowEmployeesToChangeTasks"
                        checked={formData.allowEmployeesToChangeTasks}
                        onChange={(e) => handleInputChange('allowEmployeesToChangeTasks', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="allowEmployeesToChangeTasks" className="text-sm text-gray-700">
                        Active
                      </label>
                      {formData.allowEmployeesToChangeTasks && (
                        <span className="text-green-600">✓</span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    <p>* Fee per private expense, business purchase and trip. See <a href="#" className="text-blue-600 hover:underline">price list</a></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tax Tab */}
          {activeTab === 'tax' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Tax</h2>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-medium">
                  Tax inquiry
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tax deduction */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tax deduction</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main employer (Tax according to tax table)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.taxDeduction}
                        onChange={(e) => handleInputChange('taxDeduction', e.target.value)}
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax table *
                    </label>
                    <input
                      type="text"
                      value={formData.taxTable}
                      onChange={(e) => handleInputChange('taxTable', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax column
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.taxColumn}
                        onChange={(e) => handleInputChange('taxColumn', e.target.value)}
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Deduction for work expenses (%)
                      <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                    </label>
                    <input
                      type="text"
                      value={formData.workExpensesDeduction}
                      onChange={(e) => handleInputChange('workExpensesDeduction', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Automatic calculation of one-time tax */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    Automatic calculation of one-time tax
                    <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                  </h3>
                  
                  <div>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="automaticOneTimeTax"
                          value="yes"
                          checked={formData.automaticOneTimeTax === 'yes'}
                          onChange={(e) => handleInputChange('automaticOneTimeTax', e.target.value)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="automaticOneTimeTax"
                          value="no"
                          checked={formData.automaticOneTimeTax === 'no'}
                          onChange={(e) => handleInputChange('automaticOneTimeTax', e.target.value)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated annual salary
                    </label>
                    <input
                      type="text"
                      value={formData.estimatedAnnualSalary}
                      onChange={(e) => handleInputChange('estimatedAnnualSalary', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      One-time tax (%)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={formData.oneTimeTax}
                        onChange={(e) => handleInputChange('oneTimeTax', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <a href="#" className="text-blue-600 hover:underline text-sm">One-time amount</a>
                    </div>
                  </div>
                </div>

                {/* Employer's contribution */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    Employer's contribution
                    <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                  </h3>
                  
                  <div>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="employerContribution"
                          value="yes"
                          checked={formData.employerContribution === 'yes'}
                          onChange={(e) => handleInputChange('employerContribution', e.target.value)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="employerContribution"
                          value="no"
                          checked={formData.employerContribution === 'no'}
                          onChange={(e) => handleInputChange('employerContribution', e.target.value)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 flex items-center">
                      Athlete
                      <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                    </h4>
                    <div className="flex space-x-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="athlete"
                          value="yes"
                          checked={formData.athlete === 'yes'}
                          onChange={(e) => handleInputChange('athlete', e.target.value)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="athlete"
                          value="no"
                          checked={formData.athlete === 'no'}
                          onChange={(e) => handleInputChange('athlete', e.target.value)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Employment Tab */}
          {activeTab === 'employment' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Employment</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Employment */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Employment</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employee *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.employeeDate}
                        onChange={(e) => handleInputChange('employeeDate', e.target.value)}
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employment type
                    </label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => handleInputChange('employmentType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Permanent employment">Permanent employment</option>
                      <option value="Temporary employment">Temporary employment</option>
                      <option value="Consultant">Consultant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary form
                    </label>
                    <select
                      value={formData.salaryForm}
                      onChange={(e) => handleInputChange('salaryForm', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Monthly salary">Monthly salary</option>
                      <option value="Hourly salary">Hourly salary</option>
                      <option value="Daily salary">Daily salary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Staff type
                    </label>
                    <select
                      value={formData.staffType}
                      onChange={(e) => handleInputChange('staffType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Official">Official</option>
                      <option value="Worker">Worker</option>
                      <option value="Manager">Manager</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agreement for salaries
                    </label>
                    <select
                      value={formData.agreementForSalaries}
                      onChange={(e) => handleInputChange('agreementForSalaries', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Agreement for civil servants">Agreement for civil servants</option>
                      <option value="Trade agreement">Trade agreement</option>
                      <option value="Worker agreement">Worker agreement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Employment ends
                      <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.employmentEnds}
                        onChange={(e) => handleInputChange('employmentEnds', e.target.value)}
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Probationary employee until
                      <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.probationaryEmployeeUntil}
                        onChange={(e) => handleInputChange('probationaryEmployeeUntil', e.target.value)}
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Active
                      <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="active"
                          value="yes"
                          checked={formData.active === 'yes'}
                          onChange={(e) => handleInputChange('active', e.target.value)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="active"
                          value="no"
                          checked={formData.active === 'no'}
                          onChange={(e) => handleInputChange('active', e.target.value)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>

                {/* Times */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Times</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working hours schedule
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.workingHoursSchedule}
                        onChange={(e) => handleInputChange('workingHoursSchedule', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm">
                        Change schedule
                      </button>
                      <button className="px-3 py-2 bg-yellow-400 text-gray-900 rounded-lg text-sm">
                        + Create new
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employment rate (%)
                    </label>
                    <input
                      type="text"
                      value={formData.employmentRate}
                      onChange={(e) => handleInputChange('employmentRate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weekly working hours
                    </label>
                    <input
                      type="text"
                      value={formData.weeklyWorkingHours}
                      onChange={(e) => handleInputChange('weeklyWorkingHours', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daytime working hours
                    </label>
                    <input
                      type="text"
                      value={formData.daytimeWorkingHours}
                      onChange={(e) => handleInputChange('daytimeWorkingHours', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working days
                    </label>
                    <input
                      type="text"
                      value={formData.workingDays}
                      onChange={(e) => handleInputChange('workingDays', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Accounting */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Accounting</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gross salary account
                    </label>
                    <input
                      type="text"
                      value={formData.grossSalaryAccount}
                      onChange={(e) => handleInputChange('grossSalaryAccount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employer contribution account
                    </label>
                    <input
                      type="text"
                      value={formData.employerContributionAccount}
                      onChange={(e) => handleInputChange('employerContributionAccount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost center
                    </label>
                    <input
                      type="text"
                      value={formData.costCenter}
                      onChange={(e) => handleInputChange('costCenter', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project
                    </label>
                    <input
                      type="text"
                      value={formData.project}
                      onChange={(e) => handleInputChange('project', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Distribution template
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.distributionTemplate}
                        onChange={(e) => handleInputChange('distributionTemplate', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="px-3 py-2 bg-yellow-400 text-gray-900 rounded-lg text-sm">
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Staff categories
                      <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                    </label>
                    <div className="text-sm text-gray-500">
                      No staff categories selected
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Salary information Tab */}
          {activeTab === 'salary' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Salary information</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Salary information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary information</h3>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.monthlySalary}
                        onChange={(e) => handleInputChange('monthlySalary', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm">
                        Change salary
                      </button>
                    </div>
                  </div>

                  {/* Salary supplement */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      Salary supplement
                      <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                    </h3>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={formData.salarySupplement}
                        onChange={(e) => handleInputChange('salarySupplement', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm">
                        Change salary supplements
                      </button>
                    </div>
                  </div>

                  {/* Benefit car */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefit car</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Have a company car
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="haveCompanyCar"
                            value="yes"
                            checked={formData.haveCompanyCar === 'yes'}
                            onChange={(e) => handleInputChange('haveCompanyCar', e.target.value)}
                            className="mr-2"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="haveCompanyCar"
                            value="no"
                            checked={formData.haveCompanyCar === 'no'}
                            onChange={(e) => handleInputChange('haveCompanyCar', e.target.value)}
                            className="mr-2"
                          />
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Basis for waiting period in case of illness */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basis for waiting period in case of illness</h3>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Karen's illness
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="karensIllness"
                            value="yes"
                            checked={formData.karensIllness === 'yes'}
                            onChange={(e) => handleInputChange('karensIllness', e.target.value)}
                            className="mr-2"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="karensIllness"
                            value="no"
                            checked={formData.karensIllness === 'no'}
                            onChange={(e) => handleInputChange('karensIllness', e.target.value)}
                            className="mr-2"
                          />
                          No
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          Average hourly wage
                          <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                        </label>
                        <input
                          type="text"
                          value={formData.averageHourlyWage}
                          onChange={(e) => handleInputChange('averageHourlyWage', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          Average working hours / week
                          <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                        </label>
                        <input
                          type="text"
                          value={formData.averageWorkingHoursPerWeek}
                          onChange={(e) => handleInputChange('averageWorkingHoursPerWeek', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum qualifying deduction
                        </label>
                        <input
                          type="text"
                          value={formData.maximumQualifyingDeduction}
                          onChange={(e) => handleInputChange('maximumQualifyingDeduction', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal contract values and salary type table */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal contract values and salary type table</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OB addition simple
                      </label>
                      <input
                        type="text"
                        value={formData.obAdditionSimple}
                        onChange={(e) => handleInputChange('obAdditionSimple', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OB supplement qualified
                      </label>
                      <input
                        type="text"
                        value={formData.obSupplementQualified}
                        onChange={(e) => handleInputChange('obSupplementQualified', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OB supplement weekend
                      </label>
                      <input
                        type="text"
                        value={formData.obSupplementWeekend}
                        onChange={(e) => handleInputChange('obSupplementWeekend', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OB supplement 4
                      </label>
                      <input
                        type="text"
                        value={formData.obSupplement4}
                        onChange={(e) => handleInputChange('obSupplement4', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OB supplement 5
                      </label>
                      <input
                        type="text"
                        value={formData.obSupplement5}
                        onChange={(e) => handleInputChange('obSupplement5', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Union fee (%)
                      </label>
                      <input
                        type="text"
                        value={formData.unionFee}
                        onChange={(e) => handleInputChange('unionFee', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Travel time compensation
                      </label>
                      <input
                        type="text"
                        value={formData.travelTimeCompensation}
                        onChange={(e) => handleInputChange('travelTimeCompensation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salary type table
                      </label>
                      <select
                        value={formData.salaryTypeTable}
                        onChange={(e) => handleInputChange('salaryTypeTable', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="According to agreement">According to agreement</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Standard salary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Standard salary
                </h3>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SALARY TYPE</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NUMBER</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UNIT</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OUTLAY</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VAT</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TEXT LINE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {/* Pre-filled row 1 */}
                        <tr>
                          <td className="px-3 py-2 text-sm text-gray-900">12</td>
                          <td className="px-3 py-2 text-sm text-gray-900">Månadslön</td>
                          <td className="px-3 py-2 text-sm text-gray-900"></td>
                          <td className="px-3 py-2 text-sm text-gray-900">mån</td>
                          <td className="px-3 py-2 text-sm text-gray-900">0,00</td>
                          <td className="px-3 py-2 text-sm text-gray-900"></td>
                          <td className="px-3 py-2 text-sm text-gray-900"></td>
                          <td className="px-3 py-2 text-sm text-gray-900"></td>
                        </tr>
                        {/* Pre-filled row 2 */}
                        <tr>
                          <td className="px-3 py-2 text-sm text-gray-900">120</td>
                          <td className="px-3 py-2 text-sm text-gray-900">Månadslön, timmar</td>
                          <td className="px-3 py-2 text-sm text-gray-900"></td>
                          <td className="px-3 py-2 text-sm text-gray-900">tim</td>
                          <td className="px-3 py-2 text-sm text-gray-900">0,00</td>
                          <td className="px-3 py-2 text-sm text-gray-900"></td>
                          <td className="px-3 py-2 text-sm text-gray-900"></td>
                          <td className="px-3 py-2 text-sm text-gray-900"></td>
                        </tr>
                        {/* Input row */}
                        <tr>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              placeholder="Select salary ty"
                              value={formData.selectSalaryType}
                              onChange={(e) => handleInputChange('selectSalaryType', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={formData.standardSalaryName}
                              onChange={(e) => handleInputChange('standardSalaryName', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={formData.standardSalaryNumber}
                              onChange={(e) => handleInputChange('standardSalaryNumber', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={formData.standardSalaryUnit}
                              onChange={(e) => handleInputChange('standardSalaryUnit', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={formData.standardSalaryAmount}
                              onChange={(e) => handleInputChange('standardSalaryAmount', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={formData.standardSalaryOutlay}
                              onChange={(e) => handleInputChange('standardSalaryOutlay', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={formData.standardSalaryVat}
                              onChange={(e) => handleInputChange('standardSalaryVat', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={formData.standardSalaryTextLine}
                              onChange={(e) => handleInputChange('standardSalaryTextLine', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Holiday Tab */}
          {activeTab === 'holiday' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Holiday</h2>
              
              {/* Current holiday year */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current holiday year</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="holidayRule"
                          value="equal"
                          checked={formData.holidayRule === 'equal'}
                          onChange={(e) => handleInputChange('holidayRule', e.target.value)}
                          className="mr-2"
                        />
                        The equal pay rule
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="holidayRule"
                          value="percentage"
                          checked={formData.holidayRule === 'percentage'}
                          onChange={(e) => handleInputChange('holidayRule', e.target.value)}
                          className="mr-2"
                        />
                        The percentage rule
                        <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start day
                      </label>
                      <input
                        type="text"
                        value={formData.startDay}
                        onChange={(e) => handleInputChange('startDay', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        Estimated empty
                        <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.estimatedEmpty}
                          onChange={(e) => handleInputChange('estimatedEmpty', e.target.value)}
                          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Holiday entitlement */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  Holiday entitlement
                  <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                </h3>
                <div className="w-32">
                  <input
                    type="text"
                    value={formData.holidayEntitlement}
                    onChange={(e) => handleInputChange('holidayEntitlement', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Vacation days */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vacation days</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SALARY PER DAY</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NUMBER OF DAYS</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REGISTERED DAYS</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAID DAYS</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REMAINING DAYS</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMPLOYMENT RATE</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">Paid days</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.paidDaysSalaryPerDay}
                            onChange={(e) => handleInputChange('paidDaysSalaryPerDay', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.paidDaysNumberOfDays}
                            onChange={(e) => handleInputChange('paidDaysNumberOfDays', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.paidDaysRegisteredDays}
                            onChange={(e) => handleInputChange('paidDaysRegisteredDays', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.paidDaysPaidDays}
                            onChange={(e) => handleInputChange('paidDaysPaidDays', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.paidDaysRemainingDays}
                            onChange={(e) => handleInputChange('paidDaysRemainingDays', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.paidDaysEmploymentRate}
                            onChange={(e) => handleInputChange('paidDaysEmploymentRate', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">Days saved</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.daysSavedSalaryPerDay}
                            onChange={(e) => handleInputChange('daysSavedSalaryPerDay', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.daysSavedNumberOfDays}
                            onChange={(e) => handleInputChange('daysSavedNumberOfDays', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.daysSavedRegisteredDays}
                            onChange={(e) => handleInputChange('daysSavedRegisteredDays', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.daysSavedPaidDays}
                            onChange={(e) => handleInputChange('daysSavedPaidDays', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.daysSavedRemainingDays}
                            onChange={(e) => handleInputChange('daysSavedRemainingDays', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.daysSavedEmploymentRate}
                            onChange={(e) => handleInputChange('daysSavedEmploymentRate', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">Unpaid days</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.unpaidDaysSalaryPerDay}
                            onChange={(e) => handleInputChange('unpaidDaysSalaryPerDay', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.unpaidDaysNumberOfDays}
                            onChange={(e) => handleInputChange('unpaidDaysNumberOfDays', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.unpaidDaysRegisteredDays}
                            onChange={(e) => handleInputChange('unpaidDaysRegisteredDays', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.unpaidDaysPaidDays}
                            onChange={(e) => handleInputChange('unpaidDaysPaidDays', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.unpaidDaysRemainingDays}
                            onChange={(e) => handleInputChange('unpaidDaysRemainingDays', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">Advance days</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.advanceDaysSalaryPerDay}
                            onChange={(e) => handleInputChange('advanceDaysSalaryPerDay', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.advanceDaysNumberOfDays}
                            onChange={(e) => handleInputChange('advanceDaysNumberOfDays', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.advanceDaysRegisteredDays}
                            onChange={(e) => handleInputChange('advanceDaysRegisteredDays', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.advanceDaysPaidDays}
                            onChange={(e) => handleInputChange('advanceDaysPaidDays', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.advanceDaysRemainingDays}
                            onChange={(e) => handleInputChange('advanceDaysRemainingDays', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Vacation days saved per earning year */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Vacation days saved per earning year
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NUMBER OF DAYS</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REGISTERED DAYS</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAID DAYS</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMPLOYMENT RATE</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { label: 'Days saved - 1 year', year: '1' },
                        { label: 'Days saved - 2 years', year: '2' },
                        { label: 'Days saved - 3 years', year: '3' },
                        { label: 'Days saved - 4 years', year: '4' },
                        { label: 'Days saved - 5 years', year: '5' },
                        { label: 'Days saved - 6+ years', year: '6' }
                      ].map((item) => (
                        <tr key={item.year}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.label}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <input
                              type="text"
                              value={formData[`savedDays${item.year}Year` as keyof typeof formData] as string}
                              onChange={(e) => handleInputChange(`savedDays${item.year}Year`, e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <input
                              type="text"
                              value={formData[`savedDays${item.year}YearRegistered` as keyof typeof formData] as string}
                              onChange={(e) => handleInputChange(`savedDays${item.year}YearRegistered`, e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <input
                              type="text"
                              value={formData[`savedDays${item.year}YearPaid` as keyof typeof formData] as string}
                              onChange={(e) => handleInputChange(`savedDays${item.year}YearPaid`, e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <input
                              type="text"
                              value={formData[`savedDays${item.year}YearEmploymentRate` as keyof typeof formData] as string}
                              onChange={(e) => handleInputChange(`savedDays${item.year}YearEmploymentRate`, e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Absences that qualify for vacation during parental leave - Children's register */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Absences that qualify for vacation during parental leave - Children's register
                  <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CHILDREN</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GRANTED DAYS</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">INCOMING DAYS WITHDRAWN</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL DAYS WITHDRAWN</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.childrenCount}
                            onChange={(e) => handleInputChange('childrenCount', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.grantedDays}
                            onChange={(e) => handleInputChange('grantedDays', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.incomingDaysWithdrawn}
                            onChange={(e) => handleInputChange('incomingDaysWithdrawn', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="text"
                            value={formData.totalDaysWithdrawn}
                            onChange={(e) => handleInputChange('totalDaysWithdrawn', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total holiday pay */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Total holiday pay
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input
                      type="text"
                      value={formData.totalHolidayPayAmount}
                      onChange={(e) => handleInputChange('totalHolidayPayAmount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Paid out</label>
                    <input
                      type="text"
                      value={formData.totalHolidayPayPaidOut}
                      onChange={(e) => handleInputChange('totalHolidayPayPaidOut', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Left</label>
                    <input
                      type="text"
                      value={formData.totalHolidayPayLeft}
                      onChange={(e) => handleInputChange('totalHolidayPayLeft', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Variable add-on */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Variable add-on
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input
                      type="text"
                      value={formData.variableAddOnAmount}
                      onChange={(e) => handleInputChange('variableAddOnAmount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Paid out</label>
                    <input
                      type="text"
                      value={formData.variableAddOnPaidOut}
                      onChange={(e) => handleInputChange('variableAddOnPaidOut', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Left</label>
                    <input
                      type="text"
                      value={formData.variableAddOnLeft}
                      onChange={(e) => handleInputChange('variableAddOnLeft', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Advance vacation in kronor */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Advance vacation in kronor
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opening debt</label>
                    <input
                      type="text"
                      value={formData.advanceVacationOpeningDebt}
                      onChange={(e) => handleInputChange('advanceVacationOpeningDebt', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount paid out</label>
                    <input
                      type="text"
                      value={formData.advanceVacationAmountPaidOut}
                      onChange={(e) => handleInputChange('advanceVacationAmountPaidOut', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total debt</label>
                    <input
                      type="text"
                      value={formData.advanceVacationTotalDebt}
                      onChange={(e) => handleInputChange('advanceVacationTotalDebt', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Settings for vacation calculation */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Settings for vacation calculation
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Rule</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="holidayRule"
                          value="equal"
                          checked={formData.holidayRule === 'equal'}
                          onChange={(e) => handleInputChange('holidayRule', e.target.value)}
                          className="mr-2"
                        />
                        The equal pay rule
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="holidayRule"
                          value="percentage"
                          checked={formData.holidayRule === 'percentage'}
                          onChange={(e) => handleInputChange('holidayRule', e.target.value)}
                          className="mr-2"
                        />
                        The percentage rule
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Should be included in the vacation calculation</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="shouldBeIncludedInVacationCalculation"
                          value="yes"
                          checked={formData.shouldBeIncludedInVacationCalculation === 'yes'}
                          onChange={(e) => handleInputChange('shouldBeIncludedInVacationCalculation', e.target.value)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="shouldBeIncludedInVacationCalculation"
                          value="no"
                          checked={formData.shouldBeIncludedInVacationCalculation === 'no'}
                          onChange={(e) => handleInputChange('shouldBeIncludedInVacationCalculation', e.target.value)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Sole custody
                      <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="soleCustody"
                          value="yes"
                          checked={formData.soleCustody === 'yes'}
                          onChange={(e) => handleInputChange('soleCustody', e.target.value)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="soleCustody"
                          value="no"
                          checked={formData.soleCustody === 'no'}
                          onChange={(e) => handleInputChange('soleCustody', e.target.value)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Calculate only sum no days
                      <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="calculateOnlySumNoDays"
                          value="yes"
                          checked={formData.calculateOnlySumNoDays === 'yes'}
                          onChange={(e) => handleInputChange('calculateOnlySumNoDays', e.target.value)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="calculateOnlySumNoDays"
                          value="no"
                          checked={formData.calculateOnlySumNoDays === 'no'}
                          onChange={(e) => handleInputChange('calculateOnlySumNoDays', e.target.value)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ATF/ATK Tab */}
          {activeTab === 'atf' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">ATF/ATK</h2>
              
              {/* Working hours calculation */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Working hours calculation</h3>
                <div className="w-48">
                  <div className="relative">
                    <select
                      value={formData.workingHoursCalculation}
                      onChange={(e) => handleInputChange('workingHoursCalculation', e.target.value)}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reporting Tab */}
          {activeTab === 'reporting' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Reporting</h2>
              
              {/* The Swedish Tax Agency */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  The Swedish Tax Agency
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specification number for AGI
                      </label>
                      <input
                        type="text"
                        value={formData.specificationNumberForAGI}
                        onChange={(e) => handleInputChange('specificationNumberForAGI', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Workplace street address
                      </label>
                      <input
                        type="text"
                        value={formData.workplaceStreetAddress}
                        onChange={(e) => handleInputChange('workplaceStreetAddress', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="leaveBlank"
                        checked={formData.leaveBlank}
                        onChange={(e) => handleInputChange('leaveBlank', e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="leaveBlank" className="text-sm font-medium text-gray-700">
                        Leave blank
                      </label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Workplace number to AGI
                      </label>
                      <input
                        type="text"
                        value={formData.workplaceNumberToAGI}
                        onChange={(e) => handleInputChange('workplaceNumberToAGI', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Workplace location
                      </label>
                      <input
                        type="text"
                        value={formData.workplaceLocation}
                        onChange={(e) => handleInputChange('workplaceLocation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Collection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Collection
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Collectum - ITP
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="collectumITP"
                          value="yes"
                          checked={formData.collectumITP === 'yes'}
                          onChange={(e) => handleInputChange('collectumITP', e.target.value)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="collectumITP"
                          value="no"
                          checked={formData.collectumITP === 'no'}
                          onChange={(e) => handleInputChange('collectumITP', e.target.value)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deviant type
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deviantType"
                          value="yes"
                          checked={formData.deviantType === 'yes'}
                          onChange={(e) => handleInputChange('deviantType', e.target.value)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deviantType"
                          value="no"
                          checked={formData.deviantType === 'no'}
                          onChange={(e) => handleInputChange('deviantType', e.target.value)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forums */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Forums
                </h3>
                <div className="space-y-6">
                  {/* Monthly reporting */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Monthly reporting</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start date *
                          </label>
                          <input
                            type="text"
                            value={formData.monthlyReportingStartDate}
                            onChange={(e) => handleInputChange('monthlyReportingStartDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Markup *
                          </label>
                          <div className="flex space-x-2">
                            <select
                              value={formData.monthlyReportingMarkup}
                              onChange={(e) => handleInputChange('monthlyReportingMarkup', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Not drawn">Not drawn</option>
                              <option value="Drawn">Drawn</option>
                            </select>
                            <button className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm flex items-center space-x-1">
                              <RefreshCw className="w-4 h-4" />
                              <span>Change</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="asl65"
                            checked={formData.asl65}
                            onChange={(e) => handleInputChange('asl65', e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor="asl65" className="text-sm font-medium text-gray-700">
                            ASL65
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="kp65"
                            checked={formData.kp65}
                            onChange={(e) => handleInputChange('kp65', e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor="kp65" className="text-sm font-medium text-gray-700">
                            KP65
                          </label>
                        </div>
                      </div>
                      <div>
                        <a href="https://fora.se" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                          Read more at Fora.se
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Annual reporting */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Annual reporting</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Forum type
                        </label>
                        <select
                          value={formData.annualReportingForumType}
                          onChange={(e) => handleInputChange('annualReportingForumType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Not drawn">Not drawn</option>
                          <option value="Drawn">Drawn</option>
                        </select>
                      </div>
                      <div>
                        <a href="https://fora.se" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                          Read more at fora.se
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Statistics
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category salary survey
                      </label>
                      <input
                        type="text"
                        value={formData.categorySalarySurvey}
                        onChange={(e) => handleInputChange('categorySalarySurvey', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Workplace number
                      </label>
                      <input
                        type="text"
                        value={formData.workplaceNumber}
                        onChange={(e) => handleInputChange('workplaceNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weekend pay
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="weekendPay"
                            value="yes"
                            checked={formData.weekendPay === 'yes'}
                            onChange={(e) => handleInputChange('weekendPay', e.target.value)}
                            className="mr-2"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="weekendPay"
                            value="no"
                            checked={formData.weekendPay === 'no'}
                            onChange={(e) => handleInputChange('weekendPay', e.target.value)}
                            className="mr-2"
                          />
                          No
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Working time type
                      </label>
                      <select
                        value={formData.workingTimeType}
                        onChange={(e) => handleInputChange('workingTimeType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select...</option>
                        <option value="Full time">Full time</option>
                        <option value="Part time">Part time</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* SCB Wage Structure Statistics (SLP) */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  SCB Wage Structure Statistics (SLP)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Include
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="scbWageStructureInclude"
                          value="yes"
                          checked={formData.scbWageStructureInclude === 'yes'}
                          onChange={(e) => handleInputChange('scbWageStructureInclude', e.target.value)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="scbWageStructureInclude"
                          value="no"
                          checked={formData.scbWageStructureInclude === 'no'}
                          onChange={(e) => handleInputChange('scbWageStructureInclude', e.target.value)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Code (SSYK 2012)
                    </label>
                    <input
                      type="text"
                      value={formData.professionalCodeSSYK2012}
                      onChange={(e) => handleInputChange('professionalCodeSSYK2012', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* SN Salary Statistics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  SN Salary Statistics
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Include
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="snSalaryStatisticsInclude"
                          value="yes"
                          checked={formData.snSalaryStatisticsInclude === 'yes'}
                          onChange={(e) => handleInputChange('snSalaryStatisticsInclude', e.target.value)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="snSalaryStatisticsInclude"
                          value="no"
                          checked={formData.snSalaryStatisticsInclude === 'no'}
                          onChange={(e) => handleInputChange('snSalaryStatisticsInclude', e.target.value)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Code (NYK 14)
                      </label>
                      <input
                        type="text"
                        value={formData.professionalCodeNYK14}
                        onChange={(e) => handleInputChange('professionalCodeNYK14', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Federal civil servant number
                      </label>
                      <input
                        type="text"
                        value={formData.federalCivilServantNumber}
                        onChange={(e) => handleInputChange('federalCivilServantNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Workplace number
                      </label>
                      <input
                        type="text"
                        value={formData.workplaceNumberSN}
                        onChange={(e) => handleInputChange('workplaceNumberSN', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contract code civil servant
                      </label>
                      <input
                        type="text"
                        value={formData.contractCodeCivilServant}
                        onChange={(e) => handleInputChange('contractCodeCivilServant', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job status
                      </label>
                      <div className="relative">
                        <select
                          value={formData.jobStatus}
                          onChange={(e) => handleInputChange('jobStatus', e.target.value)}
                          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                          <option value="Other employees">Other employees</option>
                          <option value="Civil servants">Civil servants</option>
                          <option value="Managers">Managers</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hourly wage to be reported in field 13
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="hourlyWageToBeReportedInField13"
                            value="yes"
                            checked={formData.hourlyWageToBeReportedInField13 === 'yes'}
                            onChange={(e) => handleInputChange('hourlyWageToBeReportedInField13', e.target.value)}
                            className="mr-2"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="hourlyWageToBeReportedInField13"
                            value="no"
                            checked={formData.hourlyWageToBeReportedInField13 === 'no'}
                            onChange={(e) => handleInputChange('hourlyWageToBeReportedInField13', e.target.value)}
                            className="mr-2"
                          />
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SCB Economic statistics (KLP) */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  SCB Economic statistics (KLP)
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Include (KLP)
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="scbEconomicStatisticsInclude"
                        value="yes"
                        checked={formData.scbEconomicStatisticsInclude === 'yes'}
                        onChange={(e) => handleInputChange('scbEconomicStatisticsInclude', e.target.value)}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="scbEconomicStatisticsInclude"
                        value="no"
                        checked={formData.scbEconomicStatisticsInclude === 'no'}
                        onChange={(e) => handleInputChange('scbEconomicStatisticsInclude', e.target.value)}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>

              {/* Statistics Sweden Business cycle statistics on sick pay (KSJU) */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Statistics Sweden Business cycle statistics on sick pay (KSJU)
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Include (KSJU)
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="statisticsSwedenBusinessCycleInclude"
                        value="yes"
                        checked={formData.statisticsSwedenBusinessCycleInclude === 'yes'}
                        onChange={(e) => handleInputChange('statisticsSwedenBusinessCycleInclude', e.target.value)}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="statisticsSwedenBusinessCycleInclude"
                        value="no"
                        checked={formData.statisticsSwedenBusinessCycleInclude === 'no'}
                        onChange={(e) => handleInputChange('statisticsSwedenBusinessCycleInclude', e.target.value)}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>

              {/* SCB Sickness absence during the pay period (SUS) */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  SCB Sickness absence during the pay period (SUS)
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Include (SUS)
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="scbSicknessAbsenceInclude"
                        value="yes"
                        checked={formData.scbSicknessAbsenceInclude === 'yes'}
                        onChange={(e) => handleInputChange('scbSicknessAbsenceInclude', e.target.value)}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="scbSicknessAbsenceInclude"
                        value="no"
                        checked={formData.scbSicknessAbsenceInclude === 'no'}
                        onChange={(e) => handleInputChange('scbSicknessAbsenceInclude', e.target.value)}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Opening Balance Tab */}
          {activeTab === 'opening' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Opening Balance</h2>
              
              {/* Top Section - Incoming Flextime and Comp Time */}
              <div className="space-y-6">
                {/* Incoming Flextime */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Incoming flextime</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Incoming
                      </label>
                      <input
                        type="text"
                        value={formData.incomingFlextime}
                        onChange={(e) => handleInputChange('incomingFlextime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        This year's change
                      </label>
                      <input
                        type="text"
                        value={formData.incomingFlextimeThisYearChange}
                        onChange={(e) => handleInputChange('incomingFlextimeThisYearChange', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current balance
                      </label>
                      <input
                        type="text"
                        value={formData.incomingFlextimeCurrentBalance}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Incoming Comp Time */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Incoming comp time</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Incoming
                      </label>
                      <input
                        type="text"
                        value={formData.incomingCompTime}
                        onChange={(e) => handleInputChange('incomingCompTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        This year's change
                      </label>
                      <input
                        type="text"
                        value={formData.incomingCompTimeThisYearChange}
                        onChange={(e) => handleInputChange('incomingCompTimeThisYearChange', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current balance
                      </label>
                      <input
                        type="text"
                        value={formData.incomingCompTimeCurrentBalance}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Initial Holiday Values - Basis for Calculation */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Initial holiday values - Basis for calculation
                </h3>
                <div className="mb-4">
                  <a href="#" className="text-blue-600 hover:underline text-sm">
                    Explanations and calculations
                  </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Holiday Entitlement Salary */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Holiday entitlement salary</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            Total salary
                            <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                          </label>
                          <input
                            type="text"
                            value={formData.totalSalary}
                            onChange={(e) => handleInputChange('totalSalary', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            Of which salary variable allowance
                            <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                          </label>
                          <input
                            type="text"
                            value={formData.salaryVariableAllowance}
                            onChange={(e) => handleInputChange('salaryVariableAllowance', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            Salary for time worked
                            <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                          </label>
                          <input
                            type="text"
                            value={formData.salaryForTimeWorked}
                            onChange={(e) => handleInputChange('salaryForTimeWorked', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Average Wages Per Day */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Average wages per day</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            Estimated average salary per day
                            <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                          </label>
                          <input
                            type="text"
                            value={formData.estimatedAverageSalaryPerDay}
                            onChange={(e) => handleInputChange('estimatedAverageSalaryPerDay', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            Estimated variable per day
                            <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                          </label>
                          <input
                            type="text"
                            value={formData.estimatedVariablePerDay}
                            onChange={(e) => handleInputChange('estimatedVariablePerDay', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column */}
                  <div className="space-y-6">
                    {/* Holiday-based Attendance */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Holiday-based attendance</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Attendance time in days
                          </label>
                          <input
                            type="text"
                            value={formData.attendanceTimeInDays}
                            onChange={(e) => handleInputChange('attendanceTimeInDays', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Attendance time in hours
                          </label>
                          <input
                            type="text"
                            value={formData.attendanceTimeInHours}
                            onChange={(e) => handleInputChange('attendanceTimeInHours', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Average Hourly Wage */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Average hourly wage</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            Estimated average hourly wage
                            <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                          </label>
                          <input
                            type="text"
                            value={formData.estimatedAverageHourlyWage}
                            onChange={(e) => handleInputChange('estimatedAverageHourlyWage', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            Estimated hourly rate
                            <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                          </label>
                          <input
                            type="text"
                            value={formData.estimatedHourlyRate}
                            onChange={(e) => handleInputChange('estimatedHourlyRate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Absence Working Days */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Absence working days</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Holiday pay establishment
                          </label>
                          <input
                            type="text"
                            value={formData.holidayPayEstablishmentDays}
                            onChange={(e) => handleInputChange('holidayPayEstablishmentDays', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Not eligible for holiday pay
                          </label>
                          <input
                            type="text"
                            value={formData.notEligibleForHolidayPayDays}
                            onChange={(e) => handleInputChange('notEligibleForHolidayPayDays', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Absence in Hours */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Absence in hours</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Holiday pay establishment
                          </label>
                          <input
                            type="text"
                            value={formData.holidayPayEstablishmentHours}
                            onChange={(e) => handleInputChange('holidayPayEstablishmentHours', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Not eligible for holiday pay
                          </label>
                          <input
                            type="text"
                            value={formData.notEligibleForHolidayPayHours}
                            onChange={(e) => handleInputChange('notEligibleForHolidayPayHours', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Non-Holiday Calendar Days */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Non-holiday calendar days</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Whole days that affect the number of vacation days
                          </label>
                          <input
                            type="text"
                            value={formData.wholeDaysAffectVacationDays}
                            onChange={(e) => handleInputChange('wholeDaysAffectVacationDays', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Part of the day that affects the employment rate
                          </label>
                          <input
                            type="text"
                            value={formData.partOfDayAffectsEmploymentRate}
                            onChange={(e) => handleInputChange('partOfDayAffectsEmploymentRate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Holiday-Starting Calendar Days */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Holiday-starting calendar days</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Whole days that do not affect the number of vacation days
                        </label>
                        <input
                          type="text"
                          value={formData.wholeDaysDoNotAffectVacationDays}
                          onChange={(e) => handleInputChange('wholeDaysDoNotAffectVacationDays', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Starting Salary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Starting salary
                </h3>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SALARY TYPE</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NUMBER</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UNIT</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OUTLAY</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VAT</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TEXT LINE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td colSpan={8} className="px-3 py-8 text-center text-gray-500">
                            No salary entries
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Deducted preliminary tax
                    <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                  </label>
                  <input
                    type="text"
                    value={formData.deductedPreliminaryTax}
                    onChange={(e) => handleInputChange('deductedPreliminaryTax', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Other tabs content would go here */}
          {!['personnel', 'tax', 'employment', 'salary', 'holiday', 'atf', 'reporting', 'opening'].includes(activeTab) && (
            <div className="text-center py-8 text-gray-500">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tab content will be implemented here.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg text-sm font-medium flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Delete</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployeeModal;
