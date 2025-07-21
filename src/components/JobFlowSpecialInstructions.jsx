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
    setWorkflowStep(2); // Advance to tasks
    navigate('/tasks');
  };

  return (
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">Gather Special Instructions</h1>
      <label>Does it have difficult access?</label>
      <textarea value={accessDifficulty} onChange={(e) => setAccessDifficulty(e.target.value)} className="mb-2 p-2 border rounded w-full" />

      <label>What phases or tasks will require more than one man?</label>
      <textarea value={multiManPhases} onChange={(e) => setMultiManPhases(e.target.value)} className="mb-2 p-2 border rounded w-full" />

      <label>Overall difficulty of the job (1-10):</label>
      <input type="number" min="1" max="10" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="mb-2 p-2 border rounded w-full" />

      <label>List milestones that will have fixed dates (one per line):</label>
      <textarea value={milestones} onChange={(e) => setMilestones(e.target.value)} className="mb-2 p-2 border rounded w-full" />

      <label>Is a dumpster needed?</label>
      <input type="checkbox" checked={dumpsterNeeded} onChange={(e) => setDumpsterNeeded(e.target.checked)} />
      {dumpsterNeeded && <input type="text" placeholder="Dumpster Location" value={dumpsterLocation} onChange={(e) => setDumpsterLocation(e.target.value)} className="mb-2 p-2 border rounded w-full" />}

      <label>Permits needed?</label>
      <input type="checkbox" checked={permitsNeeded} onChange={(e) => setPermitsNeeded(e.target.checked)} />

      <label>Architect needed?</label>
      <input type="checkbox" checked={architectNeeded} onChange={(e) => setArchitectNeeded(e.target.checked)} />

      <button onClick={handleSubmit} className="bg-green-500 text-white p-2 rounded w-full mt-4">Submit Instructions</button>
    </div>
  );
};

export default JobFlowSpecialInstructions;