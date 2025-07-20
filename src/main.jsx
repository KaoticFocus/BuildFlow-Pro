import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';  // Assume App.jsx renders your components like UploadArea
import './index.css';  // If you have global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);