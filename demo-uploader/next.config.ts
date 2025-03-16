import { useState } from "react";
import Image from "next/image";
import { uploadFile } from "../utils/fileUpload";

export default function Home() {
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setDragOver(false);

    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".pptx")) {
      setFile(droppedFile);
      setLoading(true);
      setProgress(10);
      await uploadFile(droppedFile, setProgress);
      setLoading(false);
    } else {
      alert("Only .pptx files are allowed!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-900 text-white">
      {!file && (
        <div
          className={`w-full max-w-2xl h-72 border-4 border-dashed rounded-xl flex items-center justify-center text-lg font-semibold transition-all shadow-lg ${
            dragOver ? "bg-gray-800 border-blue-500 scale-105" : "bg-gray-700 border-gray-500"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p className="opacity-75">Drag & Drop a <span className="text-blue-400">.pptx</span> file here</p>
        </div>
      )}
      {loading && (
        <div className="w-full max-w-lg mt-6">
          <div className="relative w-full bg-gray-700 h-4 rounded overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center mt-2 text-sm opacity-75">Uploading {progress}%</p>
        </div>
      )}
    </div>
  );
}
