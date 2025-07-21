import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowClosedProjects = () => {
  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Closed Projects</h1>
      <Link to="/closed-list" className="bg-green-500 text-white p-4 rounded-lg text-center text-lg font-medium">List of projects that are finished</Link>
    </div>
  );
};

export default JobFlowClosedProjects;