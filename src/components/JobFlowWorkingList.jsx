import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Link } from 'react-router-dom';

const JobFlowWorkingList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from('projects').select('*').eq('status', 'working');
      setProjects(data || []);
    };
    fetchProjects();
  }, []);

  return (
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">List of project that are in production</h1>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <Link to={`/info?projectId=${project.id}`} className="text-blue-500">{project.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobFlowWorkingList;