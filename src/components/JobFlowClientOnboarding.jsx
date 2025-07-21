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
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">Client Onboarding</h1>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="mb-2 p-2 border rounded w-full" />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-2 p-2 border rounded w-full" />
      <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mb-2 p-2 border rounded w-full" />
      <textarea placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="mb-2 p-2 border rounded w-full" />
      <button onClick={handleSubmit} className="bg-green-500 text-white p-2 rounded w-full">Save Client & Proceed to Project Onboarding</button>
    </div>
  );
};

export default JobFlowClientOnboarding;