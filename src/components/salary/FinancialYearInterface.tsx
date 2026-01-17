// import React, { useEffect, useState } from 'react';
// // import { CreateFinancialYearModal } from './CreateFinancialYearModal';

// interface FinancialYearEntry {
//   id: string;
//   fromDate: string;
//   toDate: string;
//   accountingMethod: 'Billing method' | 'The cash method';
//   accountChart: string;
//   isPreselected: boolean;
//   openAtLogin: boolean;
// }

// interface FinancialYearInterfaceProps {
//   data?: {
//     createFiscalYearsAutomatically: boolean;
//     years: FinancialYearEntry[];
//   };
//   onChange?: (data: { createFiscalYearsAutomatically: boolean; years: FinancialYearEntry[] }) => void;
//   onSave?: (data: { createFiscalYearsAutomatically: boolean; years: FinancialYearEntry[] }) => void;
//   saving?: boolean;
//   loading?: boolean;
//   error?: string | null;
//   success?: string | null;
// }

// export const FinancialYearInterface: React.FC<FinancialYearInterfaceProps> = ({
//   data,
//   onChange,
//   onSave,
//   saving = false,
//   loading = false,
//   error,
//   success
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingYearId, setEditingYearId] = useState<string | null>(null);
//   const [initialModalData, setInitialModalData] = useState<any | null>(null);
//   const [createAutomatically, setCreateAutomatically] = useState<boolean>(
//     data?.createFiscalYearsAutomatically ?? true
//   );
//   const [financialYears, setFinancialYears] = useState<FinancialYearEntry[]>(
//     data?.years ?? [
//     {
//       id: '1',
//         fromDate: '2026-01-01',
//         toDate: '2026-12-31',
//       accountingMethod: 'Billing method',
//       accountChart: '"Base 2024"',
//         isPreselected: false,
//         openAtLogin: false
//     },
//     {
//       id: '2',
//         fromDate: '2025-01-01',
//         toDate: '2025-12-31',
//       accountingMethod: 'Billing method',
//       accountChart: '"Base 2024"',
//         isPreselected: true,
//         openAtLogin: false
//     }
//     ]
//   );

//   useEffect(() => {
//     if (data) {
//       setCreateAutomatically(data.createFiscalYearsAutomatically ?? false);
//       setFinancialYears(
//         Array.isArray(data.years)
//           ? data.years.map((year, index) => ({
//               ...year,
//               id: typeof year.id === 'string' && year.id.length > 0 ? year.id : `${Date.now()}-${index}`
//             }))
//           : []
//       );
//     }
//   }, [data?.createFiscalYearsAutomatically, data?.years]);

//   const notifyChange = (nextYears: FinancialYearEntry[], nextAuto = createAutomatically) => {
//     onChange?.({
//       createFiscalYearsAutomatically: nextAuto,
//       years: nextYears
//     });
//   };

//   const handleSave = () => {
//     if (onSave) {
//       onSave({
//         createFiscalYearsAutomatically: createAutomatically,
//         years: financialYears
//       });
//     } else {
//     console.log('Saving financial year settings:', { createAutomatically, financialYears });
//     }
//   };

//   const handleSaveNewFinancialYear = (data: any) => {
//     if (editingYearId) {
//       setFinancialYears(prev => {
//         const updated = prev.map(y => y.id === editingYearId ? {
//         ...y,
//         fromDate: data.fromDate,
//         toDate: data.toDate,
//         accountingMethod: (data.accountingMethod as 'Billing method' | 'The cash method') ?? 'Billing method',
//         accountChart: data.accountChart,
//         isPreselected: data.preselected || false
//       } : y);
//         notifyChange(updated);
//         return updated;
//       });
//     } else {
//       const newYear: FinancialYearEntry = {
//         id: Date.now().toString(),
//         fromDate: data.fromDate,
//         toDate: data.toDate,
//         accountingMethod: (data.accountingMethod as 'Billing method' | 'The cash method') ?? 'Billing method',
//         accountChart: data.accountChart,
//         isPreselected: data.preselected || false,
//         openAtLogin: false
//       };
//       setFinancialYears(prev => {
//         const updated = [newYear, ...prev];
//         notifyChange(updated);
//         return updated;
//       });
//     }
//     setIsModalOpen(false);
//     setEditingYearId(null);
//     setInitialModalData(null);
//   };

//   const handleRowClick = (year: FinancialYearEntry) => {
//     setEditingYearId(year.id);
//     setInitialModalData({
//       fromDate: year.fromDate,
//       toDate: year.toDate,
//       accountingMethod: year.accountingMethod,
//       accountChart: year.accountChart,
//       preselected: year.isPreselected
//     });
//     setIsModalOpen(true);
//   };

//   const handlePreselect = (id: string) => {
//     setFinancialYears(prev => {
//       const updated = prev.map(y => ({ ...y, isPreselected: y.id === id }));
//       notifyChange(updated);
//       return updated;
//     });
//   };

//   const ToggleSwitch = ({ 
//     value, 
//     onChange, 
//     options = ['Yes', 'No'] 
//   }: { 
//     value: boolean; 
//     onChange: () => void; 
//     options?: [string, string];
//   }) => (
//     <div className="flex space-x-1">
//       <button
//         onClick={onChange}
//         className={`px-4 py-2 rounded-l-lg border transition-colors ${
//           value
//             ? 'bg-green-600 text-white border-green-600'
//             : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
//         }`}
//       >
//         {options[0]}
//       </button>
//       <button
//         onClick={onChange}
//         className={`px-4 py-2 rounded-r-lg border transition-colors ${
//           !value
//             ? 'bg-gray-200 text-gray-700 border-gray-200'
//             : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
//         }`}
//       >
//         {options[1]}
//       </button>
//     </div>
//   );

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center">
//         <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3">
//           <span className="text-white text-sm">✓</span>
//         </div>
//         <h3 className="text-lg font-medium text-gray-900">Financial year</h3>
//       </div>

//       {/* Top Section with Toggle and Create Button */}
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <div className="flex items-center space-x-4 mb-4">
//             <h4 className="text-sm font-semibold text-gray-900">Create fiscal years automatically</h4>
//             <ToggleSwitch 
//               value={createAutomatically} 
//               onChange={() => {
//                 const next = !createAutomatically;
//                 setCreateAutomatically(next);
//                 notifyChange(financialYears, next);
//               }}
//             />
//           </div>
//           <p className="text-sm text-gray-600">
//             The next fiscal year is automatically created approximately one month before the end date of the previous year. The new year will have the same chart of accounts as the previous year. Opening balances and all settings used will automatically be carried over to the next year.
//           </p>
//         </div>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           disabled={saving || loading}
//           className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-6 py-2 rounded-lg transition-colors ml-4"
//         >
//           Create new
//         </button>
//       </div>

//       {(error || success) && (
//         <div
//           className={`px-4 py-2 rounded ${
//             error
//               ? 'bg-red-50 text-red-700 border border-red-200'
//               : 'bg-green-50 text-green-700 border border-green-200'
//           }`}
//         >
//           {error || success}
//         </div>
//       )}

//       {loading && !saving && (
//         <div className="text-sm text-gray-500">Loading financial years...</div>
//       )}

//       {/* Table */}
//       <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-gray-50 border-b border-gray-200">
//               <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                 FROM
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                 EMPTY
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                 ACCOUNTING METHOD
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                 ACCOUNT CHART
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                 PRESELECTED
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {financialYears.map((year, index) => (
//               <tr
//                 key={year.id}
//                 className={index % 2 === 0 ? 'bg-white cursor-pointer' : 'bg-gray-50 cursor-pointer'}
//                 onClick={() => !saving && !loading && handleRowClick(year)}
//               >
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{year.fromDate}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{year.toDate}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{year.accountingMethod}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{year.accountChart}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <input
//                     type="checkbox"
//                     checked={year.isPreselected}
//                     onChange={(e) => {
//                       e.stopPropagation();
//                       if (!saving && !loading) {
//                         handlePreselect(year.id);
//                       }
//                     }}
//                     className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
//                     disabled={saving || loading}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Save Button */}
//       <div className="flex justify-end">
//         <button
//           onClick={handleSave}
//           disabled={saving || loading}
//           className={`bg-green-600 text-white px-6 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
//             saving || loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-700'
//           }`}
//         >
//           {saving ? 'Saving...' : 'Save'}
//         </button>
//       </div>

//       {/* Create Financial Year Modal */}
//       <CreateFinancialYearModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={handleSaveNewFinancialYear}
//         initialData={initialModalData}
//       />
//     </div>
//   );
// };