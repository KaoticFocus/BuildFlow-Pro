import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowCallBacks = () => {
  return (
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">Call Backs</h1>
      <Link to="/call-backs-list" className="block bg-green-500 text-white p-2 rounded">List of call backs that need to be addressed</Link>
    </div>
  );
};

export default JobFlowCallBacks;