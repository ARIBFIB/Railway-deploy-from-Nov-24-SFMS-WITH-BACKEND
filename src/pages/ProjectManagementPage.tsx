import React, { useState } from 'react';
import { ProjectManagementList } from '../components/ProjectManagement/ProjectManagementList';
import { ProjectManagementForm } from '../components/ProjectManagement/ProjectManagementForm';

export const ProjectManagementPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const handleCreateProject = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleFormCreateProject = () => {
    // This would handle creating a new project from the form
    console.log('Creating new project from form');
    setShowForm(false);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {showForm ? (
        <ProjectManagementForm 
          onClose={handleCloseForm}
          onCreateProject={handleFormCreateProject}
        />
      ) : (
        <ProjectManagementList onCreateProject={handleCreateProject} />
      )}
    </div>
  );
};