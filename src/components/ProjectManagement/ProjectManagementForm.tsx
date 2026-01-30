import React, { useState } from 'react';
import { Plus, Calendar, ChevronDown, Trash2, List } from 'lucide-react';

interface ProjectFormData {
  projectNo: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  hours: string;
  amount: string;
  projectManager: string;
  notes: string;
  customerName: string;
}

export const ProjectManagementForm: React.FC<{
  onClose: () => void;
  onCreateProject: () => void;
}> = ({ onClose, onCreateProject }) => {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    projectNo: '1',
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'Not started',
    hours: '',
    amount: '0,00',
    projectManager: '',
    notes: '',
    customerName: ''
  });

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving project:', formData);
    onClose();
  };

  const handleDelete = () => {
    console.log('Deleting project');
    onClose();
  };

  return (
    <div style={{ 
      backgroundColor: '#F6F6F6',
      minHeight: '100vh',
      padding: '16px',
      fontFamily: 'Inter, Roboto, system-ui',
      fontSize: '12px'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <h1 style={{ 
          fontSize: '14px',
          fontWeight: 600,
          color: '#2B2B2B'
        }}>
          PROJECT {formData.projectNo} - CREATE NEW
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCreateProject}
            style={{
              height: '32px',
              padding: '0 16px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: '#FFFFFF',
              color: '#2B2B2B',
              borderRadius: '18px',
              border: '1px solid #D0D0D0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F5F5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            <Plus style={{ width: '14px', height: '14px' }} />
            Create project
          </button>
          <button
            onClick={onClose}
            style={{
              height: '32px',
              padding: '0 16px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: '#FFC107',
              color: '#000000',
              borderRadius: '18px',
              border: '1px solid #FFC107',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
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
            <List style={{ width: '14px', height: '14px' }} />
            Show list
          </button>
        </div>
      </div>

      {/* Main Project Details Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '16px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '24px'
        }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ 
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#2B2B2B',
                marginBottom: '8px'
              }}>
                Project no.
              </label>
              <input
                value={formData.projectNo}
                onChange={(e) => handleInputChange('projectNo', e.target.value)}
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '0 12px',
                  fontSize: '12px',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  backgroundColor: '#FFFFFF'
                }}
              />
            </div>
            
            <div>
              <label style={{ 
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#2B2B2B',
                marginBottom: '8px'
              }}>
                Name
              </label>
              <input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter project name"
                style={{
                  width: '100%',
                  height: '32px',
                  padding: '0 12px',
                  fontSize: '12px',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  backgroundColor: '#FFFFFF'
                }}
              />
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ 
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#2B2B2B',
                marginBottom: '8px'
              }}>
                Start date
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  style={{
                    flex: 1,
                    height: '32px',
                    padding: '0 12px',
                    fontSize: '12px',
                    border: '1px solid #D0D0D0',
                    borderRadius: '4px',
                    backgroundColor: '#FFFFFF'
                  }}
                />
                <button style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#EEEEEE',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <Calendar style={{ width: '14px', height: '14px', color: '#757575' }} />
                </button>
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#2B2B2B',
                marginBottom: '8px'
              }}>
                End date
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  style={{
                    flex: 1,
                    height: '32px',
                    padding: '0 12px',
                    fontSize: '12px',
                    border: '1px solid #D0D0D0',
                    borderRadius: '4px',
                    backgroundColor: '#FFFFFF'
                  }}
                />
                <button style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#EEEEEE',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <Calendar style={{ width: '14px', height: '14px', color: '#757575' }} />
                </button>
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#2B2B2B',
                marginBottom: '8px'
              }}>
                Status
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 12px',
                    fontSize: '12px',
                    border: '1px solid #D0D0D0',
                    borderRadius: '4px',
                    backgroundColor: '#FFFFFF',
                    appearance: 'none',
                    paddingRight: '32px'
                  }}
                >
                  <option value="Not started">Not started</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="On hold">On hold</option>
                </select>
                <ChevronDown 
                  style={{ 
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '14px',
                    height: '14px',
                    color: '#757575'
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '16px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <button
          onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#4CAF50',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          <ChevronDown 
            style={{ 
              width: '14px', 
              height: '14px',
              transition: 'transform 0.2s',
              transform: showAdditionalInfo ? 'rotate(180deg)' : 'rotate(0deg)'
            }} 
          />
          Additional information
        </button>

        {showAdditionalInfo && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#2B2B2B',
                  marginBottom: '8px'
                }}>
                  Hours
                </label>
                <input
                  value={formData.hours}
                  onChange={(e) => handleInputChange('hours', e.target.value)}
                  placeholder="Enter hours"
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 12px',
                    fontSize: '12px',
                    border: '1px solid #D0D0D0',
                    borderRadius: '4px',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#2B2B2B',
                  marginBottom: '8px'
                }}>
                  Amount
                </label>
                <div style={{ display: 'flex' }}>
                  <input
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    style={{
                      flex: 1,
                      height: '32px',
                      padding: '0 12px',
                      fontSize: '12px',
                      border: '1px solid #D0D0D0',
                      borderRadius: '4px 0 0 4px',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                  <div style={{
                    height: '32px',
                    padding: '0 12px',
                    fontSize: '12px',
                    backgroundColor: '#EEEEEE',
                    border: '1px solid #D0D0D0',
                    borderLeft: 'none',
                    borderRadius: '0 4px 4px 0',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#757575'
                  }}>
                    0,00
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#2B2B2B',
                  marginBottom: '8px'
                }}>
                  Project Manager
                </label>
                <input
                  value={formData.projectManager}
                  onChange={(e) => handleInputChange('projectManager', e.target.value)}
                  placeholder="Enter project manager name"
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 12px',
                    fontSize: '12px',
                    border: '1px solid #D0D0D0',
                    borderRadius: '4px',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#2B2B2B',
                  marginBottom: '8px'
                }}>
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Enter project notes"
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '12px',
                    border: '1px solid #D0D0D0',
                    borderRadius: '4px',
                    backgroundColor: '#FFFFFF',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customer Name Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '16px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ 
          fontSize: '14px',
          fontWeight: 600,
          color: '#2B2B2B',
          marginBottom: '16px'
        }}>
          CUSTOMER NAME
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={formData.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            placeholder="Enter customer name"
            style={{
              flex: 1,
              height: '32px',
              padding: '0 12px',
              fontSize: '12px',
              border: '1px solid #D0D0D0',
              borderRadius: '4px',
              backgroundColor: '#FFFFFF'
            }}
          />
          <button style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#EEEEEE',
            border: '1px solid #D0D0D0',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#F44336'
          }}>
            <Trash2 style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={handleDelete}
          style={{
            height: '32px',
            padding: '0 16px',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: '#FFFFFF',
            color: '#F44336',
            borderRadius: '18px',
            border: '1px solid #F44336',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FFF5F5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
        >
          Delete
        </button>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              height: '32px',
              padding: '0 16px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: '#FFFFFF',
              color: '#2B2B2B',
              borderRadius: '18px',
              border: '1px solid #D0D0D0',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F5F5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              height: '32px',
              padding: '0 16px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: '#9BC8A6',
              color: '#FFFFFF',
              borderRadius: '18px',
              border: '1px solid #9BC8A6',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#8BB896';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#9BC8A6';
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};