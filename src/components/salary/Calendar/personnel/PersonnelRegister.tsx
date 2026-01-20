import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeesSVG from '../../../../assets/images/employees.svg';
import History from './History';
import CreateNewTemplate from './CreateNewTemplate';
import ImportPersonnel from './ImportPersonnel';
import ExportPersonnel from './ExportPersonnel';
import PrintOutReport from './PrintOutReport';
import CreateFosRequest from './CreateFosRequest';
import NewPersonnelRegisterList from './NewPersonnelRegisterList';

const PersonnelRegister = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Track which modals are open
  const [modals, setModals] = useState({
    history: false,
    createTemplate: false,
    importPersonnel: false,
    exportPersonnel: false,
    printOutReport: false,
    createFosRequest: false,
  });

  const tabs = ['All', 'Active', 'Not complete', 'Inactive'];

  return (
    <NewPersonnelRegisterList />
  );
};

export default PersonnelRegister;
