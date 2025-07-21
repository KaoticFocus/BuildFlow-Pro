import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowPreConProjects = () => {
  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Pre-Con Projects</h1>
      <Link to="/pre-con-list" className="bg-green-500 text-white p-4 rounded-lg text-center text-lg font-medium">List of Projects that haven't started yet</Link>
    </div>
  );
};

export default JobFlowPreConProjects;