import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface PersonnelCategoriesFormProps {
  className?: string;
  onShowList: () => void;
  onSave: (data: { name: string; type: string }) => void;
  onDelete?: () => void;
}

export const PersonnelCategoriesForm: React.FC<PersonnelCategoriesFormProps> = ({ 
  className = '',
  onShowList,
  onSave,
  onDelete
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Free text field');

  const handleSave = () => {
    if (name.trim()) {
      onSave({ name: name.trim(), type });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div 
      className={`min-h-screen ${className}`}
      style={{
        backgroundColor: '#F6F6F6',
        padding: '16px',
        fontFamily: 'Inter, Roboto, system-ui, sans-serif',
        fontSize: '12px',
        color: '#2B2B2B'
      }}
    >
      {/* Top Header Bar */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 0'
        }}
      >
        <h1 
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#2B2B2B'
          }}
        >
          PERSONNEL CATEGORY -
        </h1>
        
        <button
          onClick={onShowList}
          style={{
            height: '32px',
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
          <span style={{ fontSize: '14px', marginRight: '6px' }}>☰</span>
          Show list
        </button>
      </div>

      {/* Divider */}
      <div 
        style={{
          height: '1px',
          backgroundColor: '#E0E0E0',
          margin: '8px 0 16px'
        }}
      ></div>

      {/* Main Content Area */}
      <div 
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        style={{ gap: '24px' }}
      >
        {/* Left Column - Form Fields (65%) */}
        <div className="lg:col-span-8">
          <div 
            style={{
              maxWidth: '720px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            {/* Name Field */}
            <div>
              <label 
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#333333',
                  marginBottom: '6px'
                }}
              >
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '6px 10px',
                  fontSize: '12px',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  backgroundColor: '#FFFFFF',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#FFC107';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255,193,7,0.15)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#D0D0D0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Type Field (Dropdown) */}
            <div>
              <label 
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#333333',
                  marginBottom: '6px'
                }}
              >
                Type *
              </label>
              <div 
                style={{
                  position: 'relative',
                  width: '100%'
                }}
              >
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '6px 32px 6px 10px',
                    fontSize: '12px',
                    border: '1px solid #D0D0D0',
                    borderRadius: '4px',
                    backgroundColor: '#FFFFFF',
                    color: '#2B2B2B',
                    appearance: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Free text field">Free text field</option>
                  <option value="Dropdown">Dropdown</option>
                  <option value="Option buttons">Option buttons</option>
                </select>
                <div 
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#666666',
                    fontSize: '10px',
                    pointerEvents: 'none'
                  }}
                >
                  ▼
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Information Card (35%) */}
        <div className="lg:col-span-4">
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
            }}
          >
            <div 
              style={{
                fontSize: '12px',
                lineHeight: '1.5',
                color: '#333333',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div>• Give the category a name. This will appear as the title on the employee's personnel card.</div>
              <div>• Select the type of category you want.</div>
              <div>• Drop-down menu or Option buttons, specify which values should be selectable on the personnel card.</div>
              
              <div style={{ marginTop: '8px' }}>
                <a 
                  href="#" 
                  style={{
                    color: '#1E88E5',
                    fontSize: '12px',
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
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div 
        style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          width: '100%',
          height: '56px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E0E0E0',
          padding: '8px 16px',
          zIndex: '100',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box'
        }}
      >
        {/* Delete Button (Left) */}
        {onDelete && (
          <button
            onClick={handleDelete}
            style={{
              height: '32px',
              padding: '0 16px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: '#9E9E9E',
              color: '#FFFFFF',
              borderRadius: '18px',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#757575'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9E9E9E'}
          >
            Delete
          </button>
        )}

        {/* Save Button (Right) */}
        <button
          onClick={handleSave}
          style={{
            height: '32px',
            padding: '0 18px',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: '#0B8043',
            color: '#FFFFFF',
            borderRadius: '18px',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0A6E3B';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#0B8043';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};