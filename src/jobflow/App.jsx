import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import JobFlowLogin from '../components/JobFlowLogin';
import JobFlowProjectCreate from '../components/JobFlowProjectCreate';
import JobFlowProjectInfo from '../components/JobFlowProjectInfo';
import JobFlowFileUpload from '../components/JobFlowFileUpload';
import JobFlowTaskGenerator from '../components/JobFlowTaskGenerator';
import JobFlowScheduleEditor from '../components/JobFlowScheduleEditor';
import JobFlowBottomTabBar from '../components/JobFlowBottomTabBar';

const JobFlowApp = () => {
  const [session, setSession] = useState(null);
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!session) {
    return <JobFlowLogin />;
  }

  return (
    <Router>
      <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<JobFlowProjectCreate setProjectId={setProjectId} />} />
            <Route path="/info" element={<JobFlowProjectInfo projectId={projectId} />} />
            <Route path="/uploads" element={<JobFlowFileUpload projectId={projectId} />} />
            <Route path="/tasks" element={<JobFlowTaskGenerator projectId={projectId} />} />
            <Route path="/schedule" element={<JobFlowScheduleEditor projectId={projectId} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <JobFlowBottomTabBar />
      </div>
    </Router>
  );
};

export default JobFlowApp;