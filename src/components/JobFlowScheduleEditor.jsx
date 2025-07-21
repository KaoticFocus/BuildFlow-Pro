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
    setWorkflowStep(4);
    navigate('/generate-schedules');
  };

  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">User Edits & Submits</h1>
      <label className="text-lg">Pick Start Date:</label>
      <input type="date" value={params.startDate} onChange={(e) => setParams({ ...params, startDate: e.target.value })} className="p-3 border rounded w-full text-lg" />

      <label className="text-lg">Exclude Weekends:</label>
      <input type="checkbox" checked={params.weekends} onChange={(e) => setParams({ ...params, weekends: e.target.checked })} className="h-6 w-6" />

      <label className="text-lg">Half Days on Fridays:</label>
      <input type="checkbox" checked={params.halfDays} onChange={(e) => setParams({ ...params, halfDays: e.target.checked })} className="h-6 w-6" />

      <label className="text-lg">Holidays (one per line, YYYY-MM-DD):</label>
      <textarea value={params.holidays} onChange={(e) => setParams({ ...params, holidays: e.target.value })} className="p-3 border rounded w-full text-lg" />

      <button onClick={handleSave} className="bg-green-500 text-white p-4 rounded-lg text-center text-lg font-medium">Save and Generate Schedules</button>
    </div>
  );
};

export default JobFlowScheduleEditor;