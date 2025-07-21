import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import JobFlowLogin from '../components/JobFlowLogin';
import JobFlowHome from '../components/JobFlowHome';
import JobFlowOtherApps from '../components/JobFlowOtherApps';
import JobFlowNewProject from '../components/JobFlowNewProject';
import JobFlowExistingClient from '../components/JobFlowExistingClient';
import JobFlowNewClient from '../components/JobFlowNewClient';
import JobFlowClientSearch from '../components/JobFlowClientSearch';
import JobFlowClientList from '../components/JobFlowClientList';
import JobFlowClientOnboarding from '../components/JobFlowClientOnboarding';
import JobFlowProjectOnboarding from '../components/JobFlowProjectOnboarding';
import JobFlowPreConProjects from '../components/JobFlowPreConProjects';
import JobFlowPreConList from '../components/JobFlowPreConList';
import JobFlowWorkingProjects from '../components/JobFlowWorkingProjects';
import JobFlowWorkingList from '../components/JobFlowWorkingList';
import JobFlowCallBacks from '../components/JobFlowCallBacks';
import JobFlowCallBacksList from '../components/JobFlowCallBacksList';
import JobFlowClosedProjects from '../components/JobFlowClosedProjects';
import JobFlowClosedList from '../components/JobFlowClosedList';
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
  const [workflowStep, setWorkflowStep] = useState(0);

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
      <div className="flex flex-col h-screen overflow-hidden bg-gray-100 max-w-screen-sm mx-auto"> {/* Mobile centering */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <Routes>
            <Route path="/" element={<JobFlowHome />} />
            <Route path="/other-apps" element={<JobFlowOtherApps />} />
            <Route path="/new-project" element={<JobFlowNewProject setProjectId={setProjectId} setWorkflowStep={setWorkflowStep} />} />
            <Route path="/existing-client" element={<JobFlowExistingClient />} />
            <Route path="/new-client" element={<JobFlowNewClient />} />
            <Route path="/client-search" element={<JobFlowClientSearch />} />
            <Route path="/client-list" element={<JobFlowClientList />} />
            <Route path="/client-onboarding" element={<JobFlowClientOnboarding />} />
            <Route path="/project-onboarding" element={<JobFlowProjectOnboarding setWorkflowStep={setWorkflowStep} />} />
            <Route path="/pre-con" element={<JobFlowPreConProjects />} />
            <Route path="/pre-con-list" element={<JobFlowPreConList />} />
            <Route path="/working" element={<JobFlowWorkingProjects />} />
            <Route path="/working-list" element={<JobFlowWorkingList />} />
            <Route path="/call-backs" element={<JobFlowCallBacks />} />
            <Route path="/call-backs-list" element={<JobFlowCallBacksList />} />
            <Route path="/closed" element={<JobFlowClosedProjects />} />
            <Route path="/closed-list" element={<JobFlowClosedList />} />
            <Route path="/project-create" element={<JobFlowProjectCreate setProjectId={setProjectId} setWorkflowStep={setWorkflowStep} />} />
            <Route path="/info" element={<JobFlowProjectInfo projectId={projectId} />} />
            <Route path="/uploads" element={workflowStep >= 0 ? <JobFlowFileUpload projectId={projectId} setWorkflowStep={setWorkflowStep} /> : <Navigate to="/" />} />
            <Route path="/instructions" element={workflowStep >= 1 ? <JobFlowSpecialInstructions projectId={projectId} setWorkflowStep={setWorkflowStep} /> : <Navigate to="/uploads" />} />
            <Route path="/tasks" element={workflowStep >= 2 ? <JobFlowTaskGenerator projectId={projectId} setWorkflowStep={setWorkflowStep} /> : <Navigate to="/instructions" />} />
            <Route path="/schedule" element={workflowStep >= 3 ? <JobFlowScheduleEditor projectId={projectId} setWorkflowStep={setWorkflowStep} /> : <Navigate to="/tasks" />} />
            <Route path="/generate-schedules" element={workflowStep >= 4 ? <JobFlowGenerateSchedules projectId={projectId} setWorkflowStep={setWorkflowStep} /> : <Navigate to="/schedule" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <JobFlowBottomTabBar workflowStep={workflowStep} onLogout={handleLogout} />
      </div>
    </Router>
  );
};

export default JobFlowApp;