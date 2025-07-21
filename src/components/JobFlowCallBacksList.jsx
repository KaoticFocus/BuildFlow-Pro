import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useLocation } from 'react-router-dom';

const JobFlowCallBacksList = () => {
  const [callBacks, setCallBacks] = useState([]);
  const location = useLocation();
  const projectId = new URLSearchParams(location.search).get('projectId');

  useEffect(() => {
    const fetchCallBacks = async () => {
      const { data } = await supabase.from('projects').select('call_backs').eq('id', projectId).single();
      setCallBacks(data.call_backs || []);
    };
    if (projectId) fetchCallBacks();
  }, [projectId]);

  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">List of call backs that need to be addressed</h1>
      <ul className="space-y-2">
        {callBacks.map((cb, index) => (
          <li key={index} className="bg-gray-200 p-4 rounded-lg">{cb}</li>
        ))}
      </ul>
    </div>
  );
};

export default JobFlowCallBacksList;