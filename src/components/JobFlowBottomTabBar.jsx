import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowBottomTabBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2">
      <Link to="/uploads" className="text-blue-500">Uploads</Link>
      <Link to="/tasks" className="text-blue-500">Tasks</Link>
      <Link to="/schedule" className="text-blue-500">Schedule</Link>
      <Link to="/info" className="text-blue-500">Photos/Info</Link> {/* Photos in info or separate */}
    </div>
  );
};

export default JobFlowBottomTabBar;