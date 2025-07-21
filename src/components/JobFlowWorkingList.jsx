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
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">List of project that are in production</h1>
      <ul className="space-y-2">
        {projects.map(project => (
          <li key={project.id}>
            <Link to={`/info?projectId=${project.id}`} className="block bg-gray-200 p-4 rounded-lg text-blue-500 text-center">{project.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobFlowWorkingList;