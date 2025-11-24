import React, { useEffect, useState } from 'react';
import { Calendar, CheckSquare, AlertTriangle } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { sieService } from '../services/sieService';

interface VerificationSeries {
  id: string;
  name: string;
  from: number;
  to: number;
  isChecked: boolean;
}

const mockVerificationSeries: VerificationSeries[] = [
  { id: 'header', name: 'VERIFIKATIONSSERIER', from: 0, to: 0, isChecked: true },
  { id: 'A', name: 'A - Redovisning', from: 1, to: 10, isChecked: true },
  { id: 'B', name: 'B - Kundfakturor', from: 0, to: 0, isChecked: false },
  { id: 'C', name: 'C - Inbetalningar från kunder', from: 1, to: 2, isChecked: true },
  { id: 'D', name: 'D - Leverantörsfakturor', from: 0, to: 0, isChecked: false },
  { id: 'E', name: 'E - Utbetalningar till leverantörer', from: 0, to: 0, isChecked: false },
  { id: 'F', name: 'F - Kassa', from: 1, to: 7, isChecked: true },
  { id: 'G', name: 'G - Avskrivning', from: 1, to: 4, isChecked: true },
  { id: 'H', name: 'H - Periodisering', from: 0, to: 0, isChecked: false },
  { id: 'I', name: 'I - Bokslut', from: 0, to: 0, isChecked: false },
  { id: 'J', name: 'J - Kontantfaktura', from: 0, to: 0, isChecked: false },
  { id: 'K', name: 'K - Kvitto', from: 1, to: 1, isChecked: true },
  { id: 'L', name: 'L - Lön', from: 0, to: 0, isChecked: false },
  { id: 'M', name: 'M - Momsrapport', from: 0, to: 0, isChecked: false },
  { id: 'N', name: 'N - Lager', from: 0, to: 0, isChecked: false },
  { id: 'O', name: 'O - omer', from: 0, to: 0, isChecked: false },
  { id: 'X', name: 'X - test', from: 0, to: 0, isChecked: false },
  { id: 'Y', name: 'Y - test123', from: 0, to: 0, isChecked: false },
  { id: 'Z', name: 'Z - abc122', from: 0, to: 0, isChecked: false }
];

export const SIEExportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('File-export');
  const [sieType, setSieType] = useState('4');
  const [scopeFrom, setScopeFrom] = useState('2025-01-01');
  const [scopeTo, setScopeTo] = useState('2025-12-31');
  const [accountScope, setAccountScope] = useState('all');
  const [verificationSeries, setVerificationSeries] = useState(mockVerificationSeries);
  const [exports, setExports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await sieService.getExports();
        setExports(data);
      } catch (e) {
        console.error('Failed to load SIE exports', e);
        setError('Failed to load SIE exports');
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  
  // File export state
  const [fileExportType, setFileExportType] = useState('period');
  const [fromYear, setFromYear] = useState('2025');
  const [fromMonth, setFromMonth] = useState('January');
  const [toYear, setToYear] = useState('2025');
  const [toMonth, setToMonth] = useState('December');

  const handleSeriesToggle = (id: string) => {
    setVerificationSeries(prev => 
      prev.map(series => 
        series.id === id 
          ? { ...series, isChecked: !series.isChecked }
          : series
      )
    );
  };

  const handleReset = () => {
    setVerificationSeries(prev => 
      prev.map(series => ({ ...series, isChecked: false }))
    );
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);
      await sieService.createExport({
        file_name: `SIE_${scopeFrom}_${scopeTo}.sie`,
        accounting_period_start: scopeFrom,
        accounting_period_end: scopeTo
      } as any, '');
      const data = await sieService.getExports();
      setExports(data);
      setActiveTab('SIE-export');
    } catch (e) {
      console.error('Failed to create SIE export', e);
      setError('Failed to create SIE export');
    } finally {
      setLoading(false);
    }
  };

  const handleFileExport = () => {
    console.log('Starting file export:', {
      fileExportType,
      fromYear,
      fromMonth,
      toYear,
      toMonth
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('SIE-export')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'SIE-export'
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  SIE-export
                </button>
                <button
                  onClick={() => setActiveTab('Filexport')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'Filexport'
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Filexport
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Rapporter</span>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-600">Register</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'SIE-export' ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-8">EXPORT - SIE</h1>

          {/* SIE Type Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SIE Type</h2>
            <div className="flex space-x-1">
              {[
                { value: '1', label: '1 - Closing balances' },
                { value: '2', label: '2 - Period balances' },
                { value: '3', label: '3 - Object balances' },
                { value: '4', label: '4 - Transactions' }
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSieType(type.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    sieType === type.value
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scope from */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Scope from</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={scopeFrom}
                    onChange={(e) => setScopeFrom(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="secondary" size="sm">
                    <Calendar className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={scopeTo}
                    onChange={(e) => setScopeTo(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="secondary" size="sm">
                    <Calendar className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Accounts, cost centers and projects */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Accounts, cost centers and projects</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setAccountScope('all')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  accountScope === 'all'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setAccountScope('used')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  accountScope === 'used'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Only used
              </button>
            </div>
          </div>

          {/* Select series */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Select series</h2>
              <Button
                variant="secondary"
                onClick={handleReset}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Reset
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 w-12"></th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">VERIFIKATIONSSERIER</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">FROM</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">TOM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {verificationSeries.map((series) => (
                    <tr key={series.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <CheckSquare 
                          className={`w-4 h-4 cursor-pointer ${
                            series.isChecked ? 'text-blue-600' : 'text-gray-400'
                          }`}
                          onClick={() => handleSeriesToggle(series.id)}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {series.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {series.from}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {series.to}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleExport}
              className="bg-green-600 text-white hover:bg-green-700 px-8 py-3 text-lg font-medium"
            >
              Export
            </Button>
          </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-8">EXPORT ALL YOUR FILES</h1>

              {/* Instructions */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <p className="text-gray-700 mb-6">
                  Here you can export all your files in your subscription including those in your storage to a zip file.
                </p>
                
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Here's how it works:</h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Select which files you want to export.</li>
                  <li>Start the export below.</li>
                  <li>Follow the progress of the export on this page.</li>
                  <li>When the export is complete, you will receive a notification on your watch and you will be able to download the file here.</li>
                </ol>
              </div>

              {/* File Selection Options */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Which files do you want to export?</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="fileExportType"
                      value="all"
                      checked={fileExportType === 'all'}
                      onChange={(e) => setFileExportType(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">All files and folders</span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="fileExportType"
                      value="period"
                      checked={fileExportType === 'period'}
                      onChange={(e) => setFileExportType(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">Linked files within period</span>
                  </label>
                </div>

                {/* Date Range Selectors */}
                {fileExportType === 'period' && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">From</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={fromYear}
                          onChange={(e) => setFromYear(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="2023">2023</option>
                          <option value="2024">2024</option>
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                        </select>
                        <select
                          value={fromMonth}
                          onChange={(e) => setFromMonth(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="January">January</option>
                          <option value="February">February</option>
                          <option value="March">March</option>
                          <option value="April">April</option>
                          <option value="May">May</option>
                          <option value="June">June</option>
                          <option value="July">July</option>
                          <option value="August">August</option>
                          <option value="September">September</option>
                          <option value="October">October</option>
                          <option value="November">November</option>
                          <option value="December">December</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">To</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={toYear}
                          onChange={(e) => setToYear(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="2023">2023</option>
                          <option value="2024">2024</option>
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                        </select>
                        <select
                          value={toMonth}
                          onChange={(e) => setToMonth(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="January">January</option>
                          <option value="February">February</option>
                          <option value="March">March</option>
                          <option value="April">April</option>
                          <option value="May">May</option>
                          <option value="June">June</option>
                          <option value="July">July</option>
                          <option value="August">August</option>
                          <option value="September">September</option>
                          <option value="October">October</option>
                          <option value="November">November</option>
                          <option value="December">December</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Warning Message */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <p className="text-yellow-800">
                    If you have thousands of files in the system, it can take up to several hours to export.
                  </p>
                </div>
              </div>

              {/* Start Export Button */}
              <div className="flex justify-start">
                <Button
                  onClick={handleFileExport}
                  className="bg-green-600 text-white hover:bg-green-700 px-8 py-3 text-lg font-medium"
                >
                  Start new export
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
