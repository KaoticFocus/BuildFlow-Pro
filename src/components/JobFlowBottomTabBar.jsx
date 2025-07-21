import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowBottomTabBar = ({ workflowStep, onLogout }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex overflow-x-auto p-2 space-x-4">
      <Link to="/uploads" className={workflowStep < 0 ? 'text-gray-500' : 'text-blue-500'} style={{ minWidth: '80px', textAlign: 'center' }}>Upload Files</Link>
      <Link to="/instructions" className={workflowStep < 1 ? 'text-gray-500' : 'text-blue-500'} style={{ minWidth: '80px', textAlign: 'center' }}>Special Instructions</Link>
      <Link to="/tasks" className={workflowStep < 2 ? 'text-gray-500' : 'text-blue-500'} style={{ minWidth: '80px', textAlign: 'center' }}>Create Task List</Link>
      <Link to="/schedule" className={workflowStep < 3 ? 'text-gray-500' : 'text-blue-500'} style={{ minWidth: '80px', textAlign: 'center' }}>Edit & Submit</Link>
      <Link to="/generate-schedules" className={workflowStep < 4 ? 'text-gray-500' : 'text-blue-500'} style={{ minWidth: '80px', textAlign: 'center' }}>Generate Schedules</Link>
      <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="text-red-500" style={{ minWidth: '80px', textAlign: 'center' }}>Log Out</a>
    </div>
  );
};

export default JobFlowBottomTabBar;