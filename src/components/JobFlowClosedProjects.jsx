import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowClosedProjects = () => {
  return (
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">Closed Projects</h1>
      <Link to="/closed-list" className="block bg-green-500 text-white p-2 rounded">List of projects that are finished</Link>
    </div>
  );
};

export default JobFlowClosedProjects;