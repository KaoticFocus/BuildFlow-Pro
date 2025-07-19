import React from 'react';
import ReactDOM from 'react-dom/client';
import JobFlowApp from './App';
import '../styles/index.css'; // Assume global styles from existing

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <JobFlowApp />
  </React.StrictMode>
);