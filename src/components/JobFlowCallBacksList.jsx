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
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">List of call backs that need to be addressed</h1>
      <ul>
        {callBacks.map((cb, index) => (
          <li key={index}>{cb}</li>
        ))}
      </ul>
    </div>
  );
};

export default JobFlowCallBacksList;