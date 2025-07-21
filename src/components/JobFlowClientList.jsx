import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Link } from 'react-router-dom';

const JobFlowClientList = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      const { data } = await supabase.from('clients').select('*');
      setClients(data || []);
    };
    fetchClients();
  }, []);

  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">List of Clients</h1>
      <ul className="space-y-2">
        {clients.map(client => (
          <li key={client.id}>
            <Link to={`/project-onboarding?clientId=${client.id}`} className="block bg-gray-200 p-4 rounded-lg text-blue-500 text-center">{client.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobFlowClientList;