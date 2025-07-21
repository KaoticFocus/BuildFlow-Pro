import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Link } from 'react-router-dom';

const JobFlowPreConList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from('projects').select('*').eq('status', 'pre-con');
      setProjects(data || []);
    };
    fetchProjects();
  }, []);

  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">List of Projects that haven't started yet</h1>
      <ul className="space-y-2">
        {projects.map(project => (
          <li key={project.id}>
            <Link to={`/call-backs-list?projectId=${project.id}`} className="block bg-gray-200 p-4 rounded-lg text-blue-500 text-center">{project.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobFlowPreConList;