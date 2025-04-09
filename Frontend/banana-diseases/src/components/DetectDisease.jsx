import React, { useState } from 'react';
import axios from "../api/axios";

const DetectDisease = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please upload an image first.");
  
    const formData = new FormData();
    formData.append("file", file); // Match FastAPI's parameter name: 'file'
  
    try {
      const response = await axios.post("/api/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      setResult(response.data); // FastAPI returns {disease, solution, confidence}
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error.response?.data?.detail || "Failed to analyze image");
    }
  };
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">📤 Upload Banana Image</h2>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`w-full p-10 border-2 border-dashed rounded-xl transition ${
          dragActive ? 'border-green-400 bg-gray-800/30' : 'border-gray-600 bg-gray-800/10'
        }`}
      >
        <input type="file" id="upload" className="hidden" onChange={handleFileChange} />
        <label htmlFor="upload" className="flex flex-col items-center justify-center cursor-pointer">
          <span className="text-lg mb-2">{file ? `🖼️ ${file.name}` : 'Drag & drop image here or click to upload'}</span>
          <span className="text-sm text-gray-400">(JPG / PNG, preferably clear banana image)</span>
        </label>
      </div>

      <button
        onClick={handleUpload}
        className="mt-6 px-6 py-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition"
      >
        Analyze Image
      </button>

      {/* Results */}
      {result && (
        <div className="mt-10 p-6 bg-gray-800 border border-gray-700 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-green-400">🧬 Detection Results</h3>
          <p><strong>Disease:</strong> {result.disease}</p>
          <p><strong>Solution:</strong> {result.solution}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
        </div>
      )}
    </div>
  );
};

export default DetectDisease;
