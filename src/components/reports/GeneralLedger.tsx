import React from 'react';

const GeneralLedger: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#064E3B] mb-6">General Ledger</h1>
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
        <p className="text-[#111827]">General ledger content will be displayed here.</p>
        <p className="text-[#6B7280] mt-2">This is where the detailed general ledger functionality will be implemented.</p>
      </div>
    </div>
  );
};

export default GeneralLedger;