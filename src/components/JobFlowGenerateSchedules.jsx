import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { marked } from 'marked';

const JobFlowGenerateSchedules = ({ projectId }) => {
  const [baseline, setBaseline] = useState([]);
  const [working, setWorking] = useState([]);
  const [params, setParams] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const { data: projectData } = await supabase.from('projects').select('schedule_params').eq('id', projectId).single();
      setParams(projectData.schedule_params || {});

      const { data: tasksData } = await supabase.from('tasks').select('baseline_task_list').eq('project_id', projectId).single();
      const baselineTasks = tasksData.baseline_task_list || [];

      // Generate working schedule with params
      const workingTasks = baselineTasks.map((task, index) => {
        let day = `Day ${index + 1}`;
        if (params.startDate) day += ` (${new Date(params.startDate).toLocaleDateString()})`;
        if (params.weekends && [6, 7].includes(new Date(params.startDate).getDay() + index)) day += ' (Weekend)';
        return `${day}: ${task}`;
      });
      setBaseline(baselineTasks);
      setWorking(workingTasks);
    };
    fetchData();
  }, [projectId]);

  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">AI Generated Schedules</h1>
      <h2 className="text-xl font-bold">Baseline Schedule</h2>
      <ul className="space-y-2">
        {baseline.map((task, index) => (
          <li key={index} className="bg-gray-200 p-3 rounded prose max-w-none" dangerouslySetInnerHTML={{ __html: marked(task) }} />
        ))}
      </ul>
      <h2 className="text-xl font-bold">Working Schedule</h2>
      <ul className="space-y-2">
        {working.map((task, index) => (
          <li key={index} className="bg-gray-200 p-3 rounded prose max-w-none" dangerouslySetInnerHTML={{ __html: marked(task) }} />
        ))}
      </ul>
    </div>
  );
};

export default JobFlowGenerateSchedules;