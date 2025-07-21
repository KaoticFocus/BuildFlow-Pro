import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const uploadTypes = [
  'Contract/Contact Info',
  'Labor Hours Spreadsheet',
  'Vendor/Materials List',
  'Sub-Contractor List',
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
    setWorkflowStep(1); // Advance to instructions
    navigate('/instructions');
  };

  useEffect(() => {
    // Fetch existing files
    const fetchFiles = async () => {
      const { data } = await supabase.storage.from('files').list(`${projectId}`);
      setFiles(data.map(file => file.name));
    };
    fetchFiles();
  }, [projectId]);

  return (
    <div className="p-4 overflow-y-auto">
      {uploadTypes.map(type => (
        <div key={type} className="mb-4">
          <label>{type}</label>
          <input type="file" onChange={(e) => handleUpload(e, type)} className="block" />
        </div>
      ))}
      <ul className="mt-4">
        {files.map(file => (
          <li key={file}>
            <a href={`#`} className="text-blue-500"> {/* Use signed URL for preview */} {file}</a>
          </li>
        ))}
      </ul>
      <button onClick={handleCompleteUploads} className="bg-green-500 text-white p-2 rounded w-full mt-4">Complete Uploads & Proceed</button>
    </div>
  );
};

export default JobFlowFileUpload;