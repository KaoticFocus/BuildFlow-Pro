import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const JobFlowClientSearch = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Client Search</h1>
      <input type="text" placeholder="Search clients" value={search} onChange={(e) => setSearch(e.target.value)} className="p-3 border rounded w-full text-lg" />
      <Link to="/client-list" className="bg-blue-500 text-white p-4 rounded-lg text-center text-lg font-medium">View List of Clients</Link>
    </div>
  );
};

export default JobFlowClientSearch;