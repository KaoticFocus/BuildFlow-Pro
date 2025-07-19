import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const JobFlowLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleAuth = async () => {
    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center h-screen bg-gray-200">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 p-2 border rounded w-full max-w-md"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-2 p-2 border rounded w-full max-w-md"
      />
      <button onClick={handleAuth} className="bg-blue-500 text-white p-2 rounded w-full max-w-md">
        {isSignup ? 'Sign Up' : 'Login'}
      </button>
      <button onClick={() => setIsSignup(!isSignup)} className="mt-2 text-blue-500">
        {isSignup ? 'Switch to Login' : 'Switch to Sign Up'}
      </button>
    </div>
  );
};

export default JobFlowLogin;