import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SalaryAgreement {
  id: string;
  name: string;
  staffType: string;
  agreementTemplate: string;
}

interface SalaryAgreementsListProps {
  onCreateNew: () => void;
}

const SalaryAgreementsList: React.FC<SalaryAgreementsListProps> = ({ onCreateNew }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items for salary functions
  const navigationItems = [
    { id: 'calendar', label: 'Calendar', path: '/salary' },
    { id: 'salary-run', label: 'Salary run', path: '/salary?tab=salary-run' },
    { id: 'holiday', label: 'Holiday calculation', path: '/salary?tab=holiday-calculation' },
    { id: 'statistic', label: 'Statistic', path: '/salary?tab=statistics' },
    { id: 'Forums', label: 'Forums', path: '/salary?tab=fora' },
    { id: 'Collection', label: 'Collection', path: '/salary?tab=collectum' },
    { id: 'RetroactiveSalary', label: 'Retroactive salary', path: '/salary?tab=retroactive-salary' },
    { id: 'MassUpdate', label: 'Mass update salaries', path: '/salary?tab=mass-update' },
    { id: 'salary-agreements', label: 'Agreement for salaries', path: '/salary-agreements' },
    { id: 'personnel-register', label: 'Staff', path: '/personnel-register' },
  ];

  // Function to determine if a navigation item is active
  const isActiveNav = (navId: string) => {
    if (navId === 'salary-agreements') {
      return location.pathname === '/salary-agreements';
    }
    if (navId === 'personnel-register') {
      return location.pathname === '/personnel-register';
    }
    // For other salary tabs
    if (location.pathname === '/salary') {
      const urlParams = new URLSearchParams(location.search);
      const tab = urlParams.get('tab');
      
      switch(navId) {
        case 'calendar':
          return !tab;
        case 'salary-run':
          return tab === 'salary-run';
        case 'holiday':
          return tab === 'holiday-calculation';
        case 'statistic':
          return tab === 'statistics';
        case 'Forums':
          return tab === 'fora';
        case 'Collection':
          return tab === 'collectum';
        case 'RetroactiveSalary':
          return tab === 'retroactive-salary';
        case 'MassUpdate':
          return tab === 'mass-update';
        default:
          return false;
      }
    }
    return false;
  };

  // Sample data - in real app this would come from an API
  const salaryAgreements: SalaryAgreement[] = [
    {
      id: '1',
      name: 'Agreement for white-collar workers - Metal',
      staffType: 'White-collar',
      agreementTemplate: 'Metal'
    },
    {
      id: '2',
      name: 'Agreement for blue-collar workers - Manufacturing',
      staffType: 'Blue-collar',
      agreementTemplate: 'Manufacturing'
    },
    {
      id: '3',
      name: 'Management Agreement - Corporate',
      staffType: 'Management',
      agreementTemplate: 'Corporate'
    },
    {
      id: '4',
      name: 'Technical Staff Agreement - Engineering',
      staffType: 'Technical',
      agreementTemplate: 'Engineering'
    },
    {
      id: '5',
      name: 'Sales Team Agreement - Retail',
      staffType: 'Sales',
      agreementTemplate: 'Retail'
    },
    {
      id: '6',
      name: 'Administrative Staff Agreement - Office',
      staffType: 'Administrative',
      agreementTemplate: 'Office'
    }
  ];

  // Filter agreements based on search term
  const filteredAgreements = salaryAgreements.filter(agreement =>
    agreement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agreement.staffType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agreement.agreementTemplate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredAgreements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAgreements = filteredAgreements.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ... existing navigation ... */}

      <div 
        className="max-w-full mx-auto" 
        style={{ 
          padding: '12px 16px 16px 16px',
          backgroundColor: '#FFFFFF',
          fontFamily: 'Inter, Roboto, Arial, sans-serif',
          fontSize: '12px',
          color: '#333333'
        }}
      >
        {/* Header Section */}
        <div 
          className="flex items-center justify-between" 
          style={{
            height: '48px',
          }}
        >
          <div 
            style={{
              fontSize: '16px',
              fontWeight: 600,
              letterSpacing: '0.2px',
              color: '#222222',
              marginRight: '16px'
            }}
          >
            AGREEMENT FOR SALARIES – LIST
          </div>
          
          <div className="flex-1 max-w-[360px] relative" style={{ marginRight: '8px' }}>
            <input
              type="text"
              placeholder="Name, staff type, agreement template"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-0"
              style={{
                height: '32px',
                borderRadius: '6px',
                border: '1px solid #D0D0D0',
                fontSize: '12px',
                color: '#333333',
                backgroundColor: '#FFFFFF',
                paddingLeft: '32px',
                paddingRight: '10px'
              }}
            />
            <div 
              style={{ 
                position: 'absolute', 
                left: '10px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#777777',
                fontSize: '14px'
              }}
            >
              🔍
            </div>
          </div>
          
          <div className="flex" style={{ gap: '8px' }}>
            <button
              onClick={onCreateNew}
              className="flex items-center justify-center font-semibold"
              style={{
                height: '32px',
                padding: '0 16px',
                backgroundColor: '#FFC107',
                color: '#000000',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 600
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFB300'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFC107'}
            >
              <span style={{ fontSize: '14px', color: '#000000', marginRight: '6px' }}>+</span>
              Create new
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div 
          style={{ 
            marginTop: '12px',
            border: '1px solid #E0E0E0',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
          }}
        >
          {/* Table Header */}
          <div 
            className="flex"
            style={{
              height: '36px',
              backgroundColor: '#BDBDBD',
              borderBottom: '2px solid #9E9E9E',
              color: '#FFFFFF'
            }}
          >
            <div 
              className="flex items-center text-left"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#FFFFFF',
                width: '55%',
                padding: '10px 12px'
              }}
            >
              NAME
            </div>
            <div 
              className="flex items-center text-left"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#FFFFFF',
                width: '20%',
                padding: '10px 12px'
              }}
            >
              STAFF TYPE
            </div>
            <div 
              className="flex items-center text-left"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#FFFFFF',
                width: '25%',
                padding: '10px 12px'
              }}
            >
              AGREEMENT TEMPLATE
            </div>
          </div>

          {/* Table Body */}
          {paginatedAgreements.map((agreement, index) => (
            <div 
              key={agreement.id}
              className="flex hover:bg-[#F9F9F9]"
              style={{
                height: '36px',
                borderBottom: '1px solid #EAEAEA',
                backgroundColor: '#FFFFFF'
              }}
            >
              <div 
                className="flex items-center text-left truncate"
                style={{
                  fontSize: '12px',
                  color: '#333333',
                  width: '55%',
                  padding: '10px 12px'
                }}
              >
                {agreement.name}
              </div>
              <div 
                className="flex items-center text-left truncate"
                style={{
                  fontSize: '12px',
                  color: '#333333',
                  width: '20%',
                  padding: '10px 12px'
                }}
              >
                {agreement.staffType}
              </div>
              <div 
                className="flex items-center text-left truncate"
                style={{
                  fontSize: '12px',
                  color: '#333333',
                  width: '25%',
                  padding: '10px 12px'
                }}
              >
                {agreement.agreementTemplate}
              </div>
            </div>
          ))}
        </div>
        {/* Bottom Pagination (Footer) */}
        <div className="flex justify-end items-center mt-3" style={{ height: '32px' }}>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <select
              value={itemsPerPage}
              className="border rounded p-1"
              style={{
                width: '48px',
                height: '28px',
                borderRadius: '4px',
                border: '1px solid #D0D0D0',
                fontSize: '12px'
              }}
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
            <span style={{ fontSize: '12px', color: '#666666' }}>of {Math.ceil(filteredAgreements.length / itemsPerPage)}</span>
            
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                color: currentPage === 1 ? '#C0C0C0' : '#888888',
                padding: '4px',
                fontSize: '14px'
              }}
            >
              ⏮
            </button>
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                color: currentPage === 1 ? '#C0C0C0' : '#888888',
                padding: '4px',
                fontSize: '14px'
              }}
            >
              ◀
            </button>
            
            <div
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: '#0B7A3B',
                color: '#FFFFFF',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '12px'
              }}
            >
              {currentPage}
            </div>
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                color: currentPage === totalPages ? '#C0C0C0' : '#888888',
                padding: '4px',
                fontSize: '14px'
              }}
            >
              ▶
            </button>
            <button 
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              style={{
                color: currentPage === totalPages ? '#C0C0C0' : '#888888',
                padding: '4px',
                fontSize: '14px'
              }}
            >
              ⏭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryAgreementsList;