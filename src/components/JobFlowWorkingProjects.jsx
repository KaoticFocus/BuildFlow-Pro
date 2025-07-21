import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowWorkingProjects = () => {
  return (
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">Working Projects</h1>
      <Link to="/working-list" className="block bg-green-500 text-white p-2 rounded">List of project that are in production</Link>
    </div>
  );
};

export default JobFlowWorkingProjects;