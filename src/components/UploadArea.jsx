import React, { useState } from 'react';

const UploadArea = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      // Add upload logic here (e.g., to Supabase or API)
      console.log('Uploading file:', file.name);
    }
  };

  return (
    <div className="upload-area p-4 border rounded bg-white">
      <h2>Upload File</h2>
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded">
        Upload
      </button>
    </div>
  );
};

export default UploadArea;