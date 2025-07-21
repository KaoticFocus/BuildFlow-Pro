import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const JobFlowClosedList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from('projects').select('*').eq('status', 'closed');
      setProjects(data || []);
    };
    fetchProjects();
  }, []);

  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">List of projects that are finished</h1>
      <ul className="space-y-2">
        {projects.map(project => (
          <li key={project.id} className="bg-gray-200 p-4 rounded-lg">{project.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default JobFlowClosedList;