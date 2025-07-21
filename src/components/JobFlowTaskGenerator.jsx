import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { generateTasks } from '../utils/taskGenerator';
import { marked } from 'marked';
import { useNavigate } from 'react-router-dom';

const JobFlowTaskGenerator = ({ projectId, setWorkflowStep }) => {
  const [scope, setScope] = useState('');
  const [instructions, setInstructions] = useState({});
  const [taskList, setTaskList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('projects').select('scope, special_instructions').eq('id', projectId).single();
      setScope(data.scope || '');
      setInstructions(data.special_instructions || {});
    };
    fetchData();
  }, [projectId]);

  const handleGenerate = async () => {
    const newTasks = generateTasks(scope, instructions);
    setTaskList(newTasks);
    await supabase.from('tasks').upsert({ project_id: projectId, task_list: newTasks });
  };

  const handleSubmitBaseline = async () => {
    await supabase.from('tasks').update({ baseline_task_list: taskList }).eq('project_id', projectId);
    setWorkflowStep(3);
    navigate('/schedule');
  };

  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Create Daily Task List</h1>
      <p className="text-center">Based on scope and instructions: Difficulty {instructions.difficulty}, Milestones: {instructions.milestones?.join(', ')}</p>
      <button onClick={handleGenerate} className="bg-blue-500 text-white p-4 rounded-lg text-center text-lg font-medium" disabled={taskList.length > 0}>
        Generate Editable Baseline
      </button>
      <ul className="space-y-2">
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
              className="p-3 border rounded w-full text-lg mb-2"
            />
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: marked(task) }} />
          </li>
        ))}
      </ul>
      <button onClick={handleSubmitBaseline} className="bg-green-500 text-white p-4 rounded-lg text-center text-lg font-medium" disabled={taskList.length === 0}>
        Submit as Baseline Schedule
      </button>
    </div>
  );
};

export default JobFlowTaskGenerator;