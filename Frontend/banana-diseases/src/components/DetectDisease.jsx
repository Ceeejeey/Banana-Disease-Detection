import React, { useState } from 'react';
import axios from "../api/axios";

const DetectDisease = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setResult(null); // Clear previous result when new file drops
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null); // Clear previous result when new file selected
  };

  const handleUpload = async () => {
    if (!file) return alert("Please upload an image first.");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.message) {
        alert(response.data.message);
      }

      setResult(response.data);
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error.response?.data?.detail || "Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (filename) => filename ? `http://localhost:8000/api/images/${filename}` : null;

  return (
    <div className="text-white max-w-h-xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Upload Banana or Banana Leaf Image</h2>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`w-full p-10 border-2 border-dashed rounded-xl cursor-pointer transition 
          ${dragActive ? 'border-green-400 bg-green-900/30' : 'border-gray-600 bg-gray-900/20'}`}
      >
        <input type="file" id="upload" className="hidden" onChange={handleFileChange} />
        <label htmlFor="upload" className="flex flex-col items-center justify-center select-none">
          <span className="text-lg font-medium mb-2">
            {file ? `🖼️ ${file.name}` : 'Drag & drop an image here or click to upload'}
          </span>
          <span className="text-sm text-gray-400">(JPG or PNG, clear banana or banana leaf image preferred)</span>
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`mt-6 w-full py-3 font-semibold rounded-xl transition
          ${loading ? 'bg-green-700 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
      >
        {loading ? "Analyzing..." : "Analyze Image"}
      </button>

      {/* Results */}
      {result && result.detection && (
        <div className="mt-10 bg-gray-800 border border-green-600 rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-semibold mb-5 text-green-400 flex items-center gap-2">
            🧬 Detection Results
          </h3>

          {/* Display Image */}
          {getImageUrl(result.detection.image) ? (
            <img
              src={getImageUrl(result.detection.image)}
              alt="Detected Banana"
              className="rounded-lg max-w-xs border border-green-500 mx-auto mb-6 shadow-md"
            />
          ) : (
            <div className="text-center italic text-gray-500 mb-6">No image available</div>
          )}

          {/* Disease Info */}
          <p className="text-xl font-bold mb-3 text-yellow-300">
            Disease: <span className="text-white">{result.detection.disease}</span>
          </p>

          <p className="mb-5 whitespace-pre-line text-gray-300 leading-relaxed">
            <strong>Solution:</strong> <br />
            {result.detection.solution}
          </p>

          {/* Confidence */}
          <div className="flex items-center gap-2 text-green-400 font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
            Confidence: {(result.detection.confidence * 100).toFixed(2)}%
          </div>
        </div>
      )}
    </div>
  );
};

export default DetectDisease;
