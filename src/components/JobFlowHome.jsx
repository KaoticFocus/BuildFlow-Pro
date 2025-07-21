import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowHome = () => {
  return (
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">Home</h1>
      <Link to="/other-apps" className="block bg-blue-500 text-white p-2 rounded mb-2">Other Apps</Link>
      <Link to="/new-project" className="block bg-orange-500 text-white p-2 rounded mb-2">New Project</Link>
      <Link to="/pre-con" className="block bg-orange-500 text-white p-2 rounded mb-2">Pre-Con Projects</Link>
      <Link to="/working" className="block bg-orange-500 text-white p-2 rounded mb-2">Working Projects</Link>
      <Link to="/call-backs" className="block bg-orange-500 text-white p-2 rounded mb-2">Call Backs</Link>
      <Link to="/closed" className="block bg-orange-500 text-white p-2 rounded">Closed Projects</Link>
    </div>
  );
};

export default JobFlowHome;