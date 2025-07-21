import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowExistingClient = () => {
  return (
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">Existing Client</h1>
      <Link to="/client-search" className="block bg-blue-500 text-white p-2 rounded">Client Search</Link>
    </div>
  );
};

export default JobFlowExistingClient;