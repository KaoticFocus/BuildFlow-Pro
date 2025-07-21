import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const JobFlowLogin = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleMagicLink = async () => {
    const redirectUrl = import.meta.env.PROD 
      ? 'https://buildflowproai.netlify.app/jobflow/' 
      : window.location.origin + '/jobflow/';

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Check your email for the magic link!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200 px-4">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 p-3 border rounded w-full max-w-md text-lg"
      />
      <button onClick={handleMagicLink} className="bg-blue-500 text-white p-3 rounded w-full max-w-md text-lg font-medium">
        Send Magic Link
      </button>
      {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
    </div>
  );
};

export default JobFlowLogin;