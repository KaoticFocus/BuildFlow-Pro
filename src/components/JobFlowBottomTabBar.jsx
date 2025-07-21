import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowBottomTabBar = ({ workflowStep }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2">
      <Link to="/uploads" className={workflowStep < 0 ? 'text-gray-500' : 'text-blue-500'}>Uploads</Link>
      <Link to="/instructions" className={workflowStep < 1 ? 'text-gray-500' : 'text-blue-500'}>Instructions</Link>
      <Link to="/tasks" className={workflowStep < 2 ? 'text-gray-500' : 'text-blue-500'}>Tasks</Link>
      <Link to="/schedule" className={workflowStep < 3 ? 'text-gray-500' : 'text-blue-500'}>Schedule</Link>
      <Link to="/generate-schedules" className={workflowStep < 4 ? 'text-gray-500' : 'text-blue-500'}>Generate Schedules</Link>
    </div>
  );
};

export default JobFlowBottomTabBar;