import React, { useState } from 'react';
import { Plus, Search, Printer, Calendar, CheckSquare, ChevronDown, List } from 'lucide-react';

interface Project {
  id: string;
  projectNumber: string;
  name: string;
  startDate: string;
  endDate: string;
  projectLeader: string;
  status: 'not-started' | 'ongoing' | 'completed';
}

const mockProjects: Project[] = [
  {
    id: '1',
    projectNumber: 'PRJ-001',
    name: 'Website Redesign',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    projectLeader: 'John Smith',
    status: 'ongoing'
  },
  {
    id: '2',
    projectNumber: 'PRJ-002',
    name: 'Mobile App Development',
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    projectLeader: 'Sarah Johnson',
    status: 'not-started'
  },
  {
    id: '3',
    projectNumber: 'PRJ-003',
    name: 'Database Migration',
    startDate: '2023-11-01',
    endDate: '2024-01-01',
    projectLeader: 'Mike Wilson',
    status: 'completed'
  }
];

export const ProjectManagementList: React.FC<{
  onCreateProject: () => void;
}> = ({ onCreateProject }) => {
  
  // Add responsive styles
  const responsiveStyles = `
    @media (max-width: 1024px) {
      .end-date-input { width: 150px !important; }
      .status-dropdown { width: 140px !important; }
    }
    
    @media (max-width: 768px) {
      .sticky-action-bar {
        flex-direction: column;
        align-items: stretch;
        height: auto !important;
        padding: 8px !important;
      }
      .right-controls {
        flex-wrap: wrap;
        gap: 8px !important;
      }
      .save-button {
        width: 100% !important;
        margin-top: 8px;
      }
    }
    
    @media (max-width: 480px) {
      .sticky-action-bar {
        flex-direction: column;
        gap: 8px;
      }
      .selection-info {
        text-align: center;
      }
      .right-controls {
        flex-direction: column;
        gap: 8px;
      }
      .end-date-field, .status-dropdown {
        width: 100%;
      }
      .end-date-input, .status-select {
        width: 100% !important;
      }
      .save-button {
        width: 100% !important;
      }
    }
  `;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not-started' | 'ongoing' | 'completed'>('not-started');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [viewCount, setViewCount] = useState(0);

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.projectNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.projectLeader.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map(project => project.id));
    }
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <>
      <style>{responsiveStyles}</style>
      <div style={{ 
        backgroundColor: '#F6F6F6', 
        padding: '16px',
        fontFamily: 'Inter, Roboto, system-ui',
        fontSize: '12px',
        color: '#2B2B2B',
        paddingBottom: '72px'  /* Content offset for sticky bar */
      }}>
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        {/* Page Title */}
        <div style={{ 
          fontSize: '14px',
          fontWeight: 600,
          color: '#2B2B2B',
          padding: '12px 0'
        }}>
          REGISTER - PROJECT
        </div>

        {/* Search Field */}
        <div style={{ position: 'relative', minWidth: '320px' }}>
          <Search 
            style={{ 
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '14px',
              height: '14px',
              color: '#9E9E9E'
            }} 
          />
          <input
            type="text"
            placeholder="Project no, Title, Project manager"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              height: '32px',
              paddingLeft: '32px',
              paddingRight: '10px',
              paddingTop: '6px',
              paddingBottom: '6px',
              fontSize: '12px',
              border: '1px solid #D0D0D0',
              borderRadius: '4px',
              backgroundColor: '#FFFFFF',
              width: '100%'
            }}
          />
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onCreateProject}
          style={{
            height: '32px',
            padding: '0 16px',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: '#FFC107',
            color: '#000000',
            borderRadius: '18px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FFB300';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFC107';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Plus style={{ width: '14px', height: '14px', marginRight: '6px' }} />
          Create project
        </button>
      </div>

      {/* Secondary Header Row */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        marginBottom: '16px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          fontSize: '12px',
          color: '#555555',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#555555'}>
          <Printer style={{ width: '14px', height: '14px', marginRight: '6px' }} />
          Print list
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div style={{ 
        display: 'flex',
        gap: '8px',
        marginTop: '16px',
        marginBottom: '12px'
      }}>
        {[
          { key: 'all', label: 'All' },
          { key: 'not-started', label: 'Not started' },
          { key: 'ongoing', label: 'Ongoing' },
          { key: 'completed', label: 'Completed' }
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setStatusFilter(filter.key as any)}
            style={{
              height: '32px',
              padding: '0 14px',
              fontSize: '12px',
              borderRadius: '4px',
              border: '1px solid #D0D0D0',
              backgroundColor: '#FFFFFF',
              color: '#333333',
              cursor: 'pointer',
              position: 'relative',
              ...(statusFilter === filter.key && {
                borderLeft: '4px solid #FFF176'
              })
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Table Controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* List Icon */}
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#EEEEEE',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px'
          }}>
            ☰
          </div>
          
          {/* Count Dropdown */}
          <div style={{
            height: '32px',
            padding: '0 10px',
            fontSize: '12px',
            backgroundColor: '#EEEEEE',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #D0D0D0'
          }}>
            <span>{viewCount}</span>
            <ChevronDown style={{ width: '12px', height: '12px', marginLeft: '4px' }} />
          </div>
        </div>
      </div>

      {/* Data Table Container */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        marginTop: '12px'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ 
              height: '40px',
              backgroundColor: '#FFFFFF',
              borderBottom: '1px solid #E0E0E0'
            }}>
              <th style={{ 
                width: '40px',
                padding: '10px 12px',
                textAlign: 'center',
                verticalAlign: 'middle'
              }}>
                <CheckSquare 
                  style={{ 
                    width: '14px', 
                    height: '14px',
                    cursor: 'pointer',
                    color: selectedProjects.length === filteredProjects.length && filteredProjects.length > 0
                      ? '#2196F3' 
                      : '#9E9E9E'
                  }}
                  onClick={handleSelectAll}
                />
              </th>
              <th style={{ 
                width: '160px',
                padding: '10px 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#FFFFFF',
                backgroundColor: '#BDBDBD',
                textAlign: 'left',
                verticalAlign: 'middle'
              }}>
                PROJECT NO.
              </th>
              <th style={{ 
                padding: '10px 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#333333',
                textAlign: 'left',
                verticalAlign: 'middle'
              }}>
                NAME
              </th>
              <th style={{ 
                width: '120px',
                padding: '10px 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#333333',
                textAlign: 'left',
                verticalAlign: 'middle'
              }}>
                START
              </th>
              <th style={{ 
                width: '120px',
                padding: '10px 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#333333',
                textAlign: 'left',
                verticalAlign: 'middle'
              }}>
                END
              </th>
              <th style={{ 
                width: '220px',
                padding: '10px 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#333333',
                textAlign: 'left',
                verticalAlign: 'middle'
              }}>
                PROJECT LEADER
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ 
                  height: '200px',
                  textAlign: 'center',
                  color: '#9E9E9E',
                  borderTop: '1px solid #E0E0E0'
                }}>
                  No projects found
                </td>
              </tr>
            ) : (
              filteredProjects.map((project) => (
                <tr key={project.id} style={{ 
                  borderTop: '1px solid #E0E0E0'
                }}>
                  <td style={{ 
                    padding: '10px 12px',
                    textAlign: 'center'
                  }}>
                    <CheckSquare 
                      style={{ 
                        width: '14px', 
                        height: '14px',
                        cursor: 'pointer',
                        color: selectedProjects.includes(project.id)
                          ? '#2196F3' 
                          : '#9E9E9E'
                      }}
                      onClick={() => handleSelectProject(project.id)}
                    />
                  </td>
                  <td style={{ 
                    padding: '10px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#2B2B2B'
                  }}>
                    {project.projectNumber}
                  </td>
                  <td style={{ 
                    padding: '10px 12px',
                    fontSize: '12px',
                    color: '#2B2B2B'
                  }}>
                    {project.name}
                  </td>
                  <td style={{ 
                    padding: '10px 12px',
                    fontSize: '12px',
                    color: '#2B2B2B'
                  }}>
                    {formatDate(project.startDate)}
                  </td>
                  <td style={{ 
                    padding: '10px 12px',
                    fontSize: '12px',
                    color: '#2B2B2B'
                  }}>
                    {formatDate(project.endDate)}
                  </td>
                  <td style={{ 
                    padding: '10px 12px',
                    fontSize: '12px',
                    color: '#2B2B2B'
                  }}>
                    {project.projectLeader}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Sticky Bottom Action Bar - Always Visible */}
      <div style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        width: '100%',
        zIndex: '1000',
        height: '56px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E0E0E0',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }} className="sticky-action-bar">
        {/* Left Section - Selection Info */}
        <div style={{
          fontSize: '12px',
          fontWeight: 500,
          color: '#555555',
          lineHeight: '1'
        }} className="selection-info">
          {selectedProjects.length} selected
        </div>

        {/* Right Section - Action Controls */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px' 
        }} className="right-controls">
          {/* End Date Field */}
          <div className="end-date-field">
            <div style={{
              fontSize: '11px',
              fontWeight: 500,
              color: '#555555',
              marginBottom: '4px'
            }}>
              End date
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                style={{
                  height: '32px',
                  width: '180px',
                  padding: '6px 32px 6px 10px',
                  fontSize: '12px',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  backgroundColor: '#FFFFFF'
                }}
                className="end-date-input"
              />
              <Calendar 
                style={{ 
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '14px',
                  height: '14px',
                  color: '#9E9E9E'
                }} 
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="status-dropdown">
            <div style={{
              fontSize: '11px',
              fontWeight: 500,
              color: '#555555',
              marginBottom: '4px'
            }}>
              Status
            </div>
            <div style={{ position: 'relative' }}>
              <select style={{
                height: '32px',
                width: '160px',
                padding: '6px 32px 6px 10px',
                fontSize: '12px',
                border: '1px solid #D0D0D0',
                borderRadius: '4px',
                backgroundColor: '#FFFFFF',
                appearance: 'none'
              }} className="status-select">
                <option>Not started</option>
                <option>Ongoing</option>
                <option>Completed</option>
              </select>
              <ChevronDown 
                style={{ 
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '10px',
                  height: '10px',
                  color: '#9E9E9E'
                }} 
              />
            </div>
          </div>

          {/* Save Button */}
          <button 
            style={{
              height: '32px',
              minWidth: '72px',
              padding: '0 18px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: selectedProjects.length > 0 ? '#9BC8A6' : '#C8E0CF',
              color: '#FFFFFF',
              borderRadius: '18px',
              border: 'none',
              cursor: selectedProjects.length > 0 ? 'pointer' : 'not-allowed'
            }}
            className="save-button"
            onMouseEnter={(e) => {
              if (selectedProjects.length > 0) {
                e.currentTarget.style.backgroundColor = '#88B89A';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.18)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedProjects.length > 0) {
                e.currentTarget.style.backgroundColor = '#9BC8A6';
                e.currentTarget.style.boxShadow = 'none';
              } else {
                e.currentTarget.style.backgroundColor = '#C8E0CF';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
            disabled={selectedProjects.length === 0}
          >
            Save
          </button>
        </div>
      </div>
    </div>
    </>
  );
};