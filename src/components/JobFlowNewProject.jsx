import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowNewProject = ({ setProjectId, setWorkflowStep }) => {
  // Functionality to initialize project (e.g., create in Supabase)
  const handleStart = () => {
    // Mock project creation
    setProjectId('new-project-id');
    setWorkflowStep(0); // Start workflow
  };

  return (
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">New Project</h1>
      <Link to="/existing-client" className="block bg-green-500 text-white p-2 rounded mb-2">Existing Client</Link>
      <Link to="/new-client" className="block bg-green-500 text-white p-2 rounded">New Client</Link>
      <button onClick={handleStart} className="bg-blue-500 text-white p-2 rounded w-full mt-4">Start Project Workflow</button>
    </div>
  );
};

export default JobFlowNewProject;