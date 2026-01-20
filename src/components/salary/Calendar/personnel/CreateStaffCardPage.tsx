import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateStaffCard from './staff-card-create/CreateStaffCard';

const CreateStaffCardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/salary?tab=personnel-register'); // Navigate back to the personnel register list
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen p-4">
      <div className="max-w-[1280px] mx-auto bg-white rounded shadow-sm p-4">
        {/* Back Button */}
        <div className="mb-3">
          <button 
            className="text-[#2E7D32] hover:underline text-xs font-medium"
            onClick={handleBack}
          >
            ← Back to Personnel Register
          </button>
        </div>
        
        {/* Render the CreateStaffCard component */}
        <CreateStaffCard />
      </div>
    </div>
  );
};

export default CreateStaffCardPage;