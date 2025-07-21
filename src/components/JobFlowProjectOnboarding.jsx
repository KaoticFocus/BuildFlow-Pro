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
      setWorkflowStep(0);
      navigate('/uploads');
    }
  };

  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Project Onboarding</h1>
      <input type="text" placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} className="p-3 border rounded w-full text-lg" />
      <textarea placeholder="Project Scope" value={scope} onChange={(e) => setScope(e.target.value)} className="p-3 border rounded w-full text-lg" />
      <button onClick={handleSubmit} className="bg-green-500 text-white p-4 rounded-lg text-center text-lg font-medium">Save Project & Start Workflow</button>
    </div>
  );
};

export default JobFlowProjectOnboarding;