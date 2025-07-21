import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { marked } from 'marked';

const JobFlowGenerateSchedules = ({ projectId }) => {
  const [baseline, setBaseline] = useState([]);
  const [working, setWorking] = useState([]);
  const [params, setParams] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('projects').select('schedule_params').eq('id', projectId).single();
      setParams(data.schedule_params || {});

      const { data: tasksData } = await supabase.from('tasks').select('baseline_task_list').eq('project_id', projectId).single();
      const baselineTasks = tasksData.baseline_task_list || [];

      // Generate working schedule (simple copy with params applied)
      const workingTasks = baselineTasks.map((task, index) => {
        let day = `Day ${index + 1}`;
        if (params.startDate) day += ` (${new Date(params.startDate).toLocaleDateString()})`;
        return `${day}: ${task}`;
      });
      setBaseline(baselineTasks);
      setWorking(workingTasks);
    };
    fetchData();
  }, [projectId]);

  return (
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">Generated Schedules</h1>
      <h2>Baseline Schedule</h2>
      <ul>
        {baseline.map((task, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: marked(task) }} />
        ))}
      </ul>
      <h2>Working Schedule (with Params)</h2>
      <ul>
        {working.map((task, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: marked(task) }} />
        ))}
      </ul>
    </div>
  );
};

export default JobFlowGenerateSchedules;