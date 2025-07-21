import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';

const JobFlowProjectOnboarding = ({ setWorkflowStep }) => {
  const [name, setName] = useState('');
  const [scope, setScope] = useState('');
  const location = useLocation();
  const clientId = new URLSearchParams(location.search).get('clientId');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const { data } = await supabase.from('projects').insert([{ name, scope, client_id: clientId }]).select();
    if (data) {
      setWorkflowStep(0); // Start workflow
      navigate('/uploads');
    }
  };

  return (
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">Project Onboarding</h1>
      <input type="text" placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} className="mb-2 p-2 border rounded w-full" />
      <textarea placeholder="Project Scope" value={scope} onChange={(e) => setScope(e.target.value)} className="mb-2 p-2 border rounded w-full" />
      <button onClick={handleSubmit} className="bg-green-500 text-white p-2 rounded w-full">Save Project & Start Workflow</button>
    </div>
  );
};

export default JobFlowProjectOnboarding;