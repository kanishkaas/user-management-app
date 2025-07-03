// src/components/DownloadTemplate.tsx
import React from "react";

const DownloadTemplate: React.FC = () => {
  const downloadSample = () => {
    window.open("http://localhost:5000/api/users/sample", "_blank");
  };

  return (
    <button className="btn btn-outline-secondary" onClick={downloadSample}>
      Download Sample Excel
    </button>
  );
};

export default DownloadTemplate;
