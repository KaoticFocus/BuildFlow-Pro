import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const JobFlowSpecialInstructions = ({ projectId, setWorkflowStep }) => {
  const [difficulty, setDifficulty] = useState(5);
  const [milestones, setMilestones] = useState('');
  const [dumpsterNeeded, setDumpsterNeeded] = useState(false);
  const [dumpsterLocation, setDumpsterLocation] = useState('');
  const [permitsNeeded, setPermitsNeeded] = useState(false);
  const [architectNeeded, setArchitectNeeded] = useState(false);
  const [accessDifficulty, setAccessDifficulty] = useState('');
  const [multiManPhases, setMultiManPhases] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const instructions = {
      difficulty,
      milestones: milestones.split('\n'),
      dumpsterNeeded,
      dumpsterLocation,
      permitsNeeded,
      architectNeeded,
      accessDifficulty,
      multiManPhases
    };
    await supabase.from('projects').update({ special_instructions: instructions }).eq('id', projectId);
    setWorkflowStep(2); // Advance to tasks
    navigate('/tasks');
  };

  return (
    <div className="p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">Gather Special Instructions</h1>
      <label>Access Difficulty:</label>
      <textarea value={accessDifficulty} onChange={(e) => setAccessDifficulty(e.target.value)} className="mb-2 p-2 border rounded w-full" />

      <label>Phases Requiring More Than One Man:</label>
      <textarea value={multiManPhases} onChange={(e) => setMultiManPhases(e.target.value)} className="mb-2 p-2 border rounded w-full" />

      <label>Overall Difficulty (1-10):</label>
      <input type="number" min="1" max="10" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="mb-2 p-2 border rounded w-full" />

      <label>Milestones with Fixed Dates (one per line):</label>
      <textarea value={milestones} onChange={(e) => setMilestones(e.target.value)} className="mb-2 p-2 border rounded w-full" />

      <label>Dumpster Needed?</label>
      <input type="checkbox" checked={dumpsterNeeded} onChange={(e) => setDumpsterNeeded(e.target.checked)} />
      {dumpsterNeeded && <input type="text" placeholder="Dumpster Location" value={dumpsterLocation} onChange={(e) => setDumpsterLocation(e.target.value)} className="mb-2 p-2 border rounded w-full" />}

      <label>Permits Needed?</label>
      <input type="checkbox" checked={permitsNeeded} onChange={(e) => setPermitsNeeded(e.target.checked)} />

      <label>Architect Needed?</label>
      <input type="checkbox" checked={architectNeeded} onChange={(e) => setArchitectNeeded(e.target.checked)} />

      <button onClick={handleSubmit} className="bg-green-500 text-white p-2 rounded w-full mt-4">Submit Instructions</button>
    </div>
  );
};

export default JobFlowSpecialInstructions;