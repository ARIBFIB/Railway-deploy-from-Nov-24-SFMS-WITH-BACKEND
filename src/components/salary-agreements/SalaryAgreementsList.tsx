import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { salaryAgreementsService, type SalaryAgreement } from '../../services/salaryAgreementsService';

type SortField = 'name' | 'staff_type' | 'agreement_template';
type SortDirection = 'asc' | 'desc';

interface SalaryAgreementsListProps {
  onCreateNew: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const SalaryAgreementsList: React.FC<SalaryAgreementsListProps> = ({ onCreateNew, onRefresh, isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [activeColumn, setActiveColumn] = useState<SortField | null>(null);
  const [agreements, setAgreements] = useState<SalaryAgreement[]>([]);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
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

  // Load agreements from API
  const loadAgreements = async () => {
    console.log('loadAgreements called, current loading state:', loading, 'agreements length:', agreements.length);
    
    // Prevent multiple simultaneous requests (except initial load)
    if (loading && agreements.length > 0) {
      console.log('Skipping load - already loading');
      return;
    }
    
    // Timeout to prevent stuck loading state
    const timeoutId = setTimeout(() => {
      console.log('Timeout triggered - forcing loading to false');
      setLoading(false);
      setDebugInfo('Loading timed out');
    }, 10000); // 10 second timeout
    
    try {
      setLoading(true);
      console.log('Set loading to true');
      
      // Check if user is logged in
      const authToken = localStorage.getItem('auth_token');
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      
      if (!authToken || !userData.id) {
        console.log('User not logged in, showing sample data');
        setAgreements([
          {
            id: '1',
            foundation_id: '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9',
            name: 'Sample Agreement - Metal Workers',
            staff_type: 'white-collar',
            agreement_template: 'Metal',
            is_active: true
          },
          {
            id: '2',
            foundation_id: '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9',
            name: 'Sample Agreement - Manufacturing',
            staff_type: 'blue-collar',
            agreement_template: 'Manufacturing',
            is_active: true
          }
        ]);
        setDebugInfo('Showing sample data - user not logged in');
        setLoading(false);
        return;
      }
      
      // Get foundation ID from user context
      const foundationId = userData.foundationId || userData.foundation_id || '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9';
      
      console.log('Loading agreements for foundation:', foundationId);
      console.log('User data:', userData);
      
      const data = await salaryAgreementsService.list({ foundation_id: foundationId });
      console.log('Loaded agreements:', data);
      console.log('First agreement structure:', data[0]);
      setAgreements(data);
      
      // Set debug info
      setDebugInfo(`Loaded ${data.length} agreements for foundation ${foundationId}`);
    } catch (error) {
      console.error('Failed to load agreements:', error);
      // Fallback to sample data for demonstration
      setAgreements([
        {
          id: '1',
          foundation_id: '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9',
          name: 'Agreement for white-collar workers - Metal',
          staff_type: 'white-collar',
          agreement_template: 'Metal',
          is_active: true
        },
        {
          id: '2',
          foundation_id: '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9',
          name: 'Agreement for blue-collar workers - Manufacturing',
          staff_type: 'blue-collar',
          agreement_template: 'Manufacturing',
          is_active: true
        }
      ]);
      setDebugInfo('Showing fallback sample data due to error');
    } finally {
      console.log('Finally block - clearing timeout and setting loading to false');
      clearTimeout(timeoutId);
      setLoading(false);
      console.log('Loading state after finally:', loading);
    }
  };

  // Refresh function
  const refreshList = () => {
    if (onRefresh) {
      onRefresh();
    }
    loadAgreements();
  };

  // Call onRefresh callback when data loads (debounced)
  useEffect(() => {
    if (onRefresh) {
      // Debounce the refresh call to prevent infinite loops
      const timer = setTimeout(() => {
        onRefresh();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [agreements, onRefresh]);

  // Load data on mount
  useEffect(() => {
    console.log('=== useEffect triggered ===');
    let isMounted = true;
    
    const loadData = async () => {
      console.log('loadData function called, isMounted:', isMounted);
      if (isMounted) {
        console.log('Calling loadAgreements from useEffect');
        try {
          await loadAgreements();
          console.log('loadAgreements completed successfully');
        } catch (error) {
          console.error('loadAgreements failed:', error);
        }
      } else {
        console.log('Skipping load - component unmounted');
      }
    };
    
    // Small delay to prevent rapid re-renders
    const timer = setTimeout(() => {
      loadData();
    }, 100);
    
    return () => {
      console.log('=== useEffect cleanup ===');
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // TEMPORARY: Show all agreements without filtering to debug
  const filteredAgreements = agreements;
  
  // Original filtering logic (commented out for debugging)
  /*
  const filteredAgreements = agreements.filter(agreement => {
    // Check if agreement has the required properties
    const hasName = agreement.name && typeof agreement.name === 'string';
    const hasStaffType = agreement.staff_type && typeof agreement.staff_type === 'string';
    const hasTemplate = agreement.agreement_template && typeof agreement.agreement_template === 'string';
    
    console.log('Filtering agreement:', { 
      id: agreement.id, 
      name: agreement.name, 
      staff_type: agreement.staff_type, 
      agreement_template: agreement.agreement_template,
      hasName,
      hasStaffType,
      hasTemplate
    });
    
    if (!hasName || !hasStaffType || !hasTemplate) {
      return false; // Skip agreements with missing required fields
    }
    
    return agreement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           agreement.staff_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
           agreement.agreement_template.toLowerCase().includes(searchTerm.toLowerCase());
  });
  */

  // Sort agreements
  const sortedAgreements = [...filteredAgreements].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = (bValue as string).toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedAgreements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAgreements = sortedAgreements.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setActiveColumn(field);
  };

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
            {/* <button
              onClick={() => {
                console.log('=== FORCE REFRESH CLICKED ===');
                setAgreements([]);
                setDebugInfo('Force refresh initiated');
                loadAgreements();
              }}
              className="flex items-center justify-center font-semibold"
              style={{
                height: '32px',
                padding: '0 16px',
                backgroundColor: '#2196F3',
                color: '#FFFFFF',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 600
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1976D2'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
            >
              <span style={{ fontSize: '14px', color: '#FFFFFF', marginRight: '6px' }}>⚡</span>
              Force Refresh
            </button> */}
            {/* <button
              onClick={loadAgreements}
              className="flex items-center justify-center font-semibold"
              style={{
                height: '32px',
                padding: '0 16px',
                backgroundColor: '#4CAF50',
                color: '#FFFFFF',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 600
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
            >
              <span style={{ fontSize: '14px', color: '#FFFFFF', marginRight: '6px' }}>🔄</span>
              Refresh
            </button> */}
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

        {/* Debug Info */}
        <div style={{ 
          padding: '8px', 
          backgroundColor: '#f0f0f0',
          fontSize: '10px',
          color: '#666666',
          marginBottom: '8px'
        }}>
          Debug: {debugInfo || 'No debug info'} | Loading: {loading ? 'true' : 'false'} | isLoading: {isLoading ? 'true' : 'false'} | Agreements: {agreements.length}
        </div>

        {/* Loading indicator */}
        {(loading || isLoading) && (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            color: '#666666',
            fontSize: '12px'
          }}>
            Loading agreements...
          </div>
        )}

        {/* Data Table */}
        {!loading && !isLoading && (
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
                className="flex items-center text-left cursor-pointer"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  width: '55%',
                  padding: '10px 12px',
                  backgroundColor: activeColumn === 'name' ? '#B8B8B8' : 'transparent'
                }}
                onClick={() => handleSort('name')}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E6E6E6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = activeColumn === 'name' ? '#B8B8B8' : 'transparent'}
              >
                NAME
                {sortField === 'name' && (
                  <span style={{ marginLeft: '4px' }}>
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </div>
              <div 
                className="flex items-center text-left cursor-pointer"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  width: '20%',
                  padding: '10px 12px',
                  backgroundColor: activeColumn === 'staff_type' ? '#B8B8B8' : 'transparent'
                }}
                onClick={() => handleSort('staff_type')}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E6E6E6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = activeColumn === 'staff_type' ? '#B8B8B8' : 'transparent'}
              >
                STAFF TYPE
                {sortField === 'staff_type' && (
                  <span style={{ marginLeft: '4px' }}>
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </div>
              <div 
                className="flex items-center text-left cursor-pointer"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  width: '25%',
                  padding: '10px 12px',
                  backgroundColor: activeColumn === 'agreement_template' ? '#B8B8B8' : 'transparent'
                }}
                onClick={() => handleSort('agreement_template')}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E6E6E6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = activeColumn === 'agreement_template' ? '#B8B8B8' : 'transparent'}
              >
                AGREEMENT TEMPLATE
                {sortField === 'agreement_template' && (
                  <span style={{ marginLeft: '4px' }}>
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </div>
            </div>

            {/* Debug: Show raw data */}
            <div style={{ padding: '10px', backgroundColor: '#f9f9f9', fontSize: '10px', color: '#666' }}>
              Raw agreements count: {agreements.length} | Paginated count: {paginatedAgreements.length}
            </div>
            
            {/* Table Body */}
            {paginatedAgreements.map((agreement, index) => (
              <div 
                key={agreement.id || index}
                className="flex"
                style={{
                  height: '36px',
                  borderBottom: '1px solid #EAEAEA',
                  backgroundColor: '#FFFFFF'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E6E6E6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
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
                  {agreement.name || 'No name'}
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
                  {agreement.staff_type || 'No staff type'}
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
                  {agreement.agreement_template || 'No template'}
                </div>
              </div>
            ))}

            {paginatedAgreements.length === 0 && (
              <div 
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: '#666666',
                  fontSize: '12px',
                  fontStyle: 'italic'
                }}
              >
                No agreements found
              </div>
            )}
          </div>
        )}

        {/* Bottom Pagination (Footer) */}
        <div className="flex justify-end items-center mt-3" style={{ height: '32px' }}>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <select
              value={itemsPerPage}
              onChange={(e) => {}}
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