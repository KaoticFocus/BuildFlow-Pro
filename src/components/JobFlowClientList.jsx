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
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">List of Clients</h1>
      <ul>
        {clients.map(client => (
          <li key={client.id}>
            <Link to={`/project-onboarding?clientId=${client.id}`} className="text-blue-500">{client.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobFlowClientList;