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
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">List of Projects that haven't started yet</h1>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <Link to={`/call-backs-list?projectId=${project.id}`} className="text-blue-500">{project.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobFlowPreConList;