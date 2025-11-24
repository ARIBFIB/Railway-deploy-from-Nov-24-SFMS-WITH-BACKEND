import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Pin } from 'lucide-react';
import { Input } from '../Input';

interface CashReconciliationProps {
  defaultExpanded?: boolean;
  className?: string;
}

export const CashReconciliation: React.FC<CashReconciliationProps> = ({
  defaultExpanded = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [reconciliationData, setReconciliationData] = useState({
    openingCash: '',
    todaysCashRegister: '0.00',
    todaysWithdrawal: '0.00',
    cashReconciliation: '0.00'
  });

  const handleInputChange = (field: string, value: string) => {
    setReconciliationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header - Always Visible */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={toggleExpanded}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-green-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-green-600" />
          )}
          <h3 className="text-sm font-medium text-gray-700">Cash reconciliation</h3>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500">Click to {isExpanded ? 'collapse' : 'expand'}</span>
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
          {/* Opening Cash */}
          <div className="flex items-center justify-between py-2">
            <label className="text-sm font-medium text-gray-700">
              Opening cash
            </label>
            <div className="relative w-32">
              <Input
                type="number"
                step="0.01"
                value={reconciliationData.openingCash}
                onChange={(e) => handleInputChange('openingCash', e.target.value)}
                className="text-right pr-8 text-sm"
                placeholder=""
              />
              <Pin className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
            </div>
          </div>

          {/* Today's Cash Register */}
          <div className="flex items-center justify-between py-2">
            <label className="text-sm font-medium text-gray-700">
              Today's cash register
            </label>
            <span className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded border w-32 text-right">
              {reconciliationData.todaysCashRegister}
            </span>
          </div>

          {/* Today's Withdrawal */}
          <div className="flex items-center justify-between py-2">
            <label className="text-sm font-medium text-gray-700">
              Today's withdrawal
            </label>
            <span className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded border w-32 text-right">
              {reconciliationData.todaysWithdrawal}
            </span>
          </div>

          {/* Cash Reconciliation */}
          <div className="flex items-center justify-between py-2 border-t border-gray-200 pt-4">
            <label className="text-sm font-medium text-gray-900">
              Cash reconciliation
            </label>
            <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded border border-gray-300 w-32 text-right">
              {reconciliationData.cashReconciliation}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
