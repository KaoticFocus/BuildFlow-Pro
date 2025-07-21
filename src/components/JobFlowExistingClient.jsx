import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowExistingClient = () => {
  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Existing Client</h1>
      <Link to="/client-search" className="bg-blue-500 text-white p-4 rounded-lg text-center text-lg font-medium">Client Search</Link>
    </div>
  );
};

export default JobFlowExistingClient;