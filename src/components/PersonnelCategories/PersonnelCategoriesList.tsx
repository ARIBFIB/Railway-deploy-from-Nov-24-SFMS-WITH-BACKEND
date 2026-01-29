import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '../Input';
import { Button } from '../Button';
import { Modal } from '../Modal';

import type { PersonnelCategory } from '../../services/personnelCategoriesService';

// Keep the interface for backward compatibility
interface LocalPersonnelCategory {
  id: string;
  name: string;
  type: string;
}

interface PersonnelCategoriesListProps {
  className?: string;
  onCreateNew: () => void;
  categories?: PersonnelCategory[];
}

export const PersonnelCategoriesList: React.FC<PersonnelCategoriesListProps> = ({ 
  className = '',
  onCreateNew,
  categories: propCategories
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use passed categories or mock data as fallback
  const categories = propCategories || [
    // Mock data - replace with actual API calls
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className={`min-h-screen ${className}`}
      style={{
        backgroundColor: '#F7F7F7',
        padding: '16px',
        fontFamily: 'Inter, Roboto, system-ui, sans-serif',
        fontSize: '12px',
        lineHeight: '1.4'
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-7xl mx-auto">
        {/* Left Panel - Primary Content (70%) */}
        <div className="lg:col-span-8 space-y-3">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#2B2B2B',
                marginBottom: '12px'
              }}
            >
              PERSONNEL CATEGORIES - LIST
            </h1>
            
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="relative" style={{ width: '260px' }}>
                <div 
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9E9E9E',
                    fontSize: '14px'
                  }}
                >
                  🔍
                </div>
                <input
                  type="text"
                  placeholder="Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '8px 10px 8px 28px',
                    border: '1px solid #DADADA',
                    borderRadius: '6px',
                    backgroundColor: '#FFFFFF',
                    fontSize: '12px',
                    color: '#333333'
                  }}
                />
              </div>
              
              {/* View/Count Controls */}
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '14px', color: '#616161' }}>☰</span>
                <div 
                  style={{
                    fontSize: '12px',
                    padding: '6px 8px',
                    backgroundColor: '#F2F2F2',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{categories.length}</span>
                  <span style={{ fontSize: '10px' }}>▼</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div style={{
            height: '1px',
            backgroundColor: '#E5E5E5',
            margin: '12px 0'
          }}></div>
          
          {/* Table Section */}
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              overflow: 'hidden'
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th 
                      style={{
                        height: '36px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#333333',
                        padding: '8px 12px',
                        textAlign: 'left',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      NAME
                    </th>
                    <th 
                      style={{
                        height: '36px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#FFFFFF',
                        padding: '8px 12px',
                        textAlign: 'left',
                        backgroundColor: '#BDBDBD',
                        borderRadius: '0 6px 6px 0'
                      }}
                    >
                      TYPE
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan={2} style={{
                        height: '120px',
                        backgroundColor: '#FFFFFF'
                      }}></td>
                    </tr>
                  ) : (
                    filteredCategories.map((category) => (
                      <tr key={category.id}>
                        <td 
                          style={{
                            padding: '10px 12px',
                            fontSize: '12px',
                            color: '#333333',
                            textAlign: 'left',
                            borderBottom: '1px solid #E0E0E0'
                          }}
                        >
                          {category.name}
                        </td>
                        <td 
                          style={{
                            padding: '10px 12px',
                            fontSize: '12px',
                            color: '#333333',
                            textAlign: 'left',
                            borderBottom: '1px solid #E0E0E0'
                          }}
                        >
                          {category.type}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Primary Action Button (Mobile/Tablet) */}
          <div className="sm:hidden flex justify-center mt-4">
            <button
              onClick={onCreateNew}
              style={{
                height: '34px',
                padding: '0 14px',
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
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFB300'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFC107'}
            >
              <span style={{ fontSize: '14px', marginRight: '6px' }}>+</span>
              Create new personnel category
            </button>
          </div>
        </div>
        
        {/* Right Panel - Info Panel (30%) */}
        <div className="lg:col-span-4">
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
            }}
          >
            <div style={{
              fontSize: '12px',
              color: '#333333',
              lineHeight: '1.5',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div>• Select "Create new personnel category"</div>
              <div>• Give the category a name. This will be displayed as the heading on employees' personnel cards.</div>
              <div>• Choose the type of category you want.</div>
              <div>• Dropdown menu or option buttons, specify which values should be selectable on the personnel card.</div>
              
              <div style={{ marginTop: '16px' }}>
                For more info see{' '}
                <a 
                  href="#" 
                  style={{
                    color: '#1E88E5',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  Personnel categories
                </a>
              </div>
            </div>
          </div>
          
          {/* Primary Action Button (Desktop) */}
          <div className="hidden sm:flex justify-center mt-4">
            <button
              onClick={onCreateNew}
              style={{
                height: '34px',
                padding: '0 14px',
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
              <span style={{ fontSize: '14px', marginRight: '6px' }}>+</span>
              Create new personnel category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};