import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { supabase } from '../utils/supabaseClient';

const JobFlowProjectInfo = ({ projectId }) => {
  const [info, setInfo] = useState({});

  useEffect(() => {
    const fetchInfo = async () => {
      const { data } = await supabase
        .from('projects')
        .select('name, scope, contact_info')
        .eq('id', projectId)
        .single();
      setInfo(data || {});
    };
    fetchInfo();
  }, [projectId]);

  const markdownContent = `
# Project: ${info.name || ''}

Scope: ${info.scope || ''}

Contacts: ${JSON.stringify(info.contact_info || {}, null, 2)}
  `;

  return (
    <div className="p-4 overflow-y-auto">
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: marked(markdownContent) }} />
      <input type="text" placeholder="Add Contact Info" className="mt-4 p-3 border rounded w-full text-lg" onChange={(e) => {/* Update Supabase */}} />
    </div>
  );
};

export default JobFlowProjectInfo;