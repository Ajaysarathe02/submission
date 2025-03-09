// Code to upload files to Supabase storage
import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient"

const Uploadex = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileurl] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {

    try {
      if (!file) {
        alert('Please select a file to upload');
        return;
      }
      console.log("file upload start");
      const filepath = `public/${file.name}`;

      const { data, error } = await supabase.storage
        .from('submission')
        .upload(filepath, file);

      if (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
      } else {
        console.log('File uploaded successfully:', data);
        alert('File uploaded successfully');
      }

      const { data: url } = await supabase.storage
      .from("submission")
      .getPublicUrl(filepath);

      setFileurl(url.publicUrl);
      console.log(url.publicUrl);
    }
    catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="w-full h-[100vh] flex flex-col items-center justify-center">
      <h1 className="text-black mb-4">Upload files</h1>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">
        Upload
      </button>
      <p>{fileUrl}</p>
    </div>
  );
};

export default Uploadex; 