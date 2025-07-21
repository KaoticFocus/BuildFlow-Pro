import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import JobFlowLogin from '../components/JobFlowLogin';
import JobFlowProjectCreate from '../components/JobFlowProjectCreate';
import JobFlowProjectInfo from '../components/JobFlowProjectInfo';
import JobFlowFileUpload from '../components/JobFlowFileUpload';
import JobFlowSpecialInstructions from '../components/JobFlowSpecialInstructions';
import JobFlowTaskGenerator from '../components/JobFlowTaskGenerator';
import JobFlowScheduleEditor from '../components/JobFlowScheduleEditor';
import JobFlowGenerateSchedules from '../components/JobFlowGenerateSchedules';
import JobFlowBottomTabBar from '../components/JobFlowBottomTabBar';

const JobFlowApp = () => {
  const [session, setSession] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [workflowStep, setWorkflowStep] = useState(0); // 0=uploads, 1=instructions, 2=tasks, 3=edit/submit, 4=schedules

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProjectId(null);
    setWorkflowStep(0);
  };

  if (!session) {
    return <JobFlowLogin />;
  }

  return (
    <Router basename="/jobflow/">
      <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<JobFlowProjectCreate setProjectId={setProjectId} setWorkflowStep={setWorkflowStep} />} />
            <Route path="/info" element={<JobFlowProjectInfo projectId={projectId} />} />
            <Route path="/uploads" element={workflowStep === 0 ? <JobFlowFileUpload projectId={projectId} setWorkflowStep={setWorkflowStep} /> : <Navigate to={workflowStep > 0 ? '/instructions' : '/'} />} />
            <Route path="/instructions" element={workflowStep === 1 ? <JobFlowSpecialInstructions projectId={projectId} setWorkflowStep={setWorkflowStep} /> : <Navigate to={workflowStep < 1 ? '/uploads' : workflowStep > 1 ? '/tasks' : '/'} />} />
            <Route path="/tasks" element={workflowStep === 2 ? <JobFlowTaskGenerator projectId={projectId} setWorkflowStep={setWorkflowStep} /> : <Navigate to={workflowStep < 2 ? '/instructions' : workflowStep > 2 ? '/schedule' : '/'} />} />
            <Route path="/schedule" element={workflowStep === 3 ? <JobFlowScheduleEditor projectId={projectId} setWorkflowStep={setWorkflowStep} /> : <Navigate to={workflowStep < 3 ? '/tasks' : workflowStep > 3 ? '/generate-schedules' : '/'} />} />
            <Route path="/generate-schedules" element={workflowStep === 4 ? <JobFlowGenerateSchedules projectId={projectId} /> : <Navigate to={workflowStep < 4 ? '/schedule' : '/'} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <JobFlowBottomTabBar workflowStep={workflowStep} onLogout={handleLogout} />
      </div>
    </Router>
  );
};

export default JobFlowApp;