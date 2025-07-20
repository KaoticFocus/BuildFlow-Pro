import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const JobFlowLogin = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleMagicLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/jobflow/',  // Redirect back to app after click
      },
    });
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Check your email for the magic link!');
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center h-screen bg-gray-200">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 p-2 border rounded w-full max-w-md"
      />
      <button onClick={handleMagicLink} className="bg-blue-500 text-white p-2 rounded w-full max-w-md">
        Send Magic Link
      </button>
      {message && <p className="mt-2 text-red-500">{message}</p>}
    </div>
  );
};

export default JobFlowLogin;