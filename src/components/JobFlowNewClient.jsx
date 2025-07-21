import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowNewClient = () => {
  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">New Client</h1>
      <Link to="/client-onboarding" className="bg-blue-500 text-white p-4 rounded-lg text-center text-lg font-medium">Client Onboarding</Link>
    </div>
  );
};

export default JobFlowNewClient;