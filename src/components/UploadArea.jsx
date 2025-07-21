import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const UploadArea = ({ projectId, onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const { data, error } = await supabase.storage
      .from('files')
      .upload(`${projectId}/uploads/${file.name}`, file, {
        upsert: true,
      });
    setUploading(false);

    if (error) {
      alert('Upload failed: ' + error.message);
    } else {
      setFiles([...files, data.path]);
      if (onUploadComplete) onUploadComplete();
    }
  };

  useEffect(() => {
    const fetchFiles = async () => {
      if (projectId) {
        const { data } = await supabase.storage.from('files').list(`${projectId}/uploads`);
        setFiles(data.map(file => file.name));
      }
    };
    fetchFiles();
  }, [projectId]);

  return (
    <div className="p-4 flex flex-col space-y-4 overflow-y-auto">
      <h2 className="text-xl font-bold text-center mb-4">Upload Area</h2>
      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        className="p-3 border rounded w-full text-lg"
      />
      {uploading && <p className="text-center text-yellow-500">Uploading...</p>}
      <ul className="space-y-2">
        {files.map(file => (
          <li key={file} className="bg-gray-200 p-3 rounded-lg text-center">
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadArea;