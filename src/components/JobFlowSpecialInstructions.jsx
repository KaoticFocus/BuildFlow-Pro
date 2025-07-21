import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const JobFlowSpecialInstructions = ({ projectId, setWorkflowStep }) => {
  const [accessDifficulty, setAccessDifficulty] = useState('');
  const [multiManPhases, setMultiManPhases] = useState('');
  const [difficulty, setDifficulty] = useState(5);
  const [milestones, setMilestones] = useState('');
  const [dumpsterNeeded, setDumpsterNeeded] = useState(false);
  const [dumpsterLocation, setDumpsterLocation] = useState('');
  const [permitsNeeded, setPermitsNeeded] = useState(false);
  const [architectNeeded, setArchitectNeeded] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const instructions = {
      accessDifficulty,
      multiManPhases,
      difficulty: parseInt(difficulty),
      milestones: milestones.split('\n').filter(m => m.trim()),
      dumpsterNeeded,
      dumpsterLocation,
      permitsNeeded,
      architectNeeded
    };
    await supabase.from('projects').update({ special_instructions: instructions }).eq('id', projectId);
    setWorkflowStep(2);
    navigate('/tasks');
  };

  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Gather Special Instructions</h1>
      <label className="text-lg">Does it have difficult access?</label>
      <textarea value={accessDifficulty} onChange={(e) => setAccessDifficulty(e.target.value)} className="p-3 border rounded w-full text-lg" />

      <label className="text-lg">What phases or tasks will require more than one man?</label>
      <textarea value={multiManPhases} onChange={(e) => setMultiManPhases(e.target.value)} className="p-3 border rounded w-full text-lg" />

      <label className="text-lg">Overall difficulty of the job (1-10):</label>
      <input type="number" min="1" max="10" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="p-3 border rounded w-full text-lg" />

      <label className="text-lg">List milestones that will have fixed dates (one per line):</label>
      <textarea value={milestones} onChange={(e) => setMilestones(e.target.value)} className="p-3 border rounded w-full text-lg" />

      <label className="text-lg">Is a dumpster needed?</label>
      <input type="checkbox" checked={dumpsterNeeded} onChange={(e) => setDumpsterNeeded(e.target.checked)} className="h-6 w-6" />
      {dumpsterNeeded && <input type="text" placeholder="Dumpster Location" value={dumpsterLocation} onChange={(e) => setDumpsterLocation(e.target.value)} className="p-3 border rounded w-full text-lg" />}

      <label className="text-lg">Permits needed?</label>
      <input type="checkbox" checked={permitsNeeded} onChange={(e) => setPermitsNeeded(e.target.checked)} className="h-6 w-6" />

      <label className="text-lg">Architect needed?</label>
      <input type="checkbox" checked={architectNeeded} onChange={(e) => setArchitectNeeded(e.target.checked)} className="h-6 w-6" />

      <button onClick={handleSubmit} className="bg-green-500 text-white p-4 rounded-lg text-center text-lg font-medium">Submit Instructions</button>
    </div>
  );
};

export default JobFlowSpecialInstructions;