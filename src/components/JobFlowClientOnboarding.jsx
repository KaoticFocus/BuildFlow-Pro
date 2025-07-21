import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const JobFlowClientOnboarding = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const { data } = await supabase.from('clients').insert([{ name, email, phone, address }]).select();
    if (data) navigate(`/project-onboarding?clientId=${data[0].id}`);
  };

  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Client Onboarding</h1>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="p-3 border rounded w-full text-lg" />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 border rounded w-full text-lg" />
      <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="p-3 border rounded w-full text-lg" />
      <textarea placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="p-3 border rounded w-full text-lg" />
      <button onClick={handleSubmit} className="bg-green-500 text-white p-4 rounded-lg text-center text-lg font-medium">Save Client & Proceed to Project Onboarding</button>
    </div>
  );
};

export default JobFlowClientOnboarding;