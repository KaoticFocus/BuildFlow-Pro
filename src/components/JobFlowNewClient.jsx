import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowNewClient = () => {
  return (
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">New Client</h1>
      <Link to="/client-onboarding" className="block bg-blue-500 text-white p-2 rounded">Client Onboarding</Link>
    </div>
  );
};

export default JobFlowNewClient;