import React, { useState } from 'react';
import SalaryAgreementsList from '../components/salary-agreements/SalaryAgreementsList';
import SalaryAgreementForm from "../components/salary-agreements/SalaryAgreementForm";

const SalaryAgreementsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const handleCreateNew = () => {
    setShowForm(true);
  };

  const handleBackToList = () => {
    setShowForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {showForm ? (
        <SalaryAgreementForm onSave={() => {}} onBackToList={handleBackToList} />
      ) : (
        <SalaryAgreementsList onCreateNew={handleCreateNew} />
      )}
    </div>
  );
};

export default SalaryAgreementsPage;