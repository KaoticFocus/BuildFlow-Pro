import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { generateTasks } from '../utils/taskGenerator';
import { marked } from 'marked';

const JobFlowTaskGenerator = ({ projectId }) => {
  const [scope, setScope] = useState('');
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await supabase.from('tasks').select('task_list').eq('project_id', projectId).single();
      setTaskList(data?.task_list || []);
    };
    fetchTasks();
  }, [projectId]);

  const handleGenerate = async () => {
    const newTasks = generateTasks(scope);
    setTaskList(newTasks);
    await supabase.from('tasks').upsert({ project_id: projectId, task_list: newTasks });
  };

  return (
    <div className="p-4 overflow-y-auto">
      <textarea
        placeholder="Project Scope for AI"
        value={scope}
        onChange={(e) => setScope(e.target.value)}
        className="mb-2 p-2 border rounded w-full"
      />
      <button onClick={handleGenerate} className="bg-blue-500 text-white p-2 rounded w-full mb-4">
        Create Daily Task List
      </button>
      <ul>
        {taskList.map((task, index) => (
          <li key={index}>
            <input
              type="text"
              value={task}
              onChange={(e) => {
                const updated = [...taskList];
                updated[index] = e.target.value;
                setTaskList(updated);
              }}
              className="p-1 border rounded w-full mb-2"
            />
            <div dangerouslySetInnerHTML={{ __html: marked(task) }} /> {/* Task description in markdown */}
          </li>
        ))}
      </ul>
      <button onClick={async () => await supabase.from('tasks').update({ task_list: taskList }).eq('project_id', projectId)} className="bg-green-500 text-white p-2 rounded w-full mt-4">
        Save Edits
      </button>
    </div>
  );
};

export default JobFlowTaskGenerator;