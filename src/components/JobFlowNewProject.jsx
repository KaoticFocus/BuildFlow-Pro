import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowNewProject = ({ setProjectId, setWorkflowStep }) => {
  // Mock project creation
  const handleStart = () => {
    setProjectId('new-project-id');
    setWorkflowStep(0);
  };

  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">New Project</h1>
      <Link to="/existing-client" className="bg-green-500 text-white p-4 rounded-lg text-center text-lg font-medium">Existing Client</Link>
      <Link to="/new-client" className="bg-green-500 text-white p-4 rounded-lg text-center text-lg font-medium">New Client</Link>
      <button onClick={handleStart} className="bg-blue-500 text-white p-4 rounded-lg text-center text-lg font-medium">Start Project Workflow</button>
    </div>
  );
};

export default JobFlowNewProject;