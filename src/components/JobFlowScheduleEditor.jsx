import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const JobFlowScheduleEditor = ({ projectId, setWorkflowStep }) => {
  const [params, setParams] = useState({ startDate: '', weekends: false, halfDays: false, holidays: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParams = async () => {
      const { data } = await supabase.from('projects').select('schedule_params').eq('id', projectId).single();
      setParams(data?.schedule_params || {});
    };
    fetchParams();
  }, [projectId]);

  const handleSave = async () => {
    await supabase.from('projects').update({ schedule_params: params }).eq('id', projectId);
    setWorkflowStep(5); // Advance to generate schedules
    navigate('/generate-schedules');
  };

  return (
    <div className="p-4 overflow-y-auto">
      <label>Start Date:</label>
      <input type="date" value={params.startDate} onChange={(e) => setParams({ ...params, startDate: e.target.value })} className="mb-2 p-2 border rounded w-full" />

      <label>Exclude Weekends:</label>
      <input type="checkbox" checked={params.weekends} onChange={(e) => setParams({ ...params, weekends: e.target.checked })} />

      <label>Half Days on Fridays:</label>
      <input type="checkbox" checked={params.halfDays} onChange={(e) => setParams({ ...params, halfDays: e.target.checked })} />

      <label>Holidays (one per line, YYYY-MM-DD):</label>
      <textarea value={params.holidays} onChange={(e) => setParams({ ...params, holidays: e.target.value })} className="mb-2 p-2 border rounded w-full" />

      <button onClick={handleSave} className="bg-green-500 text-white p-2 rounded w-full">
        Save and Generate Schedules
      </button>
    </div>
  );
};

export default JobFlowScheduleEditor;