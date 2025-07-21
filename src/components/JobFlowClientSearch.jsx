import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const JobFlowClientSearch = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">Client Search</h1>
      <input type="text" placeholder="Search clients" value={search} onChange={(e) => setSearch(e.target.value)} className="mb-2 p-2 border rounded w-full" />
      <Link to="/client-list" className="block bg-blue-500 text-white p-2 rounded">View List of Clients</Link>
    </div>
  );
};

export default JobFlowClientSearch;