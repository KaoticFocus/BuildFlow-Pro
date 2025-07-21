import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowCallBacks = () => {
  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Call Backs</h1>
      <Link to="/call-backs-list" className="bg-green-500 text-white p-4 rounded-lg text-center text-lg font-medium">List of call backs that need to be addressed</Link>
    </div>
  );
};

export default JobFlowCallBacks;