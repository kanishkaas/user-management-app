import React, { useState } from "react";
import axios from "axios";


const ExcelUpload: React.FC<{ onUploadSuccess: () => void }> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage("");
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/users/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.message) {
        setMessage("Upload successful!");
        onUploadSuccess();
      } else if (res.data.details) {
        setMessage("Errors found:\n" + res.data.details.map((d: any) => `Row ${d.row}: ${d.error}`).join("\n"));
      }
    } catch (error) {
      console.error(error);
      setMessage(" Upload failed.");
    }
  };

  const downloadSample = () => {
    window.open("http://localhost:5000/api/users/sample", "_blank");
  };

  return (
    <div className="mb-4">
      <div className="d-flex flex-column flex-sm-row gap-2 align-items-start align-items-sm-center">
        <input type="file" className="form-control" onChange={handleFileChange} accept=".xlsx" />
        <button className="btn btn-primary" onClick={handleUpload}>
          Upload Excel
        </button>
        <button className="btn btn-outline-secondary" onClick={downloadSample}>
          Download Sample
        </button>
      </div>
      {message && <div className="alert alert-info mt-2 white-space-pre-wrap">{message}</div>}
    </div>
  );
};

export default ExcelUpload;
