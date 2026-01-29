import React, { useState } from 'react';
import SalaryAgreementsList from '../components/salary-agreements/SalaryAgreementsList';
import SalaryAgreementForm from "../components/salary-agreements/SalaryAgreementForm";
import Toast from '../components/Toast';

const SalaryAgreementsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; visible: boolean }>({
    message: '',
    type: 'info',
    visible: false
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, visible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleCreateNew = () => {
    setShowForm(true);
  };

  const handleBackToList = React.useCallback(() => {
    setShowForm(false);
    // Trigger refresh when returning to list
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleRefreshList = React.useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {showForm ? (
        <SalaryAgreementForm onSave={() => {}} onBackToList={handleBackToList} showToast={showToast} />
      ) : (
        <SalaryAgreementsList 
          onCreateNew={handleCreateNew} 
          onRefresh={handleRefreshList}
        />
      )}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        visible={toast.visible} 
        onClose={hideToast} 
      />
    </div>
  );
};

export default SalaryAgreementsPage;