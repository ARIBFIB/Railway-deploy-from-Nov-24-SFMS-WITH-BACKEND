import React from 'react';
import { useLocation } from 'react-router-dom';
import Calendar from '../components/salary/Calendar/Calendar';
import PayrollProcessing from '../components/salary/PayrollProcessing/PayrollProcessing';
import VacationCalculation from '../components/salary/VacationCalculation/VacationCalculation';
import Statistics from '../components/salary/Statistics/Statistic';
import Fora from '../components/salary/Forums/Forums';
import Collectum from '../components/salary/Collection/Collection';

const SalaryPage: React.FC = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const tab = urlParams.get('tab');
  
  const renderTabContent = () => {
    switch (tab) {
      case 'payroll-processing':
        return <PayrollProcessing />;
      case 'vacation-calculation':
        return <VacationCalculation />;
      case 'statistics':
        return <Statistics />;
      case 'fora':
        return <Fora />;
      case 'collectum':
        return <Collectum />;
      default:
        return <Calendar />;
    }
  };

  return (
    <div className="w-full">
      {renderTabContent()}
    </div>
  );
};

export default SalaryPage;