import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowHome = () => {
  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Home</h1>
      <Link to="/other-apps" className="bg-blue-500 text-white p-4 rounded-lg text-center text-lg font-medium">Other Apps</Link>
      <Link to="/new-project" className="bg-orange-500 text-white p-4 rounded-lg text-center text-lg font-medium">New Project</Link>
      <Link to="/pre-con" className="bg-orange-500 text-white p-4 rounded-lg text-center text-lg font-medium">Pre-Con Projects</Link>
      <Link to="/working" className="bg-orange-500 text-white p-4 rounded-lg text-center text-lg font-medium">Working Projects</Link>
      <Link to="/call-backs" className="bg-orange-500 text-white p-4 rounded-lg text-center text-lg font-medium">Call Backs</Link>
      <Link to="/closed" className="bg-orange-500 text-white p-4 rounded-lg text-center text-lg font-medium">Closed Projects</Link>
    </div>
  );
};

export default JobFlowHome;