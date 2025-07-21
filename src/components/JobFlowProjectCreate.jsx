import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const JobFlowProjectCreate = ({ setProjectId, setWorkflowStep }) => {
  const [name, setName] = useState('');
  const [scope, setScope] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('projects')
      .insert([{ name, scope, user_id: user.id, status: 'pre-con' }])
      .select();
    if (error) alert(error.message);
    else {
      setProjectId(data[0].id);
      setWorkflowStep(0); // Start at uploads
      navigate('/uploads');
    }
  };

  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Create Project</h1>
      <input
        type="text"
        placeholder="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-3 border rounded w-full text-lg"
      />
      <textarea
        placeholder="Project Scope"
        value={scope}
        onChange={(e) => setScope(e.target.value)}
        className="p-3 border rounded w-full text-lg"
      />
      <button onClick={handleCreate} className="bg-green-500 text-white p-4 rounded-lg text-center text-lg font-medium">Create Project</button>
    </div>
  );
};

export default JobFlowProjectCreate;