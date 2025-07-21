import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const uploadTypes = [
  'Contract/Contact Info',
  'Labor Hours Spreadsheet',
  'Vendor/Materials List',
  'Sub-Contractor list',
  'Drawings',
  'Photos'
];

const JobFlowFileUpload = ({ projectId, setWorkflowStep }) => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    const { data, error } = await supabase.storage
      .from('files')
      .upload(`${projectId}/${type}/${file.name}`, file);
    if (error) alert(error.message);
    else setFiles([...files, data.path]);
  };

  const handleCompleteUploads = () => {
    setWorkflowStep(1);
    navigate('/instructions');
  };

  useEffect(() => {
    const fetchFiles = async () => {
      const { data } = await supabase.storage.from('files').list(`${projectId}`);
      setFiles(data.map(file => file.name));
    };
    fetchFiles();
  }, [projectId]);

  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Upload Files</h1>
      {uploadTypes.map(type => (
        <div key={type} className="flex flex-col">
          <label className="mb-1 text-lg">{type}</label>
          <input type="file" onChange={(e) => handleUpload(e, type)} className="p-3 border rounded" />
        </div>
      ))}
      <ul className="space-y-2">
        {files.map(file => (
          <li key={file} className="bg-gray-200 p-3 rounded text-center">{file}</li>
        ))}
      </ul>
      <button onClick={handleCompleteUploads} className="bg-green-500 text-white p-4 rounded-lg text-center text-lg font-medium" disabled={files.length === 0}>
        Complete Uploads & Proceed
      </button>
    </div>
  );
};

export default JobFlowFileUpload;