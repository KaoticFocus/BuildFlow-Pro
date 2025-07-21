import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowOtherApps = () => {
  return (
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">Other Apps</h1>
      <Link to="/" className="text-blue-500">Back to Home</Link>
      <ul>
        <li><a href="/renorecap" className="text-blue-500">RenoRecap</a> - Transcription Tool</li>
        {/* Add more apps as needed */}
      </ul>
    </div>
  );
};

export default JobFlowOtherApps;