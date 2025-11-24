import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  RotateCcw, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Upload,
  X
} from 'lucide-react';
import { assetsService } from '../services/assetsService';

interface AssetData {
  assetNumber: string;
  name: string;
  assetType: string;
  linkedToAssetGroup: string;
  acquisitionValue: string;
  estimatedResidualValue: string;
  acquisitionDate: string;
  depreciationStart: string;
  usefulLifeYears: string;
  usefulLifeMonths: string;
  depreciationMethod: string;
  image?: File | null;
  // More information fields
  idNumber: string;
  manufacturerBrand: string;
  insuredWith: string;
  insuranceNumber: string;
  group: string;
  room: string;
  investment: string;
  section: string;
  notes: string;
}

interface DepreciationEntry {
  period: string;
  amount: number;
  percentage: number;
  remainingValue: number;
}

export const AssetFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [activeTab, setActiveTab] = useState<'basic' | 'more'>('basic');
  const [depreciationView, setDepreciationView] = useState<'year' | 'month'>('year');
  const [formData, setFormData] = useState<AssetData>({
    assetNumber: '1',
    name: '',
    assetType: '',
    linkedToAssetGroup: '',
    acquisitionValue: '',
    estimatedResidualValue: '',
    acquisitionDate: '',
    depreciationStart: '',
    usefulLifeYears: '',
    usefulLifeMonths: '',
    depreciationMethod: 'Straight',
    image: null,
    // More information fields
    idNumber: '',
    manufacturerBrand: '',
    insuredWith: '',
    insuranceNumber: '',
    group: '',
    room: '',
    investment: '',
    section: '',
    notes: ''
  });

  const [yearlyDepreciationSchedule, setYearlyDepreciationSchedule] = useState<DepreciationEntry[]>([]);
  const [monthlyDepreciationSchedule, setMonthlyDepreciationSchedule] = useState<DepreciationEntry[]>([]);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isFormSaved, setIsFormSaved] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      // Load existing asset data
      // This would typically fetch from an API
      console.log('Loading asset with ID:', id);
    }
  }, [isEditing, id]);

  const handleInputChange = (field: keyof AssetData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const calculateDepreciation = () => {
    const acquisitionValue = parseFloat(formData.acquisitionValue.replace(',', '.')) || 0;
    const residualValue = parseFloat(formData.estimatedResidualValue.replace(',', '.')) || 0;
    const years = parseInt(formData.usefulLifeYears) || 0;
    const months = parseInt(formData.usefulLifeMonths) || 0;
    const totalMonths = years * 12 + months;
    
    if (totalMonths === 0) return { yearly: [], monthly: [] };
    
    const depreciableAmount = acquisitionValue - residualValue;
    
    // For Irregular method, we'll use a different calculation approach
    // For now, we'll use the same calculation but this can be customized
    const monthlyDepreciation = formData.depreciationMethod === 'Irregular' 
      ? depreciableAmount / (totalMonths * 1.5) // Example: slower depreciation for irregular
      : depreciableAmount / totalMonths;
    
    // Calculate monthly schedule
    const monthlySchedule: DepreciationEntry[] = [];
    let remainingValue = acquisitionValue;
    let currentDate = new Date(formData.depreciationStart);
    
    for (let i = 0; i < totalMonths; i++) {
      const periodStart = new Date(currentDate);
      const periodEnd = new Date(currentDate);
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      periodEnd.setDate(0); // Last day of the month
      
      const depreciationAmount = Math.min(monthlyDepreciation, remainingValue - residualValue);
      const percentage = (depreciationAmount / acquisitionValue) * 100;
      
      remainingValue = Math.max(remainingValue - depreciationAmount, residualValue);
      
      monthlySchedule.push({
        period: `${periodStart.toISOString().split('T')[0]} - ${periodEnd.toISOString().split('T')[0]}`,
        amount: parseFloat(depreciationAmount.toFixed(2)),
        percentage: parseFloat(percentage.toFixed(2)),
        remainingValue: parseFloat(remainingValue.toFixed(2))
      });
      
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    // Calculate yearly schedule
    const yearlySchedule: DepreciationEntry[] = [];
    remainingValue = acquisitionValue;
    currentDate = new Date(formData.depreciationStart);
    
    const totalYears = Math.ceil(totalMonths / 12);
    
    for (let i = 0; i < totalYears; i++) {
      const periodStart = new Date(currentDate);
      const periodEnd = new Date(currentDate);
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      periodEnd.setDate(0); // Last day of the year
      
      // Calculate depreciation for this year (might be partial year)
      const monthsInThisYear = Math.min(12, totalMonths - (i * 12));
      const yearlyDepreciationAmount = Math.min(monthlyDepreciation * monthsInThisYear, remainingValue - residualValue);
      const percentage = (yearlyDepreciationAmount / acquisitionValue) * 100;
      
      remainingValue = Math.max(remainingValue - yearlyDepreciationAmount, residualValue);
      
      yearlySchedule.push({
        period: `${periodStart.toISOString().split('T')[0]} - ${periodEnd.toISOString().split('T')[0]}`,
        amount: parseFloat(yearlyDepreciationAmount.toFixed(2)),
        percentage: parseFloat(percentage.toFixed(2)),
        remainingValue: parseFloat(remainingValue.toFixed(2))
      });
      
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    }
    
    return { yearly: yearlySchedule, monthly: monthlySchedule };
  };

  const handleSave = () => {
    console.log('Saving asset:', formData);
    
    // Calculate depreciation schedules
    const schedules = calculateDepreciation();
    setYearlyDepreciationSchedule(schedules.yearly);
    setMonthlyDepreciationSchedule(schedules.monthly);
    
    // Mark form as saved
    setIsFormSaved(true);
    
    // Here you would typically save to backend
    // navigate('/facility-register');
  };

  const handleCancel = () => {
    navigate('/facility-register');
  };

  const handleRefreshAssetNumber = () => {
    const newNumber = (parseInt(formData.assetNumber) + 1).toString();
    handleInputChange('assetNumber', newNumber);
  };

  // Get current schedule based on view
  const currentSchedule = depreciationView === 'year' ? yearlyDepreciationSchedule : monthlyDepreciationSchedule;
  
  // Calculate totals for depreciation schedule
  const totalAmount = currentSchedule.reduce((sum, entry) => sum + entry.amount, 0);
  const totalPercentage = currentSchedule.reduce((sum, entry) => sum + entry.percentage, 0);
  
  // Calculate dynamic values
  const acquisitionValue = parseFloat(formData.acquisitionValue.replace(',', '.')) || 0;
  const residualValue = parseFloat(formData.estimatedResidualValue.replace(',', '.')) || 0;
  const depreciableAmount = acquisitionValue - residualValue;
  const bookValue = acquisitionValue;
  const depreciationBasis = acquisitionValue;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 uppercase">
          {isEditing ? 'EDIT ASSET' : 'NEW ASSET'}
        </h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigate('/facility-register')}
            className="bg-yellow-400 text-gray-800 px-3 py-1 rounded flex items-center space-x-1 text-sm hover:bg-yellow-500"
          >
            <span>☰</span>
            <span>Show List</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'basic'
                  ? 'border-gray-900 text-gray-900 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Basic information
            </button>
            <button
              onClick={() => setActiveTab('more')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'more'
                  ? 'border-gray-900 text-gray-900 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              More information
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
        {activeTab === 'basic' && (
          <div className="space-y-8">
            {/* Asset Details Section */}
            <div className="grid grid-cols-3 gap-8">
              {/* Left Column - Asset Identification */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset number
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={formData.assetNumber}
                      onChange={(e) => handleInputChange('assetNumber', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={handleRefreshAssetNumber}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset type
                  </label>
                  <input
                    type="text"
                    value={formData.assetType}
                    onChange={(e) => handleInputChange('assetType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Linked to asset group <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.linkedToAssetGroup}
                    onChange={(e) => handleInputChange('linkedToAssetGroup', e.target.value)}
                    placeholder="Asset group"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset Image (Optional)
                  </label>
                  <div className="space-y-2">
                    {!imagePreview ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center space-y-2"
                        >
                          <Upload className="w-8 h-8 text-gray-400" />
                          <span className="text-sm text-gray-500">Click to upload image</span>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Asset preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Middle Column - Acquisition and Depreciation Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Acquisition value
                  </label>
                  <input
                    type="text"
                    value={formData.acquisitionValue}
                    onChange={(e) => handleInputChange('acquisitionValue', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated residual value
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedResidualValue}
                    onChange={(e) => handleInputChange('estimatedResidualValue', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Acquisition date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.acquisitionDate}
                      onChange={(e) => handleInputChange('acquisitionDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Depreciation start
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.depreciationStart}
                      onChange={(e) => handleInputChange('depreciationStart', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Useful life
                  </label>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.usefulLifeYears}
                        onChange={(e) => handleInputChange('usefulLifeYears', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <span className="text-xs text-gray-500">Year</span>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.usefulLifeMonths}
                        onChange={(e) => handleInputChange('usefulLifeMonths', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <span className="text-xs text-gray-500">Months</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Depreciation method
                  </label>
                  <select
                    value={formData.depreciationMethod}
                    onChange={(e) => handleInputChange('depreciationMethod', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Straight">Straight</option>
                    <option value="Irregular">Irregular</option>
                  </select>
                </div>
              </div>

              {/* Right Column - Calculated Depreciation Values */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Depreciable amount
                  </label>
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                    {depreciableAmount.toFixed(2).replace('.', ',')}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Depreciated empty
                  </label>
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                    {isFormSaved ? 'empty' : ''}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Depreciation for the year
                  </label>
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                    {isFormSaved ? totalAmount.toFixed(2).replace('.', ',') : '0,00'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Depreciation basis
                  </label>
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                    {depreciationBasis.toFixed(2).replace('.', ',')}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Completely written off
                  </label>
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                    {isFormSaved && currentSchedule.length > 0 ? 
                      currentSchedule[currentSchedule.length - 1].period.split(' - ')[1] : 
                      '-'
                    }
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Book value
                  </label>
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                    {bookValue.toFixed(2).replace('.', ',')}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IB accumulated depreciation
                  </label>
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                    {isFormSaved ? '0,00' : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Depreciation Schedule Section - Only show after save */}
            {isFormSaved && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Depreciation schedule</h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setDepreciationView('year')}
                    className={`px-3 py-1 text-sm rounded ${
                      depreciationView === 'year'
                        ? 'bg-white border border-gray-300 text-gray-900'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Show year
                  </button>
                  <button
                    onClick={() => setDepreciationView('month')}
                    className={`px-3 py-1 text-sm rounded ${
                      depreciationView === 'month'
                        ? 'bg-white border border-gray-300 text-gray-900'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Show months
                  </button>
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-end mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{currentSchedule.length} of {currentSchedule.length}</span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-6 h-6 bg-green-500 text-white text-xs flex items-center justify-center rounded">
                    1
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Depreciation Schedule Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DEPRECIATION PERIOD
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DEPRECIATION AMOUNT (SEK)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DEPRECIATION %
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        REMAINING VALUE (SEK)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentSchedule.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.period}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.percentage.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.remainingValue.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    {/* Summary Row */}
                    <tr className="bg-gray-50 font-medium">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Amount
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {totalPercentage.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        0.00
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </div>
        )}

        {activeTab === 'more' && (
          <div className="space-y-6">
            {/* More Information Form */}
            <div className="grid grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID number
                  </label>
                  <input
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange('idNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manufacturer/Brand
                  </label>
                  <input
                    type="text"
                    value={formData.manufacturerBrand}
                    onChange={(e) => handleInputChange('manufacturerBrand', e.target.value)}
                    placeholder="Manufacturer/Brand"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Insured with
                  </label>
                  <input
                    type="text"
                    value={formData.insuredWith}
                    onChange={(e) => handleInputChange('insuredWith', e.target.value)}
                    placeholder="Insured with"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Insurance number
                  </label>
                  <input
                    type="text"
                    value={formData.insuranceNumber}
                    onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Middle Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group
                  </label>
                  <input
                    type="text"
                    value={formData.group}
                    onChange={(e) => handleInputChange('group', e.target.value)}
                    placeholder="Group"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room
                  </label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => handleInputChange('room', e.target.value)}
                    placeholder="Room"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Investment
                  </label>
                  <input
                    type="text"
                    value={formData.investment}
                    onChange={(e) => handleInputChange('investment', e.target.value)}
                    placeholder="Investment"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section
                  </label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => handleInputChange('section', e.target.value)}
                    placeholder="Section"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Right Column - Notes */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    placeholder="Enter additional notes or comments..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
