import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowPreConProjects = () => {
  return (
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">Pre-Con Projects</h1>
      <Link to="/pre-con-list" className="block bg-green-500 text-white p-2 rounded">List of Projects that haven't started yet</Link>
    </div>
  );
};

export default JobFlowPreConProjects;