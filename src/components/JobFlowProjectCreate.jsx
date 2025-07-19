import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const JobFlowProjectCreate = ({ setProjectId }) => {
  const [name, setName] = useState('');
  const [scope, setScope] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('projects')
      .insert([{ name, scope, user_id: user.id }])
      .select();
    if (error) alert(error.message);
    else {
      setProjectId(data[0].id);
      navigate('/info');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Create Project</h1>
      <input
        type="text"
        placeholder="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-2 p-2 border rounded w-full"
      />
      <textarea
        placeholder="Project Scope"
        value={scope}
        onChange={(e) => setScope(e.target.value)}
        className="mb-2 p-2 border rounded w-full"
      />
      <button onClick={handleCreate} className="bg-green-500 text-white p-2 rounded w-full">
        Create Project
      </button>
    </div>
  );
};

export default JobFlowProjectCreate;