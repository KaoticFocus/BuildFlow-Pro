import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const JobFlowScheduleEditor = ({ projectId }) => {
  const [params, setParams] = useState({ weekends: false, halfDays: false, holidays: '' });

  useEffect(() => {
    const fetchParams = async () => {
      const { data } = await supabase.from('projects').select('schedule_params').eq('id', projectId).single();
      setParams(data?.schedule_params || {});
    };
    fetchParams();
  }, [projectId]);

  const handleSave = async () => {
    await supabase.from('projects').update({ schedule_params: params }).eq('id', projectId);
  };

  return (
    <div className="p-4 overflow-y-auto">
      <label className="block mb-2">
        <input
          type="checkbox"
          checked={params.weekends}
          onChange={(e) => setParams({ ...params, weekends: e.target.checked })}
        />
        Exclude Weekends
      </label>
      <label className="block mb-2">
        <input
          type="checkbox"
          checked={params.halfDays}
          onChange={(e) => setParams({ ...params, halfDays: e.target.checked })}
        />
        Half Days on Fridays
      </label>
      <textarea
        placeholder="Holidays (one per line, YYYY-MM-DD)"
        value={params.holidays}
        onChange={(e) => setParams({ ...params, holidays: e.target.value })}
        className="mb-2 p-2 border rounded w-full"
      />
      <button onClick={handleSave} className="bg-green-500 text-white p-2 rounded w-full">
        Save Baseline Schedule
      </button>
    </div>
  );
};

export default JobFlowScheduleEditor;