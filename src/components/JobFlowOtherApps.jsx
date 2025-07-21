import React from 'react';
import { Link } from 'react-router-dom';

const JobFlowOtherApps = () => {
  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Other Apps</h1>
      <Link to="/" className="text-blue-500 text-center">Back to Home</Link> |
      <ul className="space-y-2">
        <li><a href="/renorecap" className="block bg-gray-200 p-4 rounded-lg text-blue-500 text-center">RenoRecap - Transcription Tool</a></li>
        {/* Add more as needed */}
      </ul>
    </div>
  );
};

export default JobFlowOtherApps;