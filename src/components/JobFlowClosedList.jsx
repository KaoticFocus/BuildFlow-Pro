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
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">List of projects that are finished</h1>
      <ul>
        {projects.map(project => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default JobFlowClosedList;